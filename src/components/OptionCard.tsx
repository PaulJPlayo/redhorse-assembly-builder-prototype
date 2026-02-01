"use client";

import React from "react";

interface OptionCardProps {
  title: string;
  subtitle?: string;
  selected?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
  priceLabel?: string;
}

export const OptionCard = ({
  title,
  subtitle,
  selected = false,
  disabled = false,
  onSelect,
  priceLabel,
}: OptionCardProps) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={disabled ? undefined : onSelect}
      className={`group flex h-full min-h-[230px] flex-col overflow-hidden rounded-xl border bg-white text-left shadow-[0_8px_18px_rgba(0,0,0,0.08)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
        ${
          selected
            ? "border-2 border-primary bg-accent"
            : "border-border hover:border-primary/60"
        }
        ${disabled ? "cursor-not-allowed opacity-50" : "hover:-translate-y-0.5"}`}
      aria-pressed={selected}
    >
      <div className="relative flex h-28 items-center justify-center bg-surface">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-text">
          Preview
        </span>
        {priceLabel ? (
          <span className="absolute right-3 top-3 rounded-md bg-primary px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
            {priceLabel}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2 px-5 py-5">
        <span className="text-base font-semibold text-text">{title}</span>
        {subtitle ? <span className="text-xs text-muted-text">{subtitle}</span> : null}
        <span
          className={`mt-auto text-[11px] font-semibold uppercase tracking-[0.18em] ${
            selected ? "text-primary" : "text-muted-text"
          }`}
        >
          {selected ? "Selected" : disabled ? "Unavailable" : "Select"}
        </span>
      </div>
    </button>
  );
};
