"use client";

import { useState } from "react";
import type { SummaryRow } from "@/types/assembly";

interface SummaryPanelProps {
  rows: SummaryRow[];
  remainingCount: number;
}

export const SummaryPanel = ({ rows, remainingCount }: SummaryPanelProps) => {
  const [open, setOpen] = useState(false);
  const totalRow = rows.find((row) => row.emphasize);
  const detailRows = rows.filter((row) => !row.emphasize);

  return (
    <>
      <div className="hidden lg:block">
        <div className="rounded-xl border border-border bg-white shadow-[0_10px_24px_rgba(0,0,0,0.12)] lg:flex lg:min-h-[calc(100vh-220px)] lg:flex-col">
          <div className="flex items-center justify-between rounded-t-xl bg-text px-4 py-3 text-white">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-80">
                Assembly Summary
              </p>
              <p className="text-lg font-semibold">Live Preview</p>
            </div>
            <div className="rounded-md bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]">
              Remaining: {remainingCount}
            </div>
          </div>
          <div className="flex flex-1 flex-col px-4 py-5">
            <div className="space-y-5">
              {detailRows.map((row) => (
                <div key={row.label} className="border-b border-surface pb-4 text-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-text">
                    {row.label}
                  </p>
                  <p className="mt-1 font-semibold text-text">{row.value}</p>
                  {row.sku ? (
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-text">
                      SKU {row.sku}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
            {totalRow ? (
              <div className="mt-6 rounded-lg border border-primary/30 bg-accent px-4 py-3 text-text">
                <p className="text-xs font-semibold uppercase tracking-[0.2em]">Total</p>
                <p className="mt-1 text-2xl font-semibold">{totalRow.value}</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <div className="fixed bottom-4 left-4 right-4 z-50 rounded-xl border border-border bg-white shadow-[0_12px_28px_rgba(0,0,0,0.18)]">
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="flex w-full items-center justify-between rounded-t-xl bg-text px-4 py-3 text-white"
          >
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-80">
                Summary
              </p>
              <p className="text-lg font-semibold">{totalRow?.value ?? "--"}</p>
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">
              {open ? "Hide" : "Details"}
            </span>
          </button>
          {open ? (
            <div className="px-4 py-4 text-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-text">
                Remaining configurations: {remainingCount}
              </p>
              <div className="mt-3 space-y-3">
                {detailRows.map((row) => (
                  <div key={row.label}>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-text">
                      {row.label}
                    </p>
                    <p className="font-semibold text-text">{row.value}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};
