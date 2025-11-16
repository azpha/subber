import { Subscription } from "../../../../prisma/generated/prisma";

type NtfyPayload = {
  topic: string;
  title: string;
  message: string;
  priority: number;
  click: string | null;
};
type DiscordWebhook = {
  username: string;
  embeds: DiscordEmbed[];
};
type DiscordEmbed = {
  title: string;
  url?: string;
  description: string;
  color: number;
  fields: DiscordEmbedField[];
};
type DiscordEmbedField = {
  name: string;
  value: string;
  inline: boolean;
};

const sendPushNotification = async (
  title: string,
  message: string,
  url: string
) => {
  const host = new URL(url);

  const payload = {
    topic: host.pathname.replace("/", ""),
    title: "Subscriptions Expiring!",
    message: "You have multiple subscriptions expiring soon!",
    priority: 4,
    click: null,
  } as NtfyPayload;
  if (process.env.BASE_URL) {
    payload.click = `${process.env.BASE_URL}/`;
  }

  return await fetch(host.origin, {
    method: "post",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};

const sendDiscordMessage = async (
  expiring: Subscription[],
  webhook: string
) => {
  const DISCORD_WEBHOOK_SCHEMA: DiscordWebhook = {
    username: "Subscriptions",
    embeds: [
      {
        title: "Subscriptions expiring!",
        description: "You have subscriptions expiring soon!",
        color: 16711680,
        fields: [],
      },
    ],
  };
  if (process.env.BASE_URL) {
    DISCORD_WEBHOOK_SCHEMA.embeds[0].url = `${process.env.BASE_URL}/?filter=7-days`;
  }

  const fields = expiring.map((v) => {
    return {
      name: v.name,
      value: `${new Date(v.nextBillingDate).toLocaleDateString()}\n$${v.price}`,
      inline: true,
    };
  });
  DISCORD_WEBHOOK_SCHEMA.embeds[0].fields = fields;

  return await fetch(webhook as string, {
    method: "post",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(DISCORD_WEBHOOK_SCHEMA),
  });
};

export default {
  sendPushNotification,
  sendDiscordMessage,
};
