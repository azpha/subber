import cron from "node-cron";
import Database from "./utils/Database";
import Notify from "./utils/Notify";
import "dotenv/config";

const isDevelopmentFlagEnabled =
  (process.env.SHORT_CRON_EXPIRY as string) === "true";

async function job(settings: { discordWebhook: string; ntfyWebhook: string }) {
  const currentDatePlusSeven = new Date();
  currentDatePlusSeven.setDate(currentDatePlusSeven.getDate() + 7);

  const expiringSoonSubscriptions = await Database.subscription.findMany({
    where: {
      nextBillingDate: {
        gte: new Date(),
        lte: currentDatePlusSeven,
      },
    },
  });

  if (expiringSoonSubscriptions.length > 0) {
    let inUnderWeek = [];
    for (const subscription of expiringSoonSubscriptions) {
      const differenceInMs = Math.abs(
        new Date().getTime() - subscription.nextBillingDate.getTime()
      );
      const diffInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));

      if (diffInDays <= 7) {
        inUnderWeek.push(subscription);
      }
      if (diffInDays === 0) {
        const newBillingDate = new Date(subscription.nextBillingDate);
        newBillingDate.setMonth(
          newBillingDate.getMonth() + subscription.billingFrequencyInMonths
        );

        await Database.subscription.update({
          where: {
            id: subscription.id,
          },
          data: {
            nextBillingDate: newBillingDate,
            lastBillingDate: subscription.nextBillingDate,
            totalSpend: subscription.totalSpend.add(subscription.price),
          },
        });
      }
    }

    if (inUnderWeek.length > 0) {
      if (settings.discordWebhook) {
        await Notify.sendDiscordMessage(inUnderWeek, settings.discordWebhook);
      }
      if (settings.ntfyWebhook) {
        await Notify.sendPushNotification(
          inUnderWeek.length > 1
            ? `Subscriptions expiring!`
            : `${inUnderWeek[0].name} expiring!`,
          "You have subscriptions expiring soon!",
          settings.ntfyWebhook
        );
      }
    }
  }
}

(async () => {
  const settings = await Database.settings.findFirst({
    where: {
      id: 1,
    },
    select: {
      discordWebhook: true,
      ntfyWebhook: true,
    },
  });

  if (!settings?.discordWebhook && !settings?.ntfyWebhook) {
    console.warn(
      "[CRON] No webhook settings defined, not starting cron schedule"
    );
    return;
  } else if (!process.env.BASE_URL) {
    console.warn("[CRON] No base URL defined!");
  }

  if (isDevelopmentFlagEnabled) {
    cron.schedule("*/5 * * * * *", () => {
      console.log("5 seconds");
      job(settings);
    });
  } else {
    cron.schedule("0 0 */1 * *", () => {
      job(settings);
    });
  }
})();
