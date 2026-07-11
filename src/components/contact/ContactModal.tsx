"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, Mail, MessageCircle, Copy, Check } from "lucide-react";
import { profile } from "@/data/profile";

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

/** 照片 */
function ModalPhoto() {
  return (
    <div className="contact-modal-photo">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/形象照.jpg"
        alt="个人照片"
        className="w-full h-full object-cover rounded-2xl"
      />
    </div>
  );
}

/** 单条联系方式 */
function ModalContactRow({
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

/** 二维码区块 */
function ModalQRCode() {
  const qrSrc = profile.wechatQr;

  return (
    <div className="contact-qr-row">
      <div className="contact-qr-card" style={{ width: 130, height: 130 }}>
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
                "font-size:12px;color:var(--text-muted);text-align:center";
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

export default function ContactModal({ open, onClose }: ContactModalProps) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // 确保 portal 仅客户端挂载后渲染
  useEffect(() => {
    setMounted(true);
  }, []);

  // ESC 关闭
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // 锁定背景滚动
  useEffect(() => {
    const html = document.documentElement;
    if (open) {
      html.classList.add("scroll-locked");
    } else {
      html.classList.remove("scroll-locked");
    }
    return () => html.classList.remove("scroll-locked");
  }, [open]);

  // 打开时聚焦面板（用于 focus trap 入口）
  useEffect(() => {
    if (open && panelRef.current) {
      const timer = setTimeout(() => panelRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // 邮箱复制
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

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="contact-modal-root">
          {/* 遮罩 */}
          <motion.div
            className="contact-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={onClose}
          />

          {/* 面板 */}
          <motion.div
            ref={panelRef}
            className="contact-modal-panel"
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            {/* 关闭按钮 */}
            <button
              className="contact-modal-close"
              onClick={onClose}
              aria-label="关闭"
            >
              <X size={20} />
            </button>

            {/* 左右双栏内容 */}
            <div className="contact-modal-inner">
              {/* 左侧：照片 */}
              <ModalPhoto />

              {/* 竖向分隔线 */}
              <div className="contact-modal-divider" />

              {/* 右侧：联系方式 + 二维码 */}
              <div className="contact-modal-info">
                <span className="contact-modal-info-label">联系方式</span>

                <div className="contact-modal-rows">
                  <ModalContactRow
                    icon={Phone}
                    label="电话"
                    value={profile.phone}
                  />
                  <div className="contact-modal-sep" />
                  <ModalContactRow
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
                  <div className="contact-modal-sep" />
                  <ModalContactRow
                    icon={MessageCircle}
                    label="微信"
                    value="扫码添加"
                  />
                </div>

                {/* 细分割线 */}
                <div className="contact-modal-info-divider" />

                {/* 二维码 */}
                <ModalQRCode />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
