import "./globals.css";
import { AntdRegistry } from '@ant-design/nextjs-registry';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
      <AntdRegistry>
      {children}
      </AntdRegistry>
      </body>
    </html>
  );
}
