import type { Metadata } from "next";
import { Provider } from "@/components/ui/provider";
import { AppContextProvider } from "@/state/app-context";
import { Toaster } from "@/components/ui/toaster";

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
      <body>
        <Provider>
          <Toaster />
          <AppContextProvider>{children}</AppContextProvider>
        </Provider>
      </body>
    </html>
  );
}
