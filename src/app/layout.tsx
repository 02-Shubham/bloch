import type { Metadata } from "next";
import { Provider } from "@/components/ui/provider";
import { AppContextProvider } from "@/state/app-context";
import { Toaster } from "@/components/ui/toaster";
import { Noto_Sans_Math } from "next/font/google";
import "katex/dist/katex.min.css";

const notoSansMath = Noto_Sans_Math({
  subsets: ["math"],
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Bloch sphere simulator",
  description: "This is a bloch sphere simulator for an uni project",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className={notoSansMath.className}>
        <Provider>
          <Toaster />
          <AppContextProvider>{children}</AppContextProvider>
        </Provider>
      </body>
    </html>
  );
}
