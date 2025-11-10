import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement> & {
  title?: string;
};

// Base Icon component updated for the new icon set (Lucide style)
// Stroke width is now 2 for better visual weight and consistency.
const Icon: React.FC<IconProps> = ({ children, ...props }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={2} // Changed from 1.5 to 2
    stroke="currentColor" 
    className="w-6 h-6" 
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {children}
  </svg>
);

// All icons below are replaced with their Lucide equivalents for a cohesive and modern look.
// Heroicons paths have been completely replaced.

export const MicIcon: React.FC<IconProps> = (props) => (
    <Icon {...props}>
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" x2="12" y1="19" y2="22" />
    </Icon>
);

export const PaperclipIcon: React.FC<IconProps> = (props) => (
    <Icon {...props}>
        <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </Icon>
);

export const SendIcon: React.FC<IconProps> = (props) => (
    <Icon {...props}>
        <path d="m22 2-7 20-4-9-9-4Z" />
        <path d="M22 2 11 13" />
    </Icon>
);

export const SearchIcon: React.FC<IconProps> = (props) => (
    <Icon {...props}>
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
    </Icon>
);

export const MapPinIcon: React.FC<IconProps> = (props) => (
    <Icon {...props}>
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
    </Icon>
);

export const HomeIcon: React.FC<IconProps> = (props) => (
    <Icon {...props}>
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
    </Icon>
);

export const ArrowLeftRight: React.FC<IconProps> = (props) => (
    <Icon {...props}>
        <path d="M8 3 4 7l4 4" />
        <path d="M4 7h16" />
        <path d="m16 21 4-4-4-4" />
        <path d="M20 17H4" />
    </Icon>
);

export const ArrowDownLeft: React.FC<IconProps> = (props) => (
    <Icon {...props}>
        <path d="M17 7 7 17" />
        <path d="M17 17H7V7" />
    </Icon>
);

export const ArrowUpRight: React.FC<IconProps> = (props) => (
    <Icon {...props}>
        <path d="M7 17h10V7" />
        <path d="M7 7l10 10" />
    </Icon>
);

export const PlusCircle: React.FC<IconProps> = (props) => (
    <Icon {...props}>
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12h8" />
        <path d="M12 8v8" />
    </Icon>
);

export const CreditCard: React.FC<IconProps> = (props) => (
    <Icon {...props}>
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <line x1="2" x2="22" y1="10" y2="10" />
    </Icon>
);

export const Filter: React.FC<IconProps> = (props) => (
    <Icon {...props}>
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </Icon>
);

export const BarChart: React.FC<IconProps> = (props) => (
    <Icon {...props}>
        <line x1="12" x2="12" y1="20" y2="10" />
        <line x1="18" x2="18" y1="20" y2="4" />
        <line x1="6" x2="6" y1="20" y2="16" />
    </Icon>
);

export const Target: React.FC<IconProps> = (props) => (
    <Icon {...props}>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
    </Icon>
);

export const TrendingDown: React.FC<IconProps> = (props) => (
    <Icon {...props}>
        <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
        <polyline points="16 17 22 17 22 11" />
    </Icon>
);

export const Calendar: React.FC<IconProps> = (props) => (
    <Icon {...props}>
        <path d="M8 2v4" />
        <path d="M16 2v4" />
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <path d="M3 10h18" />
    </Icon>
);

// Used for Ferramentas
export const Tool: React.FC<IconProps> = (props) => (
    <Icon {...props}>
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </Icon>
);

// Settings icon is now more abstract and modern
export const Settings: React.FC<IconProps> = (props) => (
    <Icon {...props}>
        <path d="M20 7h-9" />
        <path d="M14 17H4" />
        <circle cx="17" cy="17" r="3" />
        <circle cx="7" cy="7" r="3" />
    </Icon>
);

export const Lightbulb: React.FC<IconProps> = (props) => (
    <Icon {...props}>
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
        <path d="M9 18h6" />
        <path d="M10 22h4" />
    </Icon>
);

export const Utensils: React.FC<IconProps> = (props) => (
    <Icon {...props}>
        <path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8" />
        <path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 1.6.7 2.3 0l7.3-7.3a4.2 4.2 0 0 0 0-6L15 15Z" />
    </Icon>
);

export const ShoppingCart: React.FC<IconProps> = (props) => (
    <Icon {...props}>
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.16" />
    </Icon>
);

export const Car: React.FC<IconProps> = (props) => (
    <Icon {...props}>
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7s-1.3.3-1.8.7C9.3 8.6 8 10 8 10s-2.7.6-4.5.8C2.7 11.1 2 11.9 2 12.8v3c0 .6.4 1 1 1h2" />
        <circle cx="7" cy="17" r="2" />
        <circle cx="17" cy="17" r="2" />
    </Icon>
);

export const Shirt: React.FC<IconProps> = (props) => (
    <Icon {...props}>
        <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
    </Icon>
);

