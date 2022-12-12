import { XIcon } from "@heroicons/react/outline";

export default function AuthError({error}){
  return (
    <div className="flex text-xs font-semibold">
      <div className="flex-shrink-0">
        <XIcon
          className="h-5 w-5 text-error-80"
          aria-hidden="true"
        />
      </div>
      <div className="ml-3">
        <p className="text-xs text-red-500">{error}</p>
      </div>
    </div>
  )
}