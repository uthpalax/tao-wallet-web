import {
  CheckCircleIcon,
  XMarkIcon,
  XCircleIcon,
} from "@heroicons/react/20/solid";
import { classNames } from "~/utils/index";

type AlertProp = {
  type: "success" | "fail";
  title: string;
  close: () => void;
};

export default function SuccessAlert({ type, title, close }: AlertProp) {
  return (
    <div
      className={classNames(
        type === "success" ? "bg-green-50" : "bg-red-50",
        "mb-4 rounded-md  p-4"
      )}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          {type === "success" ? (
            <CheckCircleIcon
              className="h-5 w-5 text-green-400"
              aria-hidden="true"
            />
          ) : (
            <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
          )}
        </div>
        <div className="ml-3">
          <p
            className={classNames(
              type === "success" ? "text-green-800" : "text-red-800",
              "text-sm font-medium "
            )}
          >
            {title}
          </p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              className={classNames(
                type === "success"
                  ? "bg-green-50 text-green-500 hover:bg-green-100 focus:ring-green-600 focus:ring-offset-green-50"
                  : "bg-red-50 text-red-500 hover:bg-red-100 focus:ring-red-600 focus:ring-offset-red-50",
                "inline-flex rounded-md p-1.5  focus:outline-none focus:ring-2 focus:ring-offset-2"
              )}
              onClick={close}
            >
              <span className="sr-only">Dismiss</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
