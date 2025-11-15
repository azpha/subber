import { type ReactNode } from "react";

export default function ConfigTile({
  icon,
  title,
  action,
  actionLabel,
  actionDisabled = false,
  message,
}: {
  icon: ReactNode;
  title: string;
  actionLabel: string;
  actionDisabled?: boolean;
  action: () => void;
  message?: ReactNode;
}) {
  return (
    <div className="rounded-lg p-2 border-solid border-black/90 bg-zinc-900 w-fit text-center">
      {icon}

      <h1 className="font-semibold">{title}</h1>
      {actionDisabled && <p className="font-semibold text-red-500">Disabled</p>}
      {!actionDisabled && (
        <>
          <button
            onClick={action}
            disabled={actionDisabled}
            type="button"
            className="bg-white text-center text-black font-semibold p-1 text-sm rounded-lg"
          >
            {actionLabel}
          </button>
          {message}
        </>
      )}
    </div>
  );
}