export const PiggyBank: React.FC<IconProps> = (props) => (
    <Icon {...props}>
        <path d="M8.5 16.5a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5h7a5 5 0 0 1 5 5v1"/>
        <path d="M10 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
        <path d="M19 12h.01"/>
        <path d="m5.5 13.5 2 2"/>
        <path d="M2 17h20"/>
        <path d="M2 21h20"/>
    </Icon>
);

export const Heart: React.FC<IconProps> = (props) => (
    <Icon {...props}>
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </Icon>
);

export const BookOpen: React.FC<IconProps> = (props) => (
    <Icon {...props}>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </Icon>
);

export const Gift: React.FC<IconProps> = (props) => (
    <Icon {...props}>
        <rect x="3" y="8" width="18" height="4" rx="1" />
        <path d="M12 8v13" />
        <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
        <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
    </Icon>
);

export const Plane: React.FC<IconProps> = (props) => (
    <Icon {...props}>
        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1.5-1.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
    </Icon>
);

export const Dumbbell: React.FC<IconProps> = (props) => (
    <Icon {...props}>
        <path d="M14.4 14.4 9.6 9.6" />
        <path d="M18.657 21.314a2 2 0 0 1-2.828 0l-1.414-1.414a2 2 0 0 1 0-2.828l1.414-1.414a2 2 0 0 1 2.828 0l1.414 1.414a2 2 0 0 1 0 2.828z" />
        <path d="m8.485 9.9-1.414-1.414a2 2 0 0 1 0-2.828l1.414-1.414a2 2 0 0 1 2.828 0l1.414 1.414a2 2 0 0 1 0 2.828z" />
        <path d="M2.686 21.314a2 2 0 0 1 0-2.828l1.414-1.414a2 2 0 0 1 2.828 0l1.414 1.414a2 2 0 0 1 0 2.828l-1.414 1.414a2 2 0 0 1-2.828 0z" />
        <path d="m15.515 9.9 1.414-1.414a2 2 0 0 1 2.828 0l1.414 1.414a2 2 0 0 1 0 2.828l-1.414 1.414a2 2 0 0 1-2.828 0z" />
    </Icon>
);

export const Gamepad: React.FC<IconProps> = (props) => (
    <Icon {...props}>
        <line x1="6" x2="10" y1="12" y2="12" />
        <line x1="8" x2="8" y1="10" y2="14" />
        <line x1="15" x2="15" y1="13" y2="13" />
        <line x1="18" x2="18" y1="11" y2="11" />
        <path d="M17.5 2a4.5 4.5 0 0 1 0 9H13v-2H8.5v2H6.5a4.5 4.5 0 1 1 0-9H10v2h4V2h3.5z" />
    </Icon>
);

export const Film: React.FC<IconProps> = (props) => (
    <Icon {...props}>
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M7 3v18" />
        <path d="M17 3v18" />
        <path d="M3 7.5h4" />
        <path d="M3 12h18" />
        <path d="M3 16.5h4" />
        <path d="M17 7.5h4" />
        <path d="M17 16.5h4" />
    </Icon>
);

export const Wallet: React.FC<IconProps> = (props) => (
    <Icon {...props}>
        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
        <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </Icon>
);

export const XIcon: React.FC<IconProps> = (props) => (
    <Icon {...props}>
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
    </Icon>
);

export const Trophy: React.FC<IconProps> = (props) => (
    <Icon {...props}>
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </Icon>
);

export const LockClosed: React.FC<IconProps> = (props) => (
    <Icon {...props}>
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </Icon>
);

export const SignalIcon: React.FC<IconProps> = (props) => (
    <Icon {...props}>
        <path d="M2 20h.01" />
        <path d="M7 20v-4" />
        <path d="M12 20v-8" />
        <path d="M17 20V8" />
        <path d="M22 4v16" />
    </Icon>
);

export const XCircleIcon: React.FC<IconProps> = (props) => (
    <Icon {...props}>
        <circle cx="12" cy="12" r="10" />
        <path d="m15 9-6 6" />
        <path d="m9 9 6 6" />
    </Icon>
);

export const TrashIcon: React.FC<IconProps> = (props) => (
    <Icon {...props}>
        <path d="M3 6h18" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="10" x2="10" y1="11" y2="17" />
        <line x1="14" x2="14" y1="11" y2="17" />
    </Icon>
);

export const UploadCloud: React.FC<IconProps> = (props) => (
    <Icon {...props}>
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
        <path d="M12 12v9" />
        <path d="m16 16-4-4-4 4" />
    </Icon>
);

export const Zap: React.FC<IconProps> = (props) => (
    <Icon {...props}>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </Icon>
);

// Wrench is an alias for Tool
export const Wrench: React.FC<IconProps> = (props) => (
    <Icon {...props}>
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </Icon>
);
