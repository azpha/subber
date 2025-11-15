import { useState, useEffect, FormEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
  FieldSet,
  FieldSeparator,
  FieldLegend,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  hydrateSettings,
  updateAllSettings,
} from "@/store/thunks/settingsThunks";
import type { Settings } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { request } from "@/lib/api";

export default function Settings() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const allSettings = useAppSelector((state) => state.settings.settings);
  const [testError, setTestError] = useState<{
    type: "discord" | "ntfy" | "none";
    message: string;
  }>({
    type: "none",
    message: "",
  });
  const [editValues, setEditValues] = useState<Settings>({
    budget: allSettings?.budget || undefined,
    discordWebhook: allSettings?.discordWebhook || undefined,
    ntfyWebhook: allSettings?.ntfyWebhook || undefined,
  });

  useEffect(() => {
    dispatch(hydrateSettings());
  }, []);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(editValues);

    dispatch(updateAllSettings(editValues));
  };

  const testDiscordWebhook = async () => {
    try {
      const req = await request(
        "settings/notifications/discord",
        "POST",
        null,
        null
      );
      if (!req.status) {
        setTestError({
          type: "discord",
          message: "Couldn't send webhook. Please ensure your URL is valid",
        });
      } else {
        setTestError({
          type: "none",
          message: "",
        });
      }
    } catch (e) {
      console.error(e);
      setTestError({
        type: "discord",
        message: "Something went wrong!",
      });
    }
  };
  const testNtfyWebhook = async () => {
    try {
      const req = await request(
        "settings/notifications/ntfy",
        "POST",
        null,
        null
      );
      if (!req.status) {
        setTestError({
          type: "ntfy",
          message: "Couldn't send webhook. Please ensure your URL is valid",
        });
      } else {
        setTestError({
          type: "none",
          message: "",
        });
      }
    } catch (e) {
      console.error(e);
      setTestError({
        type: "ntfy",
        message: "Something went wrong!",
      });
    }
  };

  return (
    <div className="bg-neutral-950 flex justify-center items-center min-h-screen">
      <div className="w-1/4">
        <p
          onClick={() => navigate("/")}
          className="text-white text-xs p-2 opacity-50 hover:cursor-pointer"
        >
          <ArrowLeft className="inline" size={15} /> Home
        </p>
        <form onSubmit={onSubmit}>
          <Card className="dark w-full">
            <CardContent>
              <FieldGroup>
                <FieldSet>
                  <FieldLegend>Notification Settings</FieldLegend>
                  <FieldDescription>
                    Get notified when subscriptions are expiring soon
                  </FieldDescription>
                  <FieldGroup>
                    <Field>
                      <FieldLabel>Discord Webhook URL</FieldLabel>
                      <FieldDescription>
                        Used for sending expiry notifications
                      </FieldDescription>
                      <Input
                        onChange={(e) => {
                          setEditValues((prevState) => {
                            return {
                              ...prevState,
                              discordWebhook: e.target.value,
                            };
                          });
                        }}
                        defaultValue={allSettings?.discordWebhook}
                        placeholder="https://discordapp.com/api/webhooks/"
                      />
                      <Button
                        type={"button"}
                        onClick={testDiscordWebhook}
                        variant={"secondary"}
                      >
                        Test
                      </Button>
                      {testError.type == "discord" && (
                        <p className="opacity-85 text-red-500 font-semibold text-xs">
                          {testError.message}
                        </p>
                      )}
                    </Field>
                    <Field>
                      <FieldLabel>Ntfy Webhook URL</FieldLabel>
                      <FieldDescription>
                        Used for sending expiry notifications
                      </FieldDescription>
                      <Input
                        onChange={(e) => {
                          setEditValues((prevState) => {
                            return {
                              ...prevState,
                              ntfyWebhook: e.target.value,
                            };
                          });
                        }}
                        defaultValue={allSettings?.ntfyWebhook}
                        placeholder="https://push.example.com/"
                      />
                      <Button
                        type="button"
                        onClick={testNtfyWebhook}
                        variant={"secondary"}
                      >
                        Test
                      </Button>
                      {testError.type == "ntfy" && (
                        <p className="opacity-85 text-red-500 font-semibold text-xs">
                          {testError.message}
                        </p>
                      )}
                    </Field>
                  </FieldGroup>
                </FieldSet>
                <FieldSeparator />
                <FieldSet>
                  <FieldLegend>Usage Settings</FieldLegend>
                  <FieldDescription>Budget settings</FieldDescription>
                  <FieldGroup>
                    <Field>
                      <FieldLabel>Budget</FieldLabel>
                      <FieldDescription>Your max budget</FieldDescription>
                      <Input
                        onChange={(e) => {
                          setEditValues((prevState) => {
                            return {
                              ...prevState,
                              budget: e.target.value,
                            };
                          });
                        }}
                        defaultValue={allSettings?.budget}
                        placeholder="$2.22"
                      />
                    </Field>
                  </FieldGroup>
                </FieldSet>
              </FieldGroup>

              <div className="mt-4">
                <Button type="submit" className="w-full">
                  Submit
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
