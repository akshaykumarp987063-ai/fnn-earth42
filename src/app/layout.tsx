import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Outfit } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FNN · Earth-42",
  description: "Friendly Neighborhood Network — campus emergency web for Earth-42.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B0F19",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full mesh-grid text-foreground">
        <Providers>
          <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-midnight/80 shadow-[0_0_80px_rgba(226,54,54,0.08)] ring-1 ring-white/5">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
