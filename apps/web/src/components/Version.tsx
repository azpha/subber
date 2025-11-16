import { request } from "@/lib/api";
import { useEffect, useState } from "react";

export default function Version() {
  const [version, setVersion] = useState<string>("");

  useEffect(() => {
    const fetchVersion = async () => {
      const apiVersion = await request("settings/version", "GET", null, null);

      if (apiVersion.status) {
        setVersion(apiVersion.body.version);
      }
    };

    fetchVersion();
  }, []);

  return (
    <div className="text-white opacity-50">
      {version && (
        <a
          href={`https://github.com/azpha/subscription-tracker/releases/${version}`}
          target="_blank"
        >
          <p>Version: {version}</p>
        </a>
      )}
    </div>
  );
}
