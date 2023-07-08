import React, { useId } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

export type ListOfErrors = Array<string | null | undefined> | null | undefined;

export function Field({
  inputProps,
  labelProps,
  className,
  error,
}: {
  labelProps: React.LabelHTMLAttributes<HTMLLabelElement>;
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
  error?: ListOfErrors;
  className?: string;
}) {
  const fallbackId = useId();

  const id = inputProps.id ?? fallbackId;

  return (
    <div className={className}>
      <Label htmlFor={id} {...labelProps} />
      <Input id={id} {...inputProps} />
      <div className="min-h-[32px] pb-3 pt-1">
        {error ? (
          <ul className="flex flex-col gap-y-1">
            {error.map((e) => {
              return (
                <li key={e} className="text-destructive text-sm">
                  {e}
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
