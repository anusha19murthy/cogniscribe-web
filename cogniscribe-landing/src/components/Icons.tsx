import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number; color?: string };

const defaults = (size = 24, color = 'currentColor') => ({
  width: size, height: size, viewBox: '0 0 24 24',
  fill: 'none', stroke: color, strokeWidth: 1.8,
  strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
});

export const IconMic = ({ size, color, ...p }: IconProps) => (
  <svg {...defaults(size, color)} {...p}>
    <rect x="9" y="2" width="6" height="11" rx="3" />
    <path d="M5 10a7 7 0 0 0 14 0" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

export const IconStethoscope = ({ size, color, ...p }: IconProps) => (
  <svg {...defaults(size, color)} {...p}>
    <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
    <path d="M8 15a6 6 0 0 0 6 6 2 2 0 0 0 2-2v-1" />
    <circle cx="19" cy="16.5" r="1.5" />
    <circle cx="6.5" cy="18.5" r=".5" fill="currentColor" />
  </svg>
);

export const IconHeartPulse = ({ size, color, ...p }: IconProps) => (
  <svg {...defaults(size, color)} {...p}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    <path d="M3.22 12H9.5l1.5-3 2 4.5 1.5-3H21" />
  </svg>
);

export const IconBrain = ({ size, color, ...p }: IconProps) => (
  <svg {...defaults(size, color)} {...p}>
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
    <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
    <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
    <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
    <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
    <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
    <path d="M6 18a4 4 0 0 1-1.967-.516" />
    <path d="M19.967 17.484A4 4 0 0 1 18 18" />
  </svg>
);

export const IconFileText = ({ size, color, ...p }: IconProps) => (
  <svg {...defaults(size, color)} {...p}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

export const IconLink = ({ size, color, ...p }: IconProps) => (
  <svg {...defaults(size, color)} {...p}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

export const IconSave = ({ size, color, ...p }: IconProps) => (
  <svg {...defaults(size, color)} {...p}>
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);

export const IconUpload = ({ size, color, ...p }: IconProps) => (
  <svg {...defaults(size, color)} {...p}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

export const IconClock = ({ size, color, ...p }: IconProps) => (
  <svg {...defaults(size, color)} {...p}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export const IconClipboard = ({ size, color, ...p }: IconProps) => (
  <svg {...defaults(size, color)} {...p}>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="M12 11h4M12 16h4M8 11h.01M8 16h.01" />
  </svg>
);

export const IconMail = ({ size, color, ...p }: IconProps) => (
  <svg {...defaults(size, color)} {...p}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

export const IconHospital = ({ size, color, ...p }: IconProps) => (
  <svg {...defaults(size, color)} {...p}>
    <path d="M12 6v4M10 8h4" />
    <path d="M3 21h18" />
    <path d="M5 21V7l7-4 7 4v14" />
    <rect x="9" y="11" width="6" height="10" />
  </svg>
);

export const IconScalpel = ({ size, color, ...p }: IconProps) => (
  <svg {...defaults(size, color)} {...p}>
    <circle cx="11" cy="11" r="2" />
    <path d="M11 13v8M3 3l5.26 5.26" />
    <path d="m21 3-1.5 1.5c-1.5 1.5-6 1-7.5 2.5l-1.5 1.5" />
    <path d="m21 21-5.26-5.26" />
    <path d="m9 9-6 12" />
  </svg>
);

export const IconTarget = ({ size, color, ...p }: IconProps) => (
  <svg {...defaults(size, color)} {...p}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

export const IconTelescope = ({ size, color, ...p }: IconProps) => (
  <svg {...defaults(size, color)} {...p}>
    <circle cx="6" cy="18" r="3" />
    <path d="M6 15a9 9 0 0 1 9-9 9 9 0 0 1 3.35.64" />
    <path d="M6 15 3.06 3" />
    <path d="m18 6 3-3" />
    <path d="M6 15h12" />
    <path d="m14 6 5.86-1.96" />
  </svg>
);

export const IconShield = ({ size, color, ...p }: IconProps) => (
  <svg {...defaults(size, color)} {...p}>
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export const IconUserMd = ({ size, color, ...p }: IconProps) => (
  <svg {...defaults(size, color)} {...p}>
    <path d="M8 7a4 4 0 1 0 8 0 4 4 0 0 0-8 0" />
    <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
    <path d="M14 12h1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-1" />
    <path d="M18 12v4" />
  </svg>
);

export const IconBarChart = ({ size, color, ...p }: IconProps) => (
  <svg {...defaults(size, color)} {...p}>
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
    <line x1="2" y1="20" x2="22" y2="20" />
  </svg>
);

export const IconLock = ({ size, color, ...p }: IconProps) => (
  <svg {...defaults(size, color)} {...p}>
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    <circle cx="12" cy="16" r="1" fill="currentColor" />
  </svg>
);

export const IconZap = ({ size, color, ...p }: IconProps) => (
  <svg {...defaults(size, color)} {...p}>
    <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
  </svg>
);

export const IconCheck = ({ size, color, ...p }: IconProps) => (
  <svg {...defaults(size, color)} {...p}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const IconArrowRight = ({ size, color, ...p }: IconProps) => (
  <svg {...defaults(size, color)} {...p}>
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export const IconPlay = ({ size, color, ...p }: IconProps) => (
  <svg {...defaults(size, color)} {...p}>
    <circle cx="12" cy="12" r="10" />
    <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
  </svg>
);

export const IconCross = ({ size, color, ...p }: IconProps) => (
  <svg {...defaults(size, color)} {...p}>
    <rect x="9" y="3" width="6" height="18" rx="2" fill="currentColor" stroke="none" />
    <rect x="3" y="9" width="18" height="6" rx="2" fill="currentColor" stroke="none" />
  </svg>
);

export const IconDna = ({ size, color, ...p }: IconProps) => (
  <svg {...defaults(size, color)} {...p}>
    <path d="M2 15c6.667-6 13.333 0 20-6" />
    <path d="M9 22c1.798-1.998 2.518-3.995 2.757-5.993" />
    <path d="M15 2c-1.798 1.998-2.518 3.995-2.757 5.993" />
    <path d="m17 6-2.5-2.5" />
    <path d="m14 8-1-1" />
    <path d="m7 18 2.5 2.5" />
    <path d="m3.5 14.5.5.5" />
    <path d="m20 9 .5.5" />
    <path d="m6.5 12.5 1 1" />
    <path d="m16.5 10.5 1 1" />
    <path d="m10 16 1.5 1.5" />
    <path d="M2 9c6.667 6 13.333 0 20 6" />
  </svg>
);

export const IconWifi = ({ size, color, ...p }: IconProps) => (
  <svg {...defaults(size, color)} {...p}>
    <path d="M5 13a10 10 0 0 1 14 0" />
    <path d="M8.5 16.5a5 5 0 0 1 7 0" />
    <path d="M2 8.82a15 15 0 0 1 20 0" />
    <line x1="12" y1="20" x2="12.01" y2="20" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const IconStar = ({ size, color, ...p }: IconProps) => (
  <svg {...defaults(size, color)} {...p}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor" stroke="none" />
  </svg>
);

export const IconEye = ({ size, color, ...p }: IconProps) => (
  <svg {...defaults(size, color)} {...p}>
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const IconActivity = ({ size, color, ...p }: IconProps) => (
  <svg {...defaults(size, color)} {...p}>
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

export const IconCalendar = ({ size, color, ...p }: IconProps) => (
  <svg {...defaults(size, color)} {...p}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" strokeWidth="2.5" />
  </svg>
);

export const IconSmartphone = ({ size, color, ...p }: IconProps) => (
  <svg {...defaults(size, color)} {...p}>
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const IconGlobe = ({ size, color, ...p }: IconProps) => (
  <svg {...defaults(size, color)} {...p}>
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

export const IconPill = ({ size, color, ...p }: IconProps) => (
  <svg {...defaults(size, color)} {...p}>
    <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
    <line x1="8.5" y1="8.5" x2="15.5" y2="15.5" />
  </svg>
);

export const IconTrendingUp = ({ size, color, ...p }: IconProps) => (
  <svg {...defaults(size, color)} {...p}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

export const IconUsers = ({ size, color, ...p }: IconProps) => (
  <svg {...defaults(size, color)} {...p}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export const IconChevronDown = ({ size, color, ...p }: IconProps) => (
  <svg {...defaults(size, color)} {...p}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export const IconMenu = ({ size, color, ...p }: IconProps) => (
  <svg {...defaults(size, color)} {...p}>
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

export const IconX = ({ size, color, ...p }: IconProps) => (
  <svg {...defaults(size, color)} {...p}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
