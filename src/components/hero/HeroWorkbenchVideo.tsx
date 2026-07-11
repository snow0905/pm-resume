"use client";

interface HeroWorkbenchVideoProps {
  videoSrc?: string;
  poster?: string;
  alt?: string;
  className?: string;
}

export default function HeroWorkbenchVideo({
  videoSrc,
  poster,
  alt = "工作台演示视频",
  className,
}: HeroWorkbenchVideoProps) {
  return (
    <div
      className={`hero-workbench-video${className ? ` ${className}` : ""}`}
    >
      {videoSrc ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={poster}
          className="hero-workbench-video-media"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : poster ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={poster}
          alt={alt}
          className="hero-workbench-video-media hero-workbench-video-fallback-img"
        />
      ) : (
        <div className="hero-workbench-video-placeholder">
          <span>{alt}</span>
        </div>
      )}
    </div>
  );
}
