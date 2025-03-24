import "@/app/globals.css";
import SideNavbar from "@/component/marketing/SideNavbar";
import RedirectHandler from "@/component/RedirectHandler";
import { cn } from "@/lib/utils";
import Script from "next/script";

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata = {
  title: "Shoppie",
  description:
    "Discover new friends and connect with people in your area in real-time with the AroundMe app. Download now to start building local connections and sharing interests!",
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* <!-- Google tag (gtag.js) --> */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-0HF9D3DQTP"
        />
        <Script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments)}
              gtag('js', new Date());
              gtag('config', 'G-0HF9D3DQTP');
              `,
          }}
        />
      </head>
      <body className={cn("min-h-screen bg-background antialiased ")}>
        <RedirectHandler />
        <SideNavbar />
        {children}
      </body>
    </html>
  );
}
