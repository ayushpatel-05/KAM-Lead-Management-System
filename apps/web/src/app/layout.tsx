"use client";
import "./globals.css";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Provider } from 'react-redux';
import { store } from "../redux/configureStore";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
      <Provider store={store}>
        <AntdRegistry>
        {children}
        </AntdRegistry>
      </Provider>
      </body>
    </html>
  );
}
