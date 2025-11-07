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
export const MoreHorizontal: React.FC<IconProps> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></Icon>
);
export const BarChart: React.FC<IconProps> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></Icon>
);
export const Wallet: React.FC<IconProps> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 3a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 3V9" /></Icon>
);
export const Lightbulb: React.FC<IconProps> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311a2.349 2.349 0 01-3.75 0M10.5 3.75v6.75h3V3.75m-3 0h3M3.28 4.977a9.053 9.053 0 0117.44 0" /></Icon>
);
export const Utensils: React.FC<IconProps> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.5 13.5L18 15l-1.5 1.5" /></Icon>
);
export const ShoppingCart: React.FC<IconProps> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962-.328 1.09-.832l-2.46-7.382c-.128-.38-.51-.632-.928-.632H3.102zM12 21a.75.75 0 110-1.5.75.75 0 010 1.5zm-6 0a.75.75 0 110-1.5.75.75 0 010 1.5z" /></Icon>
);
export const Target: React.FC<IconProps> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-3.32A14.98 14.98 0 0012 2.25C6.48 2.25 2 7.125 2 12.75s4.48 10.5 10 10.5a14.98 14.98 0 008.37-3.41" /></Icon>
);
export const TrendingDown: React.FC<IconProps> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181" /></Icon>
);
export const Calendar: React.FC<IconProps> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18" /></Icon>
);
export const Tool: React.FC<IconProps> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.472-2.472a3.375 3.375 0 00-4.773-4.773L6.22 13.348a3.375 3.375 0 004.773 4.773z" /></Icon>
);
export const Settings: React.FC<IconProps> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5" /></Icon>
);
export const Car: React.FC<IconProps> = (props) => (
  <Icon {...props}><path d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5h10.5a1.125 1.125 0 001.125-1.125V6.75a1.125 1.125 0 00-1.125-1.125H4.5A1.125 1.125 0 003.375 6.75v10.5c0 .621.504 1.125 1.125 1.125z" /></Icon>
);
export const Shirt: React.FC<IconProps> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.109 1.109 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.632.524l-.052-.082a2.25 2.25 0 00-3.292 0l-.052.082a.956.956 0 01-1.632-.524l.423-1.059L3 13.125c-.6-.298-.797-1.05-.427-1.605a1.109 1.109 0 00-.57-1.664l-.143-.048a2.25 2.25 0 01-1.161-.886l-.51-.766c-.32-.48.04-1.121.216-1.49l1.068-.89a1.125 1.125 0 00.405-.864v-.568a1.125 1.125 0 011.125-1.125h3.375a1.125 1.125 0 011.125 1.125z" /></Icon>
);
export const PiggyBank: React.FC<IconProps> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.75h16.5m-16.5 0a2.25 2.25 0 012.25-2.25h12a2.25 2.25 0 012.25 2.25m-16.5 0v2.25c0 .621.504 1.125 1.125 1.125h14.25c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></Icon>
);
export const Heart: React.FC<IconProps> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></Icon>
);
export const BookOpen: React.FC<IconProps> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6-2.292m0 0v14.25" /></Icon>
);
export const Gift: React.FC<IconProps> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.109 1.109 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.632.524l-.052-.082a2.25 2.25 0 00-3.292 0l-.052.082a.956.956 0 01-1.632-.524l.423-1.059L3 13.125c-.6-.298-.797-1.05-.427-1.605a1.109 1.109 0 00-.57-1.664l-.143-.048a2.25 2.25 0 01-1.161.886l-.51-.766c-.32-.48-.04-1.121.216-1.49l1.068-.89a1.125 1.125 0 00.405-.864v-.568a1.125 1.125 0 011.125-1.125h3.375a1.125 1.125 0 011.125 1.125z" /></Icon>
);
export const Plane: React.FC<IconProps> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></Icon>
);
export const Dumbbell: React.FC<IconProps> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.91 15.182c.38-.05.753-.134 1.116-.241a6.67 6.67 0 004.292-6.233c0-3.693-2.992-6.685-6.685-6.685-3.693 0-6.685 2.992-6.685 6.685 0 2.585 1.47 4.84 3.623 5.967.332.17.67.323 1.012.46l.39.143m-1.39-4.22a3.75 3.75 0 11-5.303-5.303 3.75 3.75 0 015.303 5.303z" /></Icon>
);
export const Gamepad: React.FC<IconProps> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12.75 12.75l-2.75-2.75-2.75 2.75M9.75 10.5v4.5m3-4.5v4.5M3.75 6.75h16.5M3.75 17.25h16.5" /></Icon>
);
export const Film: React.FC<IconProps> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6 3v18M18 3v18M3 6h18M3 18h18M6.75 3h10.5M6.75 21h10.5" /></Icon>
);
export const XIcon: React.FC<IconProps> = (props) => (
    <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></Icon>
);
export const Trophy: React.FC<IconProps> = (props) => (
    <Icon {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a3.375 3.375 0 01-3.375-3.375V9.375c0-1.86 1.515-3.375 3.375-3.375h9c1.86 0 3.375 1.515 3.375 3.375v6c0 1.86-1.515 3.375-3.375 3.375zM12 14.25v5.25m-4.125-5.25v5.25m8.25-5.25v5.25M9 6.75V5.25a3 3 0 013-3 3 3 0 013 3v1.5" />
    </Icon>
);
export const LockClosed: React.FC<IconProps> = (props) => (
    <Icon {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </Icon>
);