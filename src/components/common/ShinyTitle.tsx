"use client";

import type { ReactNode } from "react";

interface ShinyTitleProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  as?: "h1" | "h2";
}

/**
 * ShinyTitle — 柔和光泽扫过文字表面
 *
 * 使用 background-clip: text + linear-gradient + CSS 动画，
 * 高光从左到右缓慢扫过，深绿基底 + 奶油白/青灰绿/暖橙高光带。
 * 内层 span 承载所有渐变和动画样式（内联确保最高优先级）。
 */
export default function ShinyTitle({
  children,
  className = "",
  style,
  as: Tag = "h2",
}: ShinyTitleProps) {
  return (
    <Tag className={className} style={style}>
      <span
        className="shiny-title"
        style={{
          backgroundImage:
            "linear-gradient(110deg, var(--green-deep) 0%, var(--green-deep) 38%, #ffffff 48%, var(--green-soft) 54%, var(--orange) 58%, var(--green-deep) 66%, var(--green-deep) 100%)",
          backgroundSize: "240% 100%",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          animation: "shiny-sweep 6s ease-in-out 0.8s infinite",
        }}
      >
        {children}
      </span>
    </Tag>
  );
}
