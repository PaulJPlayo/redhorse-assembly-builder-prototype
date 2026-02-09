import React from "react";

interface OptionGridProps {
  children: React.ReactNode;
  className?: string;
}

export const OptionGrid = ({ children, className }: OptionGridProps) => {
  return (
    <div
      className={`flex snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain px-1 pb-2 scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:overflow-visible sm:px-0 sm:pb-0 sm:[-ms-overflow-style:auto] sm:[scrollbar-width:auto] sm:[&::-webkit-scrollbar]:block sm:snap-none auto-rows-fr ${
        className ?? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      }`}
    >
      {children}
    </div>
  );
};
