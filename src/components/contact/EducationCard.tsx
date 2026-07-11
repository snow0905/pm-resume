"use client";

import { GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

const educations = [
  {
    school: "山西大学",
    major: "管理科学与工程",
    degree: "硕士",
    period: "2016.09 — 2019.06",
    active: true,
  },
  {
    school: "厦门理工学院",
    major: "信息管理与信息系统",
    degree: "本科",
    period: "2012.09 — 2016.06",
    active: false,
  },
];

export default function EducationCard() {
  return (
    <motion.div
      className="education-card"
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      whileHover={{ y: -6 }}
    >
      {/* 顶部：学位帽 icon + 标题 */}
      <div className="edu-header">
        <div className="edu-icon-box">
          <GraduationCap size={20} style={{ color: "var(--green-main)" }} />
        </div>
        <span className="edu-header-title">教育经历</span>
      </div>

      {/* 纵向时间线 */}
      <div className="edu-timeline">
        {educations.map((edu, i) => (
          <div key={i} className="edu-item">
            {/* 左侧：圆点 + 竖线 */}
            <div className="edu-timeline-track">
              <span className={`edu-dot${edu.active ? " active" : ""}`} />
              {i < educations.length - 1 && <div className="edu-line" />}
            </div>

            {/* 右侧：内容 */}
            <div className="edu-content">
              <h3 className="edu-school">{edu.school}</h3>
              <p className="edu-major">
                {edu.major}｜{edu.degree}
              </p>
              <p className="edu-period">{edu.period}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
