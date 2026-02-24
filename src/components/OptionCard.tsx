"use client";

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
  const [imageState, setImageState] = useState<{
    src?: string;
    status: "idle" | "loaded" | "error";
  }>({
    src: imageSrc,
    status: "idle",
  });

  const imageStatus = imageState.src === imageSrc ? imageState.status : "idle";

  const showPreview = !imageSrc || imageStatus !== "loaded";
  const shouldRenderImage = Boolean(imageSrc) && imageStatus !== "error";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={disabled ? undefined : onSelect}
      className={`group relative z-0 flex h-full w-full min-h-[308px] flex-col overflow-hidden rounded-xl border bg-white text-left shadow-[0_8px_18px_rgba(0,0,0,0.08)] transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
        ${
          selected
            ? "border-2 border-primary bg-accent"
            : "border-border hover:border-primary/60"
        }
        ${
          disabled
            ? "cursor-not-allowed opacity-50"
            : "hover:z-20 hover:-translate-y-1 hover:shadow-[0_16px_30px_rgba(0,0,0,0.16)]"
        }`}
      aria-pressed={selected}
    >
      <div className="relative flex h-44 items-center justify-center bg-white p-2">
        <div className="relative h-full w-full">
          {shouldRenderImage ? (
            <img
              src={imageSrc as string}
              alt={imageAlt ?? title}
              loading="eager"
              decoding="async"
              className={`h-full w-full object-contain object-center ${
                imageStatus === "loaded" ? "opacity-100" : "opacity-0"
              }`}
              onLoad={(e) => {
                if (e.currentTarget.naturalWidth > 0) {
                  setImageState({
                    src: imageSrc,
                    status: "loaded",
                  });
                } else {
                  setImageState({
                    src: imageSrc,
                    status: "error",
                  });
                }
              }}
              onError={() =>
                setImageState({
                  src: imageSrc,
                  status: "error",
                })
              }
            />
          ) : null}
          {showPreview ? (
            <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-text">
              Preview
            </span>
          ) : null}
        </div>
        {priceLabel ? (
          <span className="absolute right-1.5 top-1.5 max-w-[calc(100%-0.75rem)] rounded-md bg-primary px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-white sm:right-2 sm:top-2 sm:text-[10px]">
            {priceLabel}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2 px-4 py-4">
        <span className="min-h-[4.3rem] break-words text-[15px] font-semibold leading-[1.3] text-text [overflow-wrap:anywhere]">
          {title}
        </span>
        {subtitle ? (
          <span className="min-h-[2.3rem] overflow-hidden break-words text-xs leading-[1.25] text-muted-text [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] [overflow-wrap:anywhere]">
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
