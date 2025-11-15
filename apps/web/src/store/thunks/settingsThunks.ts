import { Settings } from "@/lib/types";
import { AppDispatch } from "..";
import { updateSettings } from "../reducers/settingsSlice";
import { request } from "@/lib/api";

export const hydrateSettings = () => async (dispatch: AppDispatch) => {
  try {
    const settings = await request("settings", "GET", null, null);
    if (settings.status) {
      dispatch(updateSettings(settings.body));
    }
  } catch (e) {
    console.error("Failed to fetch settings!", e);
  }
};

export const updateAllSettings =
  (settings: Settings) => async (dispatch: AppDispatch) => {
    try {
      await request(
        "settings",
        "PATCH",
        { "content-type": "application/json" },
        settings
      );

      dispatch(hydrateSettings());
    } catch (e) {
      console.error("Failed to update settings!", e);
    }
  };
