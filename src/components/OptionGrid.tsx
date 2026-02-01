import React from "react";

interface OptionGridProps {
  children: React.ReactNode;
  className?: string;
}

export const OptionGrid = ({ children, className }: OptionGridProps) => {
  return (
    <div
      className={`grid auto-rows-fr gap-6 ${
        className ?? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      }`}
    >
      {children}
    </div>
  );
};
