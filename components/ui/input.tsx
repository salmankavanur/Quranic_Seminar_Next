"use client"; // Mark as a Client Component

import * as React from "react";
import { cn } from "@/lib/utils";

// Define props interface to explicitly allow fdprocessedid
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  fdprocessedid?: string; // Optional prop to handle server-injected attribute
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, fdprocessedid, ...props }, ref) => {
    // Use a ref to track if this is the initial render (server-like state)
    const isInitialRender = React.useRef(true);

    React.useEffect(() => {
      // After the first render, mark as non-initial (client-side)
      isInitialRender.current = false;
    }, []);

    // On initial render (server-like), include fdprocessedid if provided; skip on client unless explicitly passed
    const serverProps =
      isInitialRender.current && fdprocessedid ? { "fdprocessedid": fdprocessedid } : {};

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
        {...serverProps} // Conditionally apply server-specific attributes
      />
    );
  }
);
Input.displayName = "Input";

// Wrap in Suspense to handle any remaining hydration issues
const SafeInput = (props: InputProps) => (
  <React.Suspense fallback={<input {...props} disabled />}>
    <Input {...props} />
  </React.Suspense>
);

export { SafeInput as Input };