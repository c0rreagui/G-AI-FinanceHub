import React from 'react';

// FIX: Added icon components that were missing.
// This is a helper to create simple SVG icon components.
const Icon: React.FC<{ d: string } & React.SVGProps<SVGSVGElement>> = ({ d, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...props}
    >
        <path d={d} />
    </svg>
);

const CompoundIcon: React.FC<{ paths: string[] } & React.SVGProps<SVGSVGElement>> = ({ paths, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...props}
    >
        {paths.map((d, i) => <path key={i} d={d} />)}
    </svg>
);


export const HomeIcon = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", "M9 22V12h6v10"]} {...props} />);
export const ArrowLeftRight = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["M8 3 4 7l4 4", "M4 7h16", "m -8 14 4 -4 -4 -4", "M20 17H4"]} {...props} />);
export const Lightbulb = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5", "M9 18h6", "M10 22h4"]} {...props} />);
export const Target = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z", "M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z", "M12 8a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"]} {...props} />);
export const TrendingDown = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["m 22 17 -8.29 -8.29 a2 2 0 0 0 -2.83 0L8 11.59l-4.29-4.3a2 2 0 0 0 -2.83 0L1 7", "M22 7v10h-10"]} {...props} />);
export const TrendingUp = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["m 22 7 -8.29 8.29 a2 2 0 0 1 -2.83 0L8 12.41l-4.29 4.3a2 2 0 0 1 -2.83 0L1 17", "M22 17V7h-10"]} {...props} />);
export const Calendar = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["M8 2v4", "M16 2v4", "M3 10h18", "M21 6H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2Z"]} {...props} />);
export const Wrench = React.memo((props: React.SVGProps<SVGSVGElement>) => <Icon d="M 14.7 6.3 a 1 1 0 0 0 0 1.4 l 1.6 1.6 a 1 1 0 0 0 1.4 0 l 3.77 -3.77 a 6 6 0 0 1 -7.94 7.94 l -6.91 6.91 a 2.12 2.12 0 0 1 -3 -3 l 6.91 -6.91 a 6 6 0 0 1 7.94 -7.94 l -3.76 3.76 z" {...props} />);
export const Settings = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z", "M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"]} {...props} />);
export const PlusCircle = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M12 8v8", "M8 12h8"]} {...props} />);
export const Filter = React.memo((props: React.SVGProps<SVGSVGElement>) => <Icon d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" {...props} />);
export const FolderSync = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["M10.06 10.94a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z", "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L8.6 3.3A2 2 0 0 0 6.9 2H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2Z", "M12 10v4h4"]} {...props} />);
export const PencilIcon = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z", "m 15 5 4 4"]} {...props} />);
export const XIcon = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["M18 6 6 18", "M6 6l12 12"]} {...props} />);
export const Zap = React.memo((props: React.SVGProps<SVGSVGElement>) => <Icon d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" {...props} />);
export const MoreHorizontal = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["M6 12h.01", "M12 12h.01", "M18 12h.01"]} {...props} />);
export const Trophy = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["M6 9H4.5a2.5 2.5 0 0 1 0-5H6", "M18 9h1.5a2.5 2.5 0 0 0 0-5H18", "M4 22h16", "M10 14.66V22", "M14 14.66V22", "M8 4v.5", "M16 4v.5", "M12 6V2"]} {...props} />);
export const LockClosed = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["M7 11V7a5 5 0 0 1 10 0v4", "M2 11h20", "M3 22h18"]} {...props} />);
export const UploadCloud = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242", "m 12 12 -4 -4 -4 4", "M12 12v9"]} {...props} />);
export const Upload = UploadCloud;
export const ArrowDownLeft = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["M17 7 7 17", "M17 17H7V7"]} {...props} />);
export const ArrowUpRight = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["M7 17 17 7", "M17 17V7H7"]} {...props} />);
export const Wallet = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["M21 12V7H5a2 2 0 0 1 0-4h14a2 2 0 0 1 2 2v4", "M1 12v2a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2v-2", "M1 12h22"]} {...props} />);
export const PiggyBank = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["m 10 13.1 -1.5 -1.5", "M 14 10.9 12.5 9.4", "m 13 14 -4 -4", "m 5 8 2 2", "M9 17h1", "M15 17h1", "M22 17v-1c0-1.7-1.3-3-3-3h-1", "M3 14c-1.1 0-2 .9-2 2v1h2", "M17 16c-1.7 0-3 1.3-3 3v1h4v-1c0-1.7-1.3-3-3-3Z"]} {...props} />);
export const Utensils = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2", "M7 2v11", "M21 15V2", "m -4 13 -2 -3h4l-2 3Z"]} {...props} />);
export const ShoppingCart = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["M6 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z", "M17 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z", "M17 17H6V3H4"]} {...props} />);
export const Car = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["M14 16H9 m 10 0h1", "M4 16H3", "m 14 -6 -1 -5H7L6 10", "m 15 6 -1.5 -2", "M6 10l-1.5-2", "M12 20a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1h0a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1Z"]} {...props} />);
export const Shirt = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["m 21 4 -1.83 -2.74 a 2 2 0 0 0 -3.34 0L14 4", "m 1 14 3 -3 4 4 5 -5 5 5", "M2 20h20"]} {...props} />);
export const Heart = React.memo((props: React.SVGProps<SVGSVGElement>) => <Icon d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" {...props} />);
export const BookOpen = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z", "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"]} {...props} />);
export const Gift = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["M20 12v10H4V12", "M2 7h20v5H2z", "M12 22V7", "M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z", "M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"]} {...props} />);
export const Plane = React.memo((props: React.SVGProps<SVGSVGElement>) => <Icon d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" {...props} />);
export const Dumbbell = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["m 12 6 -2 -2 -2 2", "m 6 12 2 -2 2 2", "m 18 12 2 -2 -2 -2", "m 12 18 2 2 2 -2", "M17 7 7 17"]} {...props} />);
export const Gamepad = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["M14 6L12 8l-2-2", "M6 14l-2 2 2 2", "m 14 0 2 2 -2 2", "M10 18v-4h4v4Z", "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"]} {...props} />);
export const Film = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["M22 6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z", "M6 2v20", "M18 2v20"]} {...props} />);
export const TrashIcon = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["M3 6h18", "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2", "M10 11v6", "M14 11v6"]} {...props} />);
export const Trash2 = TrashIcon;
export const LinkIcon = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72", "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"]} {...props} />);
export const ChevronDown = React.memo((props: React.SVGProps<SVGSVGElement>) => <Icon d="m6 9 6 6 6-6" {...props} />);
export const AlertTriangle = React.memo((props: React.SVGProps<SVGSVGElement>) => <Icon d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" {...props} />);
export const Bell = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9", "M10.3 21a1.94 1.94 0 0 0 3.4 0"]} {...props} />);
export const LayoutGrid = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["M10 3H3v7h7V3z", "M21 3h-7v7h7V3z", "M10 14H3v7h7v-7z", "M21 14h-7v7h7v-7z"]} {...props} />);
export const List = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["M8 6h13", "M8 12h13", "M8 18h13", "M3 6h.01", "M3 12h.01", "M3 18h.01"]} {...props} />);
export const Search = React.memo((props: React.SVGProps<SVGSVGElement>) => <Icon d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" {...props} />);
export const CheckSquare = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["M9 11l3 3L22 4", "M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"]} {...props} />);
export const Square = React.memo((props: React.SVGProps<SVGSVGElement>) => <Icon d="M3 3h18v18H3z" {...props} />);
export const Mic = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z", "M19 10v2a7 7 0 0 1-14 0v-2", "M12 19v4", "M8 23h8"]} {...props} />);
export const Info = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z", "M12 16v-4", "M12 8h.01"]} {...props} />);
export const RotateCcw = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["M1 4v6h6", "M3.51 15a9 9 0 1 0 2.13-9.36L1 10"]} {...props} />);
export const PieChart = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["M21.21 15.89A10 10 0 1 1 8 2.83", "M22 12A10 10 0 0 0 12 2v10z"]} {...props} />);
export const ShieldCheck = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", "m9 12 2 2 4-4"]} {...props} />);
export const CheckCircle = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["M22 11.08V12a10 10 0 1 1-5.93-9.14", "M22 4 12 14.01l-3-3"]} {...props} />);
export const Clock = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z", "M12 6v6l4 2"]} {...props} />);
export const MoreVertical = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["M12 12h.01", "M12 5h.01", "M12 19h.01"]} {...props} />);
export const QrCode = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["M3 7V5a2 2 0 0 1 2-2h2", "M17 3h2a2 2 0 0 1 2 2v2", "M21 17v2a2 2 0 0 1-2 2h-2", "M7 21H5a2 2 0 0 1-2-2v-2", "M7 9h.01", "M7 15h.01", "M12 12h.01", "M17 9h.01", "M17 15h.01"]} {...props} />);
export const Send = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["M22 2 11 13", "M22 2 15 22 11 13 2 9 22 2"]} {...props} />);
export const Sun = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["M12 2v2", "M12 20v2", "m4.93 4.93-1.41 1.41", "m19.07 19.07-1.41 1.41", "M20 12h2", "M2 12h2", "m19.07 4.93-1.41-1.41", "m4.93 19.07-1.41-1.41", "M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"]} {...props} />);
export const Moon = React.memo((props: React.SVGProps<SVGSVGElement>) => <Icon d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" {...props} />);
export const CloudRain = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242", "M16 14v6", "M8 14v6", "M12 16v6"]} {...props} />);
export const Calculator = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["M4 2v20h16V2H4zm14 18H6V4h12v16z", "M8 14h2v2H8z", "M14 14h2v2h-2z", "M8 10h2v2H8z", "M14 10h2v2h-2z", "M8 6h8v2H8z"]} {...props} />);
export const Users = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", "M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8", "M22 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75"]} {...props} />);
export const MessageSquare = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"]} {...props} />);
export const Copy = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["M8 4v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7.24a2 2 0 0 0-1.11-1.79l-6-3.24a2 2 0 0 0-1.78 0L3.11 5.45A2 2 0 0 0 2 7.24V18a2 2 0 0 0 2 2h3", "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"]} {...props} />);
export const RefreshCw = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", "M21 3v5h-5", "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", "M3 21v-5h5"]} {...props} />);
export const Eye = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z", "M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"]} {...props} />);
export const EyeOff = React.memo((props: React.SVGProps<SVGSVGElement>) => <CompoundIcon paths={["M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24", "M1 1l22 22"]} {...props} />);