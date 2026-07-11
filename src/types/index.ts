export interface ExperienceSummary {
  description: string;
  tags: string[];
  highlights: string[];
  quote: string;
}

export interface ExperienceDetail {
  background: string;
  responsibilities: string[];
  works: string[];
  outcomes: string[];
  growth: string;
}

export interface ExperienceItem {
  id: string;
  stage: string;
  period: string;
  company: string;
  role: string;
  summary: ExperienceSummary;
  detail: ExperienceDetail;
  status: "past" | "growth" | "current";
}

export interface ProjectDetail {
  overview: string;
  background: string[];
  responsibilities: string[];
  process: string[];
  outcomes: string[];
  reflection: string[];
}

export interface ProjectItem {
  id: string;
  indexLabel: string;
  title: string;
  oneLiner: string;
  role: string;
  tags: string[];
  keyResult: string;
  detail: ProjectDetail;
}

export interface VibeProjectItem {
  id: string;
  indexLabel: string;
  title: string;
  visualTitle: string;
  status: string;
  oneLiner: string;
  description: string;
  tags: string[];
  demoUrl?: string;
  visualUrl?: string;
}

export interface CapabilityItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  phrase: string;
}

export interface MatchDimension {
  id: string;
  key: string;
  title: string;
  scorePercent: number;
  weight: number;
  summary: string;
  jdEvidence: string[];
  resumeEvidence: string[];
  scoringReason: string;
  matchReason: string;
  deductionReason: string;
  finalScore: number;
}

export interface MatchResult {
  overallScore: number;
  conclusion: string;
  highlights: string[];
  concerns: string[];
  dimensions: MatchDimension[];
  jdKeywords?: string[];
}

export type MatchModalState = "closed" | "loading" | "result" | "error";

export interface Profile {
  name: string;
  title: string;
  phone: string;
  email: string;
  resumeUrl: string;
  wechatQr: string;
  education: {
    school: string;
    degree: string;
    major: string;
    period: string;
    note?: string;
  };
}
