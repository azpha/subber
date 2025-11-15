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

    const updatedSettings = await Database.settings.upsert({
      create: {
        id: 1,
        ...body,
      },
      update: {
        ...body,
      },
      where: {
        id: 1,
      },
      select: {
        discordWebhook: true,
        ntfyWebhook: true,
        budget: true,
      },
    });

    res.status(200).json(updatedSettings);
    return;
  } catch (e) {
    next(e);
  }
}

async function resetSettings(req: Request, res: Response, next: NextFunction) {
  try {
    await Database.settings.delete({
      where: {
        id: 1,
      },
    });

    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
}

async function getSettings(req: Request, res: Response, next: NextFunction) {
  try {
    const settings = await Database.settings.findFirst({
      where: {
        id: 1,
      },
      select: {
        discordWebhook: true,
        ntfyWebhook: true,
        budget: true,
      },
    });

    res.status(200).json(settings || {});
    return;
  } catch (e) {
    next(e);
  }
}

async function testDiscordWebhook(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const webhook = await Database.settings.findFirst({
      where: {
        id: 1,
      },
      select: {
        discordWebhook: true,
      },
    });

    if (webhook?.discordWebhook) {
      const payload = {
        username: "Subscriptions",
        embeds: [
          {
            title: "It works!",
            description:
              "Your subscription-tracker Discord webhook configuration works!",
          },
        ],
      };

      const result = await fetch(webhook.discordWebhook, {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (result.ok) {
        res.sendStatus(204);
        return;
      } else {
        res.status(500).json({
          status: 500,
          message: "Failed to dispatch webhook!",
        });
        return;
      }
    } else {
      return res.status(400).json({
        status: 400,
        message: "Discord webhook not configured",
      });
    }
  } catch (e) {
    next(e);
  }
}

async function testNtfyWebhook(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const webhook = await Database.settings.findFirst({
      where: {
        id: 1,
      },
      select: {
        ntfyWebhook: true,
      },
    });

    if (webhook?.ntfyWebhook) {
      const host = new URL(webhook.ntfyWebhook);

      const payload = {
        topic: host.pathname.replace("/", ""),
        title: "It works!",
        message: "Your subscription-tracker notification configuration works!",
        priority: 4,
        click: `${process.env.BASE_URL}/`,
      };

      const result = await fetch(host.origin, {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (result.ok) {
        res.status(204);
        return;
      } else {
        res.status(500).json({
          status: 500,
          message: "Failed to dispatch webhook!",
        });
        return;
      }
    } else {
      return res.status(400).json({
        status: 400,
        message: "Ntfy host not configured",
      });
    }
  } catch (e) {
    next(e);
  }
}

export default {
  getApplicationVersion,
  updateSetting,
  getSettings,
  resetSettings,
  testDiscordWebhook,
  testNtfyWebhook,
};
