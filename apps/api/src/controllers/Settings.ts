import type { Request, Response, NextFunction } from "express";
import { settings, validSettings } from "../utils/Schemas";
import Database from "../utils/Database";

async function getApplicationVersion(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const version = process.env.APPLICATION_VERSION as string;
    return res.status(200).json({
      status: 200,
      version,
    });
  } catch (e) {
    next(e);
  }
}

async function updateSetting(req: Request, res: Response, next: NextFunction) {
  try {
    const body = settings.updateSettings.parse(req.body);

    const doesSettingExist = await Database.settings.findFirst({
      where: {
        name: body.name,
      },
    });

    if (!doesSettingExist) {
      const setting = await Database.settings.create({
        data: {
          ...body,
        },
      });
      res.status(200).json(setting);
    } else {
      const setting = await Database.settings.update({
        data: {
          value: body.value,
        },
        where: {
          name: body.name,
        },
      });
      res.status(200).json(setting);
    }
  } catch (e) {
    next(e);
  }
}

async function resetSetting(req: Request, res: Response, next: NextFunction) {
  try {
    const setting = validSettings.parse(req.body.name);
    await Database.settings.delete({
      where: {
        name: setting,
      },
    });

    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
}

async function getSettings(req: Request, res: Response, next: NextFunction) {
  try {
    const settings = await Database.settings.findMany();
    res.status(200).json(settings);
  } catch (e) {
    next(e);
  }
}

// async function GetWebhookStatus(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<any> {
//   try {
//     const discord = process.env.DISCORD_WEBHOOK as string;
//     const ntfy = process.env.NTFY_HOST as string;

//     return res.status(200).json({
//       status: 200,
//       data: {
//         discord: !!discord,
//         ntfy: !!ntfy,
//       },
//     });
//   } catch (e) {
//     next(e);
//   }
// }

// async function TestWebhook(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<any> {
//   try {
//     if (process.env.DISCORD_WEBHOOK) {
//       const payload = {
//         username: "Subscriptions",
//         embeds: [
//           {
//             title: "It works!",
//             url: `${process.env.BASE_URL}/`,
//             description:
//               "Your subscription-tracker Discord webhook configuration works!",
//             color: 16711680,
//           },
//         ],
//       };

//       const result = await fetch(process.env.DISCORD_WEBHOOK, {
//         method: "post",
//         headers: {
//           "content-type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       res.status(result.status).json({
//         status: result,
//       });
//     } else {
//       return res.status(400).json({
//         status: 400,
//         message: "Discord webhook not configured",
//       });
//     }
//   } catch (e) {
//     next(e);
//   }
// }

// async function TestPushNotification(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<any> {
//   try {
//     if (process.env.NTFY_HOST) {
//       const host = new URL(process.env.NTFY_HOST);

//       const payload = {
//         topic: host.pathname.replace("/", ""),
//         title: "It works!",
//         message: "Your subscription-tracker notification configuration works!",
//         priority: 4,
//         click: `${process.env.BASE_URL}/`,
//       };

//       const result = await fetch(host.origin, {
//         method: "post",
//         headers: {
//           "content-type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       res.status(result.status).json({
//         status: result,
//       });
//     } else {
//       return res.status(400).json({
//         status: 400,
//         message: "Ntfy host not configured",
//       });
//     }
//   } catch (e) {
//     next(e);
//   }
// }

export default {
  getApplicationVersion,
  updateSetting,
  getSettings,
  resetSetting,
};
