import { forwardRef } from "react";

type InputProps = {
  label: string;
  name: string;
  type: string;
  error: string | undefined | null;
};

export type Ref = HTMLInputElement;

const Input = forwardRef<Ref, InputProps & React.InputHTMLAttributes<HTMLInputElement>>(
  ({ label, name, type, error, ...rest }, ref) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <input
          id={name}
          name={name}
          type={type}
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
  )
);

Input.displayName = "Input";

export default Input;
