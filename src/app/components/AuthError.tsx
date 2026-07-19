import { XMarkIcon } from "@heroicons/react/24/outline";

interface AuthErrorProps {
  error: string;
}

export default function AuthError({ error }: AuthErrorProps) {
  if (!error) return null;

  return (
    <div className="flex text-xs font-semibold bg-red-950/30 border border-red-500/20 p-3.5 rounded-2xl w-full items-center backdrop-blur-sm">
      <div className="flex-shrink-0">
        <XMarkIcon
          className="h-5 w-5 text-red-400"
          aria-hidden="true"
        />
      </div>
      <div className="ml-3">
        <p className="text-xs text-red-400 font-medium">{error}</p>
      </div>
    </div>
  );
}
