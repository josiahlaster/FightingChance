/**
 * Minimal inline SVG icon set (stroke-based, currentColor) so the site
 * has zero icon dependencies. Icons are decorative by default; pass a
 * title to make an icon meaningful to screen readers.
 */
const base = {
  width: 28,
  height: 28,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.9,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
};

/** @type {any} */
const baseAny = base;

const BaseIcon = ({ title, children, ...rest }) => {
  return (
    <svg {...baseAny} {...rest}>
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
};

export const HouseIcon = (props) => (
  <BaseIcon {...props}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V21h14V9.5" />
    <path d="M10 21v-6h4v6" />
  </BaseIcon>
);

export const HeartHandsIcon = (props) => (
  <BaseIcon {...props}>
    <path d="M12 8.2c.9-2.1 3.6-2.4 4.7-.8 1 1.4.5 3.2-1.4 4.8L12 15l-3.3-2.8C6.8 10.6 6.3 8.8 7.3 7.4c1.1-1.6 3.8-1.3 4.7.8Z" />
    <path d="M3 16.5c2.2 3 5.4 4.5 9 4.5s6.8-1.5 9-4.5" />
  </BaseIcon>
);

export const HandshakeIcon = (props) => (
  <BaseIcon {...props}>
    <path d="m8 12-3 3 4.5 4.5a2 2 0 0 0 2.8 0L21 11" />
    <path d="M11 17.2 13 19a2 2 0 0 0 2.8-.2" />
    <path d="M3 7l4-3 5 1 4-1 5 3v6l-3 2" />
    <path d="M9.5 5.5 12 8l2.5-2.5" />
  </BaseIcon>
);

export const ShieldIcon = (props) => (
  <BaseIcon {...props}>
    <path d="M12 3 5 5.8v5.4c0 4.4 3 8 7 9.8 4-1.8 7-5.4 7-9.8V5.8L12 3Z" />
    <path d="m9 11.5 2.2 2.2L15.5 9" />
  </BaseIcon>
);

export const PeopleIcon = (props) => (
  <BaseIcon {...props}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 20c.6-3.4 2.8-5.2 5.5-5.2s4.9 1.8 5.5 5.2" />
    <circle cx="17" cy="9.5" r="2.4" />
    <path d="M15.8 14.6c2.6-.4 4.4 1.3 4.9 4.4" />
  </BaseIcon>
);

export const PinIcon = (props) => (
  <BaseIcon {...props}>
    <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Z" />
    <circle cx="12" cy="10" r="2.6" />
  </BaseIcon>
);

export const PhoneIcon = (props) => (
  <BaseIcon {...props}>
    <path d="M5 4h4l1.5 4-2 1.5a12 12 0 0 0 6 6L16 13.5l4 1.5v4a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3 6.2 2 2 0 0 1 5 4Z" />
  </BaseIcon>
);

export const MailIcon = (props) => (
  <BaseIcon {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </BaseIcon>
);

export const StethoscopeIcon = (props) => (
  <BaseIcon {...props}>
    <path d="M5 3v5a4 4 0 0 0 8 0V3" />
    <path d="M9 12v3a5 5 0 0 0 10 0v-2" />
    <circle cx="19" cy="9" r="2.2" />
  </BaseIcon>
);

export const ClipboardIcon = (props) => (
  <BaseIcon {...props}>
    <rect x="5" y="4" width="14" height="17" rx="2" />
    <path d="M9 4a3 3 0 0 1 6 0" />
    <path d="M9 11h6M9 15h4" />
  </BaseIcon>
);

export const CheckIcon = (props) => (
  <BaseIcon {...props}>
    <path d="m4.5 12.5 5 5 10-11" />
  </BaseIcon>
);

export const ArrowRightIcon = (props) => (
  <BaseIcon {...props}>
    <path d="M4 12h15" />
    <path d="m13 6 6 6-6 6" />
  </BaseIcon>
);

export const BrokenChainIcon = (props) => (
  <BaseIcon {...props}>
    <path d="M9.5 14.5 6 18a3.5 3.5 0 0 1-5-5l3.5-3.5" transform="translate(1.5 1)" />
    <path d="M14.5 9.5 18 6a3.5 3.5 0 0 1 5 5l-3.5 3.5" transform="translate(-1.5 -1)" />
    <path d="m10 10 1.5 1.5M14 14l-1.5-1.5" />
  </BaseIcon>
);

export const RefreshIcon = (props) => (
  <BaseIcon {...props}>
    <path d="M20 12a8 8 0 1 1-2.34-5.66" />
    <path d="M20 3v4h-4" />
  </BaseIcon>
);

export const StepsIcon = (props) => (
  <BaseIcon {...props}>
    <path d="M4 20h4v-4h4v-4h4V8h4" />
  </BaseIcon>
);

export const MenuIcon = (props) => (
  <BaseIcon {...props}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </BaseIcon>
);

export const CloseIcon = (props) => (
  <BaseIcon {...props}>
    <path d="m6 6 12 12M18 6 6 18" />
  </BaseIcon>
);

export const AlertIcon = (props) => (
  <BaseIcon {...props}>
    <path d="M12 3 2.5 20h19L12 3Z" />
    <path d="M12 10v4" />
    <path d="M12 17.2v.1" />
  </BaseIcon>
);
