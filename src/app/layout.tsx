import type { Metadata } from "next";
import "../styles/index.css"; // We'll move or import the global CSS here

export const metadata: Metadata = {
  title: "Pera Slam 2026",
  description: "University of Peradeniya Tennis Championship",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="antialiased">
      <head>
        {/* You can add any custom external fonts here if needed */}
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
