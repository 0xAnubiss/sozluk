import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function BaseIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    />
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.25 4.25" />
    </BaseIcon>
  );
}

export function SwapIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M7 7h12" />
      <path d="m15 3 4 4-4 4" />
      <path d="M17 17H5" />
      <path d="m9 21-4-4 4-4" />
    </BaseIcon>
  );
}

export function VolumeIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M4 9v6h4l5 4V5L8 9Z" />
      <path d="M16 9.5a4 4 0 0 1 0 5" />
      <path d="M18.5 7a7 7 0 0 1 0 10" />
    </BaseIcon>
  );
}

export function LogInIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <path d="M10 17l5-5-5-5" />
      <path d="M15 12H3" />
    </BaseIcon>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 19a7 7 0 0 1 14 0" />
    </BaseIcon>
  );
}

export function BookIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M4.5 6.5A2.5 2.5 0 0 1 7 4h11v14.5a1.5 1.5 0 0 0-1.5-1.5H7A2.5 2.5 0 0 0 4.5 19Z" />
      <path d="M7 4v13" />
    </BaseIcon>
  );
}

export function UsersIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M16 19a4 4 0 0 0-8 0" />
      <circle cx="12" cy="10" r="3" />
      <path d="M20 19a3 3 0 0 0-2.4-2.94" />
      <path d="M6.4 16.06A3 3 0 0 0 4 19" />
      <path d="M17.5 7.5a2.5 2.5 0 1 1 0 5" />
      <path d="M6.5 12.5a2.5 2.5 0 1 1 0-5" />
    </BaseIcon>
  );
}

export function ChartIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M4 19h16" />
      <path d="M7 16V9" />
      <path d="M12 16V5" />
      <path d="M17 16v-7" />
    </BaseIcon>
  );
}

export function TrophyIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M8 4h8v3a4 4 0 0 1-8 0Z" />
      <path d="M10 15h4" />
      <path d="M12 11v4" />
      <path d="M8 20h8" />
      <path d="M16 5h2a1 1 0 0 1 1 1v.5A3.5 3.5 0 0 1 15.5 10" />
      <path d="M8 5H6a1 1 0 0 0-1 1v.5A3.5 3.5 0 0 0 8.5 10" />
    </BaseIcon>
  );
}

export function MedalIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="14" r="4" />
      <path d="m10 10-2-6 4 2 4-2-2 6" />
      <path d="m10.5 14 1 1 2-2" />
    </BaseIcon>
  );
}

export function GlobeIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18" />
      <path d="M12 3a14 14 0 0 0 0 18" />
    </BaseIcon>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M12 3 6 5.5v5.8c0 4 2.5 7.7 6 9.7 3.5-2 6-5.7 6-9.7V5.5Z" />
      <path d="m9.5 12 1.8 1.8 3.2-3.6" />
    </BaseIcon>
  );
}

export function SparkIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z" />
    </BaseIcon>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="m12 3.8 2.52 5.1 5.63.82-4.08 3.98.96 5.62L12 16.67 6.97 19.32l.96-5.62-4.08-3.98 5.63-.82Z" />
    </BaseIcon>
  );
}

export function ShareIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="18" cy="5" r="2" />
      <circle cx="6" cy="12" r="2" />
      <circle cx="18" cy="19" r="2" />
      <path d="m7.8 11 8-4.6" />
      <path d="m7.8 13 8 4.6" />
    </BaseIcon>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </BaseIcon>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M13.5 20v-6.2h2.3l.4-2.8h-2.7V9.2c0-.8.3-1.5 1.6-1.5H16V5.3c-.3 0-.9-.1-1.8-.1-2.8 0-4.2 1.5-4.2 4.3V11H7.8v2.8H10V20" />
    </BaseIcon>
  );
}

export function YouTubeIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="3.5" y="6.5" width="17" height="11" rx="3" />
      <path d="m10.5 9.5 4 2.5-4 2.5Z" fill="currentColor" stroke="none" />
    </BaseIcon>
  );
}

export function XIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M5 5l14 14" />
      <path d="M19 5 5 19" />
    </BaseIcon>
  );
}

export function WhatsappIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M12.04 3.5a8.35 8.35 0 0 0-7.18 12.62L3.9 20.5l4.48-1.08a8.33 8.33 0 0 0 3.66.85 8.39 8.39 0 0 0 0-16.77Zm0 15.27a6.86 6.86 0 0 1-3.5-.96l-.25-.15-2.66.64.57-2.62-.17-.27a6.85 6.85 0 1 1 6.01 3.36Zm3.76-5.13c-.21-.1-1.22-.6-1.41-.67-.19-.07-.33-.1-.47.1-.14.21-.54.67-.66.81-.12.14-.24.16-.45.05-.21-.1-.88-.32-1.67-1.03-.62-.55-1.04-1.23-1.16-1.44-.12-.21-.01-.32.09-.43.09-.09.21-.24.31-.36.1-.12.14-.21.21-.35.07-.14.03-.26-.02-.36-.05-.1-.47-1.13-.64-1.55-.17-.4-.34-.35-.47-.36h-.4c-.14 0-.36.05-.55.26-.19.21-.72.7-.72 1.71 0 1.01.74 1.99.84 2.13.1.14 1.45 2.21 3.51 3.1.49.21.87.34 1.17.43.49.16.94.13 1.29.08.39-.06 1.22-.5 1.39-.98.17-.48.17-.9.12-.98-.05-.09-.19-.14-.4-.24Z"
      />
    </svg>
  );
}
