import type { Metadata } from "next";
import { Newsreader } from "next/font/google";
import "./globals.css";
import Nav from "./components/Nav";
import StorageNotice from "./components/StorageNotice";

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--face-ln",
});

export const metadata: Metadata = {
  title: { default: "Study Log", template: "%s · Study Log" },
  description: "Log study sessions and keep your streak. Everything stays in your browser.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${newsreader.variable} h-full antialiased`}>
      <body className="min-h-full bg-ln-background font-ln text-lg text-ln-text">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:bg-ln-text focus:px-3 focus:py-2 focus:text-ln-background"
        >
          Skip to content
        </a>
        <header className="border-b border-ln-text">
          <div className="mx-auto flex w-full max-w-2xl flex-wrap items-baseline justify-between gap-x-6 gap-y-2 px-5 py-2">
            <p className="text-2xl font-light tracking-tight">Study Log</p>
            <Nav />
          </div>
        </header>
        <StorageNotice />
        <main id="main" tabIndex={-1} className="mx-auto w-full max-w-2xl px-5 py-4 focus:outline-none sm:py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
