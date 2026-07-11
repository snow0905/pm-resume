"use client";

import { useState, useCallback } from "react";
import { Phone, Mail, MessageCircle, Copy, Check } from "lucide-react";
import { profile } from "@/data/profile";

function ContactPhoto() {
  return (
    <div className="contact-photo-area">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/形象照.jpg"
        alt="个人照片"
        className="w-full h-full object-cover rounded-2xl"
      />
    </div>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
  action,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="contact-row">
      <div className="contact-row-icon">
        <Icon size={18} style={{ color: "var(--green-main)" }} />
      </div>
      <div className="contact-row-text">
        <span className="contact-row-label">{label}</span>
        <span className="contact-row-value">{value}</span>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

function ContactQRCode() {
  const qrSrc = profile.wechatQr;

  return (
    <div className="contact-qr-row">
      <div className="contact-qr-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrSrc}
          alt="微信二维码"
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            const parent = target.parentElement;
            if (parent && !parent.querySelector(".qr-fallback")) {
              const el = document.createElement("span");
              el.className = "qr-fallback";
              el.style.cssText =
                "font-size:11px;color:var(--text-muted);text-align:center";
              el.textContent = "微信二维码";
              parent.appendChild(el);
            }
          }}
        />
      </div>
      <div className="contact-qr-text">
        <span className="contact-qr-title">期待与你交流</span>
        <span className="contact-qr-sub">欢迎随时联系我</span>
      </div>
    </div>
  );
}

export default function ContactInfoCard() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = profile.email;
      textarea.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <div className="contact-card">
      <div className="contact-card-inner">
        <ContactPhoto />

        {/* 竖向分隔线 */}
        <div className="contact-divider" />

        {/* 联系方式区 */}
        <div className="contact-details">
          <span className="contact-details-label">联系方式</span>

          <div className="contact-rows">
            <ContactRow icon={Phone} label="电话" value={profile.phone} />
            <ContactRow
              icon={Mail}
              label="邮箱"
              value={profile.email}
              action={
                <button
                  onClick={handleCopyEmail}
                  className={`contact-copy-btn${copied ? " copied" : ""}`}
                >
                  {copied ? (
                    <>
                      <Check size={12} />
                      已复制
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      复制
                    </>
                  )}
                </button>
              }
            />
            <ContactRow
              icon={MessageCircle}
              label="微信"
              value="扫码添加"
            />
          </div>

          {/* 细分割线 */}
          <div className="contact-details-divider" />

          {/* 二维码 */}
          <ContactQRCode />
        </div>
      </div>
    </div>
  );
}
