"use client";

import Image from "next/image";

export default function SiteLogo() {
  return (
    <a
      href="#hero"
      className="site-logo"
      aria-label="回到首页"
      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        document.querySelector("#hero")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
    >
      <Image
        src="/images/logo.png"
        alt="Logo"
        width={40}
        height={40}
        className="site-logo-img"
        priority
      />
    </a>
  );
}
