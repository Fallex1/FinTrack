// Inline stroke icons (lucide paths). No emoji, no icon lib.
type P = { className?: string };

function Svg({ className, children }: P & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const IconBriefcase = ({ className }: P) => (
  <Svg className={className}>
    <rect width="20" height="14" x="2" y="7" rx="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </Svg>
);

export const IconTrendingUp = ({ className }: P) => (
  <Svg className={className}>
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </Svg>
);

export const IconTrendingDown = ({ className }: P) => (
  <Svg className={className}>
    <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
    <polyline points="16 17 22 17 22 11" />
  </Svg>
);

export const IconWallet = ({ className }: P) => (
  <Svg className={className}>
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
  </Svg>
);

export const IconUtensils = ({ className }: P) => (
  <Svg className={className}>
    <path d="M3 2v7c0 1.1.9 2 2 2h1a2 2 0 0 0 2-2V2" />
    <path d="M7 2v20" />
    <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
  </Svg>
);

export const IconArrowLeftRight = ({ className }: P) => (
  <Svg className={className}>
    <path d="M8 3 4 7l4 4" />
    <path d="M4 7h16" />
    <path d="m16 21 4-4-4-4" />
    <path d="M20 17H4" />
  </Svg>
);

export const IconShoppingBag = ({ className }: P) => (
  <Svg className={className}>
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </Svg>
);

export const IconPiggyBank = ({ className }: P) => (
  <Svg className={className}>
    <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2h0V5Z" />
    <path d="M2 9v1c0 1.1.9 2 2 2h1" />
    <path d="M16 11h.01" />
  </Svg>
);

export const IconTicket = ({ className }: P) => (
  <Svg className={className}>
    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
    <path d="M13 5v2" />
    <path d="M13 17v2" />
    <path d="M13 11v2" />
  </Svg>
);

export const IconPlus = ({ className }: P) => (
  <Svg className={className}>
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </Svg>
);

export const IconTrash = ({ className }: P) => (
  <Svg className={className}>
    <path d="M3 6h18" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4a3 3 0 1 1 6 0v2" />
  </Svg>
);

export const IconEdit = ({ className }: P) => (
  <Svg className={className}>
    <path d="M11 4.059 13 6l7-7" />
    <path d="M12 18H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4.5" />
  </Svg>
);export const IconUpload = ({ className }: P) => (
  <Svg className={className}>
    <path d="M21 15v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2l3-3h6l3 3h2a2 2 0 0 1 2 2z" />
    <path d="M12 18V8" />
    <path d="M9 11l3 3 3-3" />
  </Svg>
);

export const IconTag = ({ className }: P) => (
  <Svg className={className}>
    <path d="M9.25 12.5L6 15.75V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10.75l-3.25-3.25z" />
  </Svg>
);

export const IconFileText = ({ className }: P) => (
  <Svg className={className}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
  </Svg>
);
