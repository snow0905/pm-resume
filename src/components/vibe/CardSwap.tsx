"use client";

import { useRef, useEffect, useCallback, useMemo, type ReactNode } from "react";
import gsap from "gsap";

interface CardSwapProps {
  children: ReactNode[];
  width?: number;
  height?: number;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  onCardClick?: (index: number) => void;
  skewAmount?: number;
  easing?: "elastic" | "smooth";
  activeIndex: number;
  className?: string;
}

interface Slot {
  x: number;
  y: number;
  z: number;
  zIndex: number;
  scale: number;
  opacity: number;
}

/**
 * 每张卡片的 3D 堆叠位置。
 * 只返回堆叠偏移量，居中由 margin 负值处理。
 */
function makeSlot(
  i: number,
  distX: number,
  distY: number,
  total: number,
): Slot {
  const depthScale = total > 1 ? i / (total - 1) : 0;
  return {
    x: i * distX,
    y: -i * distY,
    z: -i * distX * 1.5,
    zIndex: total - i,
    scale: 1 - depthScale * 0.06,
    opacity: 1 - depthScale * 0.18,
  };
}

function getEasingConfig(easing: "elastic" | "smooth") {
  if (easing === "elastic") {
    return {
      ease: "elastic.out(0.6,0.9)",
      dropDuration: 2,
      moveDuration: 2,
      returnDuration: 2,
      promoteOverlap: 0.9,
    };
  }
  return {
    ease: "power3.in",
    dropDuration: 0.25,
    moveDuration: 0.4,
    returnDuration: 0.35,
    promoteOverlap: 0.15,
  };
}

