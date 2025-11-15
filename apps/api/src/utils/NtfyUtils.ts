import { Subscription } from "../../../../prisma/generated/prisma";

const sendAllPushNotification = () => {
  const host = new URL(process.env.NTFY_HOST as string);

  const payload = {
    topic: host.pathname.replace("/", ""),
    title: "Subscriptions Expiring!",
    message: "You have multiple subscriptions expiring soon!",
    priority: 4,
    click: `${process.env.BASE_URL}/?filter=7-days`,
  };

  return fetch(host.origin, {
    method: "post",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};

const sendSpecificPushNotification = (subscription: Subscription) => {
  const host = new URL(process.env.NTFY_HOST as string);

  const payload = {
    topic: host.pathname.replace("/", ""),
    title: `'${subscription.name}' expiring!`,
    message: `${subscription.name} ($${Number(subscription.price).toFixed(
      2
    )}, ${subscription.paymentMethod}) is expiring on ${new Date(
      subscription.nextBillingDate
    ).toLocaleDateString()}!`,
    priority: 4,
    click: `${process.env.BASE_URL}/?filter=7-days`,
  };

  return fetch(host.origin, {
    method: "post",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};

export default {
  sendAllPushNotification,
  sendSpecificPushNotification,
};
