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
        {...props}
    >
        {paths.map((d, i) => <path key={i} d={d} />)}
    </svg>
);


export const HomeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <CompoundIcon paths={["M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z", "M9 22V12h6v10"]} {...props} />;
export const ArrowLeftRight: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <CompoundIcon paths={["M8 3 4 7l4 4", "M4 7h16", "m-8 14 4-4-4-4", "M20 17H4"]} {...props} />;
export const Lightbulb: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <CompoundIcon paths={["M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5","M9 18h6","M10 22h4"]} {...props} />;
export const Target: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <CompoundIcon paths={["M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z", "M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z", "M12 8a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"]} {...props} />;
export const TrendingDown: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <CompoundIcon paths={["m22 17-8.29-8.29a2 2 0 0 0-2.83 0L8 11.59l-4.29-4.3a2 2 0 0 0-2.83 0L1 7", "M22 7v10h-10"]} {...props} />;
export const TrendingUp: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <CompoundIcon paths={["m22 7-8.29 8.29a2 2 0 0 1-2.83 0L8 12.41l-4.29 4.3a2 2 0 0 1-2.83 0L1 17", "M22 17V7h-10"]} {...props} />;
export const Calendar: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <CompoundIcon paths={["M8 2v4", "M16 2v4", "M3 10h18", "M21 6H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2Z"]} {...props} />;
export const Wrench: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" {...props} />;
export const Settings: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <CompoundIcon paths={["M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z","M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"]} {...props} />;
export const PlusCircle: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <CompoundIcon paths={["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M12 8v8", "M8 12h8"]} {...props} />;
export const Filter: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" {...props} />;
export const FolderSync: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <CompoundIcon paths={["M10.06 10.94a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z","M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L8.6 3.3A2 2 0 0 0 6.9 2H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2Z","M12 10v4h4"]} {...props} />;
export const PencilIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <CompoundIcon paths={["M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z", "m15 5 4 4"]} {...props} />;
export const XIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <CompoundIcon paths={["M18 6 6 18", "M6 6l12 12"]} {...props} />;
export const Zap: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" {...props} />;
export const MoreHorizontal: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <CompoundIcon paths={["M6 12h.01", "M12 12h.01", "M18 12h.01"]} {...props} />;
export const Trophy: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <CompoundIcon paths={["M6 9H4.5a2.5 2.5 0 0 1 0-5H6", "M18 9h1.5a2.5 2.5 0 0 0 0-5H18", "M4 22h16", "M10 14.66V22", "M14 14.66V22", "M8 4v.5", "M16 4v.5", "M12 6V2"]} {...props} />;
export const LockClosed: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <CompoundIcon paths={["M7 11V7a5 5 0 0 1 10 0v4", "M2 11h20", "M3 22h18"]} {...props} />;
export const UploadCloud: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <CompoundIcon paths={["M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242", "m12 12-4-4-4 4", "M12 12v9"]} {...props} />;
export const ArrowDownLeft: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <CompoundIcon paths={["M17 7 7 17", "M17 17H7V7"]} {...props} />;
export const ArrowUpRight: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <CompoundIcon paths={["M7 17 17 7", "M17 17V7H7"]} {...props} />;
export const Wallet: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <CompoundIcon paths={["M21 12V7H5a2 2 0 0 1 0-4h14a2 2 0 0 1 2 2v4","M1 12v2a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2v-2","M1 12h22"]} {...props} />;
export const PiggyBank: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <CompoundIcon paths={["m10 13.1-1.5-1.5", "M14 10.9 12.5 9.4", "m13 14-4-4", "m5 8 2 2", "M9 17h1", "M15 17h1", "M22 17v-1c0-1.7-1.3-3-3-3h-1", "M3 14c-1.1 0-2 .9-2 2v1h2", "M17 16c-1.7 0-3 1.3-3 3v1h4v-1c0-1.7-1.3-3-3-3Z"]} {...props} />;
export const Utensils: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <CompoundIcon paths={["M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2","M7 2v11","M21 15V2","m-4 13-2-3h4l-2 3Z"]} {...props} />;
export const ShoppingCart: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <CompoundIcon paths={["M6 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z", "M17 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z", "M17 17H6V3H4"]} {...props} />;
export const Car: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <CompoundIcon paths={["M14 16H9m10 0h1","M4 16H3","m14-6-1-5H7L6 10","m15 6-1.5-2","M6 10-1.5-2","M12 20a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1h0a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1Z"]} {...props} />;
export const Shirt: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <CompoundIcon paths={["m21 4-1.83-2.74a2 2 0 0 0-3.34 0L14 4", "m1 14 3-3 4 4 5-5 5 5", "M2 20h20"]} {...props} />;
export const Heart: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" {...props} />;
export const BookOpen: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <CompoundIcon paths={["M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z","M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"]} {...props} />;
export const Gift: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <CompoundIcon paths={["M20 12v10H4V12","M2 7h20v5H2z","M12 22V7","M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z","M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"]} {...props} />;
export const Plane: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" {...props} />;
export const Dumbbell: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <CompoundIcon paths={["m12 6-2-2-2 2", "m6 12 2-2 2 2", "m18 12 2-2-2-2", "m12 18 2 2 2-2", "M17 7 7 17"]} {...props} />;
export const Gamepad: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <CompoundIcon paths={["M14 6L12 8l-2-2","M6 14l-2 2 2 2","m14 0 2 2-2 2","M10 18v-4h4v4Z","M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"]} {...props} />;
export const Film: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <CompoundIcon paths={["M22 6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z", "M6 2v20", "M18 2v20"]} {...props} />;
export const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <CompoundIcon paths={["M3 6h18", "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2", "M10 11v6", "M14 11v6"]} {...props} />;