"use client";

import type { ExperienceItem } from "@/types";
import CareerCard from "@/components/career/CareerCard";

interface CareerCardsProps {
  experiences: ExperienceItem[];
  activeId: string;
  onHover: (id: string) => void;
  onViewDetail: (exp: ExperienceItem) => void;
}

const positionMap: Record<string, React.CSSProperties> = {
  past: { left: "7%", top: "43%" },
  growth: { left: "35%", top: "39%" },
  current: { right: "7%", top: "28%" },
};

/**
 * CareerCards — 三张经历卡片，absolute 定位
 * 支持 hover 切换 active 焦点卡片
 */
export default function CareerCards({ experiences, activeId, onHover, onViewDetail }: CareerCardsProps) {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      {experiences.map((exp, i) => {
        const pos = positionMap[exp.status];
        const isActive = exp.id === activeId;
        return (
          <div
            key={exp.id}
            className="absolute pointer-events-auto"
            style={pos}
          >
            <CareerCard
              experience={exp}
              index={i}
              isActive={isActive}
              onMouseEnter={() => onHover(exp.id)}
              onFocus={() => onHover(exp.id)}
              onViewDetail={() => onViewDetail(exp)}
            />
          </div>
        );
      })}
    </div>
  );
}
