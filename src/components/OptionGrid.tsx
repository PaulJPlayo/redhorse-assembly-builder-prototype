"use client";

import React, { useRef } from "react";

interface OptionGridProps {
  children: React.ReactNode;
  className?: string;
  desktopCarousel?: boolean;
}

export const OptionGrid = ({ children, className, desktopCarousel = false }: OptionGridProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleScrollByPage = (direction: "left" | "right") => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const offset = direction === "left" ? -container.clientWidth : container.clientWidth;
    container.scrollBy({ left: offset, behavior: "smooth" });
  };

  const mobileClasses =
    "flex w-full min-w-0 max-w-full snap-x snap-mandatory gap-6 overflow-x-auto overflow-y-visible overscroll-x-contain px-1 pt-1 pb-2 scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

  const desktopClasses = desktopCarousel
    ? "sm:flex sm:flex-nowrap sm:gap-4 sm:overflow-x-auto sm:overflow-y-visible sm:overscroll-x-contain sm:px-0 sm:pt-1 sm:pb-2 sm:snap-x sm:snap-mandatory sm:[-ms-overflow-style:none] sm:[scrollbar-width:none] sm:[&::-webkit-scrollbar]:hidden"
    : `sm:grid sm:overflow-visible sm:px-0 sm:pb-0 sm:[-ms-overflow-style:auto] sm:[scrollbar-width:auto] sm:[&::-webkit-scrollbar]:block sm:snap-none auto-rows-fr ${
        className ?? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      }`;

  return (
    <div className="w-full min-w-0 max-w-full">
      {desktopCarousel ? (
        <div className="mb-3 hidden justify-end gap-2 sm:flex">
          <button
            type="button"
            onClick={() => handleScrollByPage("left")}
            className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-text transition hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label="Show previous options"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={() => handleScrollByPage("right")}
            className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-text transition hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label="Show next options"
          >
            Next
          </button>
        </div>
      ) : null}
      <div ref={containerRef} className={`${mobileClasses} ${desktopClasses}`}>
        {children}
      </div>
    </div>
  );
};
