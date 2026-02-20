"use client";

import Image from "next/image";
import { useState } from "react";

interface OptionCardProps {
  title: string;
  subtitle?: string;
  selected?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
  priceLabel?: string;
  imageSrc?: string;
  imageAlt?: string;
}

export const OptionCard = ({
  title,
  subtitle,
  selected = false,
  disabled = false,
  onSelect,
  priceLabel,
  imageSrc,
  imageAlt,
}: OptionCardProps) => {
  const [erroredSrc, setErroredSrc] = useState<string | null>(null);

  const showImage = Boolean(imageSrc) && erroredSrc !== imageSrc;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={disabled ? undefined : onSelect}
      className={`group flex h-full w-full min-h-[216px] flex-col overflow-hidden rounded-xl border bg-white text-left shadow-[0_8px_18px_rgba(0,0,0,0.08)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:min-h-[236px]
        ${
          selected
            ? "border-2 border-primary bg-accent"
            : "border-border hover:border-primary/60"
        }
        ${disabled ? "cursor-not-allowed opacity-50" : "hover:-translate-y-0.5"}`}
      aria-pressed={selected}
    >
      <div className="relative flex h-24 items-center justify-center bg-surface p-2 sm:h-32 sm:p-3">
        {showImage ? (
          <div className="relative h-full w-full">
            <Image
              src={imageSrc as string}
              alt={imageAlt ?? title}
              fill
              sizes="(max-width: 639px) 86vw, (max-width: 1023px) 40vw, 22vw"
              className="object-contain object-center"
              onError={() => setErroredSrc(imageSrc ?? null)}
            />
          </div>
        ) : (
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-text">
            Preview
          </span>
        )}
        {priceLabel ? (
          <span className="absolute right-3 top-3 rounded-md bg-primary px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
            {priceLabel}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 px-3 py-3.5 sm:gap-2 sm:px-4 sm:py-4">
        <span className="min-h-[2.4rem] overflow-hidden break-words text-[13px] font-semibold leading-[1.2] text-text [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] [overflow-wrap:anywhere] sm:min-h-[2.6rem] sm:text-[15px]">
          {title}
        </span>
        {subtitle ? (
          <span className="min-h-[1.9rem] overflow-hidden break-words text-[11px] leading-[1.2] text-muted-text [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] [overflow-wrap:anywhere] sm:min-h-[2.1rem] sm:text-xs">
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