export default function CardSwap({
  children,
  width = 600,
  height = 440,
  cardDistance = 52,
  verticalDistance = 58,
  delay = 8000,
  pauseOnHover = true,
  onCardClick,
  skewAmount = 0,
  easing = "smooth",
  activeIndex,
  className = "",
}: CardSwapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const orderRef = useRef<number[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isHovering = useRef(false);

  const total = children.length;
  const cfg = useMemo(() => getEasingConfig(easing), [easing]);

  const getSlot = useCallback(
    (i: number) => makeSlot(i, cardDistance, verticalDistance, total),
    [cardDistance, verticalDistance, total],
  );

  const placeNow = useCallback(
    (el: HTMLElement, slot: Slot) => {
      gsap.set(el, {
        x: slot.x,
        y: slot.y,
        z: slot.z,
        zIndex: slot.zIndex,
        scale: slot.scale,
        opacity: slot.opacity,
        skewX: skewAmount,
        force3D: true,
      });
    },
    [skewAmount],
  );

  // Initialize card positions
  useEffect(() => {
    if (!containerRef.current || total === 0) return;

    tlRef.current?.kill();

    const initOrder: number[] = [activeIndex];
    for (let i = 0; i < total; i++) {
      if (i !== activeIndex) initOrder.push(i);
    }
    orderRef.current = initOrder;

    initOrder.forEach((cardIdx, slotIdx) => {
      const el = cardRefs.current[cardIdx];
      if (el) {
        const slot = getSlot(slotIdx);
        placeNow(el, slot);
      }
    });
  }, [total]);

  // Auto-rotation: front card drops down, slides to back
  const swap = useCallback(() => {
    const order = orderRef.current;
    if (order.length <= 1) return;

    const frontIdx = order[0];
    const frontEl = cardRefs.current[frontIdx];
    if (!frontEl) return;

    const newOrder = [...order.slice(1), frontIdx];
    orderRef.current = newOrder;

    // 杀死旧时间线后，先把所有卡片复位到当前 order 的正确位置，
    // 避免上一次动画被中断时卡片停留在中间态导致 += 累加偏移。
    tlRef.current?.kill();
    order.forEach((cardIdx, slotIdx) => {
      const el = cardRefs.current[cardIdx];
      if (el) {
        const slot = getSlot(slotIdx);
        gsap.set(el, {
          x: slot.x,
          y: slot.y,
          z: slot.z,
          zIndex: slot.zIndex,
          scale: slot.scale,
          opacity: slot.opacity,
          skewX: skewAmount,
          force3D: true,
        });
      }
    });

    const tl = gsap.timeline();
    tlRef.current = tl;

    // 使用绝对 y 值而非 += 相对值，防止中断后累加偏移
    const frontSlot = getSlot(0);
    tl.to(frontEl, {
      y: frontSlot.y + height,
      duration: cfg.dropDuration,
      ease: cfg.ease,
    });

    tl.addLabel("promote", `-=${cfg.promoteOverlap}`);
    const remaining = order.slice(1);
    remaining.forEach((cardIdx, i) => {
      const el = cardRefs.current[cardIdx];
      if (el) {
        const newSlot = getSlot(i);
        tl.to(
          el,
          {
            x: newSlot.x,
            y: newSlot.y,
            z: newSlot.z,
            zIndex: newSlot.zIndex,
            scale: newSlot.scale,
            opacity: newSlot.opacity,
            duration: cfg.moveDuration,
            ease: cfg.ease,
          },
          "promote",
        );
      }
    });

    tl.addLabel("return", `-=${cfg.moveDuration - 0.12}`);
    const lastSlot = getSlot(order.length - 1);
    tl.set(frontEl, { zIndex: lastSlot.zIndex }, "return");
    tl.to(
      frontEl,
      {
        x: lastSlot.x,
        y: lastSlot.y,
        z: lastSlot.z,
        scale: lastSlot.scale,
        opacity: lastSlot.opacity,
        duration: cfg.returnDuration,
        ease: cfg.ease,
      },
      "return",
    );
  }, [cfg, getSlot, height, skewAmount]);

  const bringToFront = useCallback(
    (targetIdx: number) => {
      const currentOrder = orderRef.current;
      if (currentOrder[0] === targetIdx) return;

      const rest = currentOrder.filter((idx) => idx !== targetIdx);
      const newOrder = [targetIdx, ...rest];

      // 先复位再建新时间线，保证动画从正确位置出发
      tlRef.current?.kill();
      orderRef.current = newOrder;

      const tl = gsap.timeline();
      tlRef.current = tl;

      newOrder.forEach((cardIdx, slotIdx) => {
        const el = cardRefs.current[cardIdx];
        if (el) {
          const slot = getSlot(slotIdx);
          tl.to(
            el,
            {
              x: slot.x,
              y: slot.y,
              z: slot.z,
              zIndex: slot.zIndex,
              scale: slot.scale,
              opacity: slot.opacity,
              duration: cfg.moveDuration,
              ease: cfg.ease,
            },
            0,
          );
        }
      });
    },
    [cfg, getSlot],
  );

  const prevActiveRef = useRef(activeIndex);
  useEffect(() => {
    if (prevActiveRef.current !== activeIndex) {
      prevActiveRef.current = activeIndex;
      bringToFront(activeIndex);
    }
  }, [activeIndex, bringToFront]);

  useEffect(() => {
    if (delay <= 0 || total <= 1) return;

    intervalRef.current = setInterval(() => {
      if (!isHovering.current) swap();
    }, delay);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [delay, total, swap]);

  const handleMouseEnter = useCallback(() => {
    isHovering.current = true;
    if (pauseOnHover) {
      tlRef.current?.pause();
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    isHovering.current = false;
    if (pauseOnHover) {
      tlRef.current?.play();
      if (delay > 0 && total > 1) {
        intervalRef.current = setInterval(() => {
          if (!isHovering.current) swap();
        }, delay);
      }
    }
  }, [pauseOnHover, delay, total, swap]);

  const handleCardClick = useCallback(
    (idx: number) => {
      onCardClick?.(idx);
    },
    [onCardClick],
  );

  const halfW = -width / 2;
  const halfH = -height / 2;
  const indices = Array.from({ length: total }, (_, i) => i);

  return (
    <div
      ref={containerRef}
      className={`card-swap-container ${className}`}
      style={{ width, height }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {indices.map((childIdx) => (
        <div
          key={childIdx}
          ref={(el) => { cardRefs.current[childIdx] = el; }}
          className="card-swap-card"
          style={{ width, height, marginLeft: halfW, marginTop: halfH }}
          onClick={() => handleCardClick(childIdx)}
        >
          {children[childIdx]}
        </div>
      ))}
    </div>
  );
}
