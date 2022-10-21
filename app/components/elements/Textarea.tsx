import { forwardRef } from "react";

type InputProps = {
  label: string;
  name: string;
  error?: string | undefined | null;
};

export type Ref = HTMLTextAreaElement;

const Textarea = forwardRef<
  Ref,
  InputProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ label, name, error, ...rest }, ref) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="mt-1">
      <textarea
        id={name}
        name={name}
        ref={ref}
        {...rest}
        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
      />
    </div>
    {error && (
      <p className="mt-2 text-sm text-red-600" id={`${name}-error`}>
        {error}
      </p>
    )}
  </div>
));

Textarea.displayName = "Textarea";

export default Textarea;
