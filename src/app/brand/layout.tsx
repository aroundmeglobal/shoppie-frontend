import "@/app/globals.css";
import Navbar from "@/component/marketing/Navbar";
import RedirectHandler from "@/component/RedirectHandler";
import { cn } from "@/lib/utils";

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata = {
  title: "AroundMe | Connect with People Nearby Instantly",
  description:
    "Discover new friends and connect with people in your area in real-time with the AroundMe app. Download now to start building local connections and sharing interests!",
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* <!-- Google tag (gtag.js) --> */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-0HF9D3DQTP"
        ></script>
        <script
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
        <Navbar/>
        {children}
      </body>
    </html>
  );
}
