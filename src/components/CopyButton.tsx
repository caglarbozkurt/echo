"use client";

import { useState } from "react";

export function CopyButton({
  text,
  label = "Copy",
  className,
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const base = "copy-btn" + (className ? ` ${className}` : "");

  return (
    <button
      type="button"
      className={copied ? `${base} copied` : base}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          // clipboard API can fail in some contexts; silent fallback
        }
      }}
    >
      {copied ? "Copied" : label}
    </button>
  );
}
