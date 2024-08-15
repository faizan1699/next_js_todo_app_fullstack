import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navigation/topbar/Page";

export const metadata = {
  title: "Todo App",
  description: "save and see your todos ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">

      <body >
        <Navbar />
        {children}
      </body>

    </html>
  );
}
