// types/global.d.ts
interface Window {
  gtag?: (...args: any[]) => void;
  dataLayer?: unknown[];
}


// types/styled-jsx.d.ts
declare module 'styled-jsx' {
  export interface StyleProps {
    jsx?: boolean;
    global?: boolean;
    children?: string;
  }

  export const Style: React.FC<StyleProps>;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      style: React.DetailedHTMLProps<React.StyleHTMLAttributes<HTMLStyleElement>, HTMLStyleElement> & {
        jsx?: boolean;
        global?: boolean;
      };
    }
  }
}