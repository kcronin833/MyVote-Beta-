/* Stroke-icon set matching the design prototype's `Ico` component.
   All paths are 24×24, 1.7px stroke, round caps/joins.  */

import type { ReactNode } from "react";

function Ico({ children, size = 18, stroke = "currentColor" }: { children: ReactNode; size?: number; stroke?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

export const Icons = {
  home: (s = 18) => (
    <Ico size={s}>
      <path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-7H9v7H4a1 1 0 01-1-1z" />
    </Ico>
  ),
  search: (s = 18) => (
    <Ico size={s}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </Ico>
  ),
  network: (s = 18) => (
    <Ico size={s}>
      <circle cx="8" cy="9" r="3" />
      <circle cx="17" cy="7" r="2.2" />
      <path d="M3 19c0-3 2.5-5 5-5s5 2 5 5" />
      <path d="M14 18c0-2 1.5-4 4-4" />
    </Ico>
  ),
  bell: (s = 18) => (
    <Ico size={s}>
      <path d="M6 16V11a6 6 0 1112 0v5l1.5 2H4.5z" />
      <path d="M10 20a2 2 0 004 0" />
    </Ico>
  ),
  msg: (s = 18) => (
    <Ico size={s}>
      <path d="M4 5h16v12H8l-4 3z" />
    </Ico>
  ),
  vote: (s = 18) => (
    <Ico size={s}>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M8 11l3 3 5-5" />
    </Ico>
  ),
  flag: (s = 18) => (
    <Ico size={s}>
      <path d="M5 21V4" />
      <path d="M5 4h12l-2 4 2 4H5" />
    </Ico>
  ),
  pin: (s = 18) => (
    <Ico size={s}>
      <path d="M12 21s7-7 7-12a7 7 0 10-14 0c0 5 7 12 7 12z" />
      <circle cx="12" cy="9" r="2.4" />
    </Ico>
  ),
  thumb: (s = 18) => (
    <Ico size={s}>
      <path d="M7 11v9H4v-9z" />
      <path d="M7 11l4-7c1.5 0 2.5 1 2.5 2.5V10h5.5a2 2 0 012 2.3l-1.2 6A2 2 0 0117.8 20H7" />
    </Ico>
  ),
  comment: (s = 18) => (
    <Ico size={s}>
      <path d="M4 5h16v11H9l-5 4z" />
    </Ico>
  ),
  share: (s = 18) => (
    <Ico size={s}>
      <path d="M4 12v7h16v-7" />
      <path d="M12 3v13" />
      <path d="M7 8l5-5 5 5" />
    </Ico>
  ),
  bookmark: (s = 18) => (
    <Ico size={s}>
      <path d="M6 4h12v17l-6-4-6 4z" />
    </Ico>
  ),
  more: (s = 18) => (
    <Ico size={s}>
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </Ico>
  ),
  spark: (s = 18) => (
    <Ico size={s}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
    </Ico>
  ),
  check: (s = 18) => (
    <Ico size={s}>
      <path d="M5 12l4 4 10-10" />
    </Ico>
  ),
  plus: (s = 18) => (
    <Ico size={s}>
      <path d="M12 5v14M5 12h14" />
    </Ico>
  ),
  cal: (s = 18) => (
    <Ico size={s}>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M4 10h16" />
      <path d="M9 3v4M15 3v4" />
    </Ico>
  ),
  earth: (s = 18) => (
    <Ico size={s}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a13 13 0 010 18 13 13 0 010-18z" />
    </Ico>
  ),
};
