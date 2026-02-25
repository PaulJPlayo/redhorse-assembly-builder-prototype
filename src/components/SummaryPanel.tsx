"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import type { SummaryRow } from "@/types/assembly";

interface SummaryPanelProps {
  rows: SummaryRow[];
  remainingCount: number;
}

export const SummaryPanel = ({ rows, remainingCount }: SummaryPanelProps) => {
  const [tabletOpen, setTabletOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const mobileTriggerRef = useRef<HTMLButtonElement | null>(null);
  const mobileDrawerRef = useRef<HTMLDivElement | null>(null);
  const drawerTitleId = useId();
  const detailRows = rows.filter((row) => !row.emphasize);

  const closeMobileDrawer = () => {
    setMobileDrawerOpen(false);
    requestAnimationFrame(() => {
      mobileTriggerRef.current?.focus();
    });
  };

  useEffect(() => {
    if (!mobileDrawerOpen) {
      return;
    }

    const focusFrame = requestAnimationFrame(() => {
      mobileDrawerRef.current?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMobileDrawer();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileDrawerOpen]);

  return (
    <>
      <div className="hidden lg:block">
        <div className="rounded-xl border border-border bg-white shadow-[0_10px_24px_rgba(0,0,0,0.12)] lg:flex lg:min-h-[calc(100vh-220px)] lg:flex-col">
          <div className="flex items-center justify-between rounded-t-xl bg-text px-4 py-3 text-white">
            <div className="flex flex-col items-start gap-1">
              <Image
                src="/brand/redhorse-logo.png"
                alt=""
                aria-hidden="true"
                width={300}
                height={40}
                unoptimized
                className="h-6 w-auto"
              />
              <p className="text-xs font-semibold uppercase tracking-[0.2em]">Assembly Summary</p>
            </div>
            <div className="rounded-md bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]">
              Remaining: {remainingCount}
            </div>
          </div>
          <div className="flex flex-1 flex-col px-4 py-5">
            <div className="space-y-5">
              {detailRows.map((row) => (
                <div key={row.label} className="min-w-0 max-w-full border-b border-surface pb-4 text-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-text">
                    {row.label}
                  </p>
                  <p className="mt-1 min-w-0 max-w-full break-words font-semibold text-text">{row.value}</p>
                  {row.sku ? (
                    <p className="mt-1 min-w-0 max-w-full break-all text-[11px] font-mono text-muted-text">
                      SKU {row.sku}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="hidden sm:block lg:hidden">
        <div className="fixed bottom-4 left-4 right-4 z-50 rounded-xl border border-border bg-white shadow-[0_12px_28px_rgba(0,0,0,0.18)]">
          <button
            type="button"
            onClick={() => setTabletOpen((prev) => !prev)}
            className="flex w-full items-center justify-between rounded-t-xl bg-text px-4 py-3 text-white"
          >
            <div className="flex flex-col items-start gap-1">
              <Image
                src="/brand/redhorse-logo.png"
                alt=""
                aria-hidden="true"
                width={300}
                height={40}
                unoptimized
                className="h-6 w-auto"
              />
              <p className="text-xs font-semibold uppercase tracking-[0.2em]">Assembly Summary</p>
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">
              {tabletOpen ? "Hide" : "Details"}
            </span>
          </button>
          {tabletOpen ? (
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

      <button
        ref={mobileTriggerRef}
        type="button"
        onClick={() => setMobileDrawerOpen(true)}
        aria-label="Open summary"
        className="fixed right-3 top-[calc(env(safe-area-inset-top)+12px)] z-[70] inline-flex h-9 items-center justify-center rounded-lg border border-primary/25 bg-white px-3 text-[10px] font-bold uppercase tracking-[0.08em] text-primary shadow-[0_8px_18px_rgba(0,0,0,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:hidden"
      >
        <span className="whitespace-nowrap text-center leading-none">
          Summary
        </span>
      </button>

      <div
        className={`fixed inset-0 z-[75] bg-black/30 backdrop-blur-[1px] transition-opacity sm:hidden ${
          mobileDrawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
        onClick={closeMobileDrawer}
      />

      <div
        ref={mobileDrawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={drawerTitleId}
        tabIndex={-1}
        className={`fixed right-0 top-0 z-[80] h-[100dvh] w-[min(360px,92vw)] max-w-full overflow-y-auto border-l border-border bg-white shadow-[-12px_0_28px_rgba(0,0,0,0.2)] transition-transform sm:hidden ${
          mobileDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex min-h-full flex-col">
          <div className="bg-text px-4 pb-5 pt-[max(16px,env(safe-area-inset-top))] text-white">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center justify-center rounded-[2px] border border-white/30 bg-gradient-to-b from-zinc-200 via-zinc-50 to-zinc-300 px-2 py-1 ring-1 ring-black/20 shadow-sm">
                <Image
                  src="/brand/redhorse-logo.png"
                  alt=""
                  aria-hidden="true"
                  width={300}
                  height={40}
                  unoptimized
                  className="h-6 w-auto"
                />
              </div>
              <button
                type="button"
                onClick={closeMobileDrawer}
                className="rounded-md border border-white/30 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-text"
              >
                Close
              </button>
            </div>
            <p id={drawerTitleId} className="mt-3 text-xs font-semibold uppercase tracking-[0.2em]">
              Assembly Summary
            </p>
          </div>

          <div className="flex-1 space-y-5 px-4 py-5 pb-[calc(16px+env(safe-area-inset-bottom))] text-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-text">
              Remaining configurations: {remainingCount}
            </p>
            {detailRows.map((row) => (
              <div key={row.label} className="min-w-0 max-w-full border-b border-surface pb-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-text">
                  {row.label}
                </p>
                <p className="mt-1 min-w-0 max-w-full break-words font-semibold text-text">{row.value}</p>
                {row.sku ? (
                  <p className="mt-1 min-w-0 max-w-full break-all text-[11px] font-mono text-muted-text">
                    SKU {row.sku}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
