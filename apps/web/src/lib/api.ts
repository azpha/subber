type RequestTypes = "GET" | "POST" | "PATCH" | "DELETE";
const BASE_URL =
  import.meta.env.VITE_BASE_URL || `${location.protocol}//${location.host}/api`;

export async function request(
  path: string,
  method: RequestTypes,
  headers: object | undefined | null,
  body: object | undefined | null
) {
  const stringBody = body ? JSON.stringify(body) : null;
  const data = await fetch(BASE_URL + `/${path}`, {
    method,
    headers: {
      ...headers,
    },
    body: stringBody,
  });

  let parsedBody;
  try {
    parsedBody = await data.json();
  } catch (e) {
    console.warn("Couldn't parse, ignoring request body", e);
  }

  return {
    status: data.ok,
    body: parsedBody,
  };
}

// async function fetchItems(params?: string): Promise<Subscription[]> {
//   const path = params ? `/items?${params}` : "/items";

//   return fetch(BASE_URL + path).then(async (res) => {
//     if (res.ok) {
//       const data = await res.json();
//       return data.data as Subscription[];
//     } else throw new Error("Invalid response from API");
//   });
// }

// async function createItem(subscription: Subscription): Promise<Response> {
//   return fetch(BASE_URL + "/items", {
//     method: "POST",
//     headers: {
//       "content-type": "application/json",
//     },
//     body: JSON.stringify(subscription),
//   })
//     .then(async (res) => {
//       const body = await res.json();
//       let error = "";
//       if (body.issues) {
//         error = body.issues[0].message;
//       } else {
//         error = body.message;
//       }

//       return {
//         status: res.ok,
//         error: error,
//       };
//     })
//     .catch((err) => {
//       return {
//         status: false,
//         error: err,
//       };
//     });
// }

// async function updateItem(subscription: Subscription): Promise<Response> {
//   const { id, ...deconstructedSubscription } = subscription;
//   return fetch(BASE_URL + "/items/" + id, {
//     method: "PATCH",
//     headers: {
//       "content-type": "application/json",
//     },
//     body: JSON.stringify(deconstructedSubscription),
//   })
//     .then(async (res) => {
//       const body = await res.json();

//       let error = "";
//       if (body.issues) {
//         error = body.issues[0].message;
//       } else {
//         error = body.message;
//       }

//       return {
//         status: res.ok,
//         error: error,
//       };
//     })
//     .catch(async (e) => {
//       console.error("Failed to update item", e);
//       return {
//         status: false,
//         error: e,
//       };
//     });
// }

// async function deleteItem(id: number): Promise<boolean> {
//   return fetch(BASE_URL + "/items/" + id, {
//     method: "DELETE",
//   })
//     .then((res) => {
//       return res.ok;
//     })
//     .catch((e) => {
//       console.error("Failed to delete item", e);
//       return false;
//     });
// }

// async function fetchVersion(): Promise<string> {
//   return fetch(BASE_URL + "/settings/version", {
//     method: "GET",
//   }).then(async (res) => {
//     if (res.ok) {
//       const body = await res.json();
//       return body.version;
//     } else throw new Error("Failed to fetch version");
//   });
// }

// async function fetchConfigStatus(): Promise<NotificationConfiguration> {
//   return fetch(BASE_URL + "/settings/notifications", {
//     method: "get",
//   }).then(async (res) => {
//     const body = await res.json();
//     return body?.data as NotificationConfiguration;
//   });
// }

// async function testDiscordWebhook(): Promise<boolean> {
//   return fetch(BASE_URL + "/settings/notifications/test/discord", {
//     method: "post",
//   }).then((res) => res.ok);
// }

// async function testNtfyPush(): Promise<boolean> {
//   return fetch(BASE_URL + "/settings/notifications/test/ntfy", {
//     method: "post",
//   }).then((res) => res.ok);
// }

// export default {
//   fetchItems,
//   createItem,
//   updateItem,
//   deleteItem,
//   fetchVersion,
//   fetchConfigStatus,
//   testDiscordWebhook,
//   testNtfyPush,
// };
