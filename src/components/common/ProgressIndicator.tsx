"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProgressIndicatorProps {
  total: number;
  current: number;
  onChange?: (index: number) => void;
  showCounter?: boolean;
  showArrows?: boolean;
}

export default function ProgressIndicator({
  total,
  current,
  onChange,
  showCounter = false,
  showArrows = false,
}: ProgressIndicatorProps) {
  const displayIndex = current + 1;

  return (
    <div className="flex items-center gap-4">
      {/* 左箭头（仅展示） */}
      {showArrows && (
        <ChevronLeft className="w-4 h-4 text-[var(--text-muted)] opacity-40" />
      )}

      {/* 圆点 */}
      <div className="flex items-center gap-2.5">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            onClick={() => onChange?.(i)}
            className={`rounded-full transition-all duration-400 cursor-pointer border-0
              ${i === current
                ? "w-7 h-2 bg-[var(--orange)]"
                : "w-2 h-2 bg-[var(--green-soft)] hover:bg-[var(--green-main)] opacity-50"
              }`}
            aria-label={`项目 ${i + 1}`}
          />
        ))}
      </div>

      {/* 右箭头（仅展示） */}
      {showArrows && (
        <ChevronRight className="w-4 h-4 text-[var(--text-muted)] opacity-40" />
      )}

      {/* 序号计数器 */}
      {showCounter && (
        <span className="text-xs font-medium tracking-[0.15em] text-[var(--text-muted)] ml-1 tabular-nums">
          {String(displayIndex).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      )}
    </div>
  );
}
