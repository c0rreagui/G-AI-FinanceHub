import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement> & {
  title?: string;
};

const Icon: React.FC<IconProps> = ({ children, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" {...props}>
    {children}
  </svg>
);

export const MicIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5a6 6 0 00-12 0v1.5a6 6 0 006 6zM12 12.75V15m0 3.75V15m0-3.75V9.75M5.25 12a6.75 6.75 0 0013.5 0M1.5 12a10.5 10.5 0 0021 0" />
  </Icon>
);
export const PaperclipIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.122 2.122l7.81-7.81" />
  </Icon>
);
export const SendIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></Icon>
);
export const SearchIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></Icon>
);
export const MapPinIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></Icon>
);
export const HomeIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" /></Icon>
);
export const ArrowLeftRight: React.FC<IconProps> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h18m-7.5-12L21 9m0 0L16.5 4.5M21 9H3" /></Icon>
);
export const ArrowDownLeft: React.FC<IconProps> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 4.5l-15 15m0 0h11.25m-11.25 0V8.25" /></Icon>
);
export const ArrowUpRight: React.FC<IconProps> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></Icon>
);
export const PlusCircle: React.FC<IconProps> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></Icon>
);
export const CreditCard: React.FC<IconProps> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></Icon>
);
export const Filter: React.FC<IconProps> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.572a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" /></Icon>
);
export const BarChart: React.FC<IconProps> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></Icon>
);
export const Target: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 15.91a7.5 7.5 0 11-10.61-10.61 7.5 7.5 0 0110.61 10.61z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
  </Icon>
);
export const TrendingDown: React.FC<IconProps> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.286 4.286a1 1 0 0 0 1.414 0l4.286-4.286M2.25 18v-4.5m0 4.5h4.5" /></Icon>
);
export const Calendar: React.FC<IconProps> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M12 12.75h.008v.008H12v-.008z" /></Icon>
);
export const Tool: React.FC<IconProps> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.73-.664 1.193-.816l-2.496 3.03z" /><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L10.648 16.35c-.783.996-2.023 1.6-3.328 1.6s-2.546-.604-3.328-1.6l-.772-1.182.772-1.182c.782-.996 2.023-1.6 3.328-1.6s2.545.604 3.328 1.6l.772 1.182-.772 1.182zM11.42 15.17l2.496-3.03" /></Icon>
);
export const Settings: React.FC<IconProps> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></Icon>
);
export const Lightbulb: React.FC<IconProps> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.375 6.375 0 006.375-6.375H5.625a6.375 6.375 0 006.375 6.375zM12 18H9.75m2.25 0H14.25M9 12.75a3 3 0 013-3h0a3 3 0 013 3v2.25H9v-2.25z" /></Icon>
);
export const Utensils: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
    <path d="M7 2v20" />
    <path d="M21 15V2c0-1.1-.9-2-2-2h-4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2z" />
  </Icon>
);
export const ShoppingCart: React.FC<IconProps> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962-.343 1.087-.835l1.823-6.482A1.125 1.125 0 0018.102 6H5.25M7.5 14.25L5.106 5.165A1.125 1.125 0 004.021 4.5H2.25" /></Icon>
);
export const Car: React.FC<IconProps> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H3.375A2.25 2.25 0 001.125 6.75v10.5a2.25 2.25 0 002.25 2.25z" /></Icon>
);
export const Shirt: React.FC<IconProps> = (props) => (
  <Icon {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V9.75M8.25 9.75V3.375c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v6.375" />
  </Icon>
);
export const PiggyBank: React.FC<IconProps> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a1.5 1.5 0 011.5-1.5h16.5a1.5 1.5 0 011.5 1.5v-12A1.5 1.5 0 0019.5 3.75h-15A1.5 1.5 0 003 5.25v12a1.5 1.5 0 00-1.5-1.5H2.25zm16.5-1.5H12m0 0V9m0 6a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" /></Icon>
);
export const Heart: React.FC<IconProps> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></Icon>
);
export const BookOpen: React.FC<IconProps> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6-2.292m0 0v14.25" /></Icon>
);
export const Gift: React.FC<IconProps> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 19.5v-8.25M12 4.5v15m0-15H5.25m6.75 0H18.75m0 0v15m0-15L12 1.5m6.75 3L12 1.5m0 0L5.25 4.5" /></Icon>
);
export const Plane: React.FC<IconProps> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5l.5-2.5m-1 1.5l-1.5-1.5m2.5-1.5L21 4.5 2.5 12l6.5 2.5m6.5-2.5L12 19.5" /></Icon>
);
export const Dumbbell: React.FC<IconProps> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></Icon>
);
export const Gamepad: React.FC<IconProps> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a14.95 14.95 0 01-5.84 2.56m0-2.56V9.63a14.95 14.95 0 01-5.84 2.56m11.68 0a14.92 14.92 0 01-5.84-2.56m5.84 2.56a14.88 14.88 0 015.84 2.56" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 110-18 9 9 0 010 18zm0 0a9 9 0 00-9-9 9 9 0 0118 0 9 9 0 00-9 9z" /></Icon>
);
export const Film: React.FC<IconProps> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6 3.75a.75.75 0 01.75-.75h10.5a.75.75 0 01.75.75v16.5a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V3.75zM9 3.75v16.5m6-16.5v16.5M9 6.75h6m-6 3h6m-6 3h6m-6 3h6" /></Icon>
);
export const Wallet: React.FC<IconProps> = (props) => (
  <Icon {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 3a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m14.25 6h.008v.008h-.008V15z" />
  </Icon>
);
export const XIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></Icon>
);
export const Trophy: React.FC<IconProps> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V18.75m-15 0v-3.375c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125V18.75m9-15.75h.008v.008H12V3z" /></Icon>
);
export const LockClosed: React.FC<IconProps> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></Icon>
);
export const SignalIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v18M12 8.25v12.75M15.75 12v9" /></Icon>
);
export const XCircleIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></Icon>
);