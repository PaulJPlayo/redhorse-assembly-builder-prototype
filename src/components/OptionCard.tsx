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
      className={`group flex h-full w-full min-h-[200px] flex-col overflow-hidden rounded-xl border bg-white text-left shadow-[0_8px_18px_rgba(0,0,0,0.08)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:min-h-[230px]
        ${
          selected
            ? "border-2 border-primary bg-accent"
            : "border-border hover:border-primary/60"
        }
        ${disabled ? "cursor-not-allowed opacity-50" : "hover:-translate-y-0.5"}`}
      aria-pressed={selected}
    >
      <div className="relative flex h-20 items-center justify-center bg-surface sm:h-28">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-text">
          Preview
        </span>
        {priceLabel ? (
          <span className="absolute right-3 top-3 rounded-md bg-primary px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
            {priceLabel}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 px-3 py-3 sm:gap-2 sm:px-5 sm:py-5">
        <span className="overflow-hidden text-sm font-semibold text-text [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] sm:text-base">
          {title}
        </span>
        {subtitle ? (
          <span className="overflow-hidden text-[11px] text-muted-text [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] sm:text-xs">
            {subtitle}
          </span>
        ) : null}
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
