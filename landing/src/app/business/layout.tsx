// ./app/layout.tsx
"use client"
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import "../../index.css"; // Make sure this path points to your global CSS
import tailwindcss from "@tailwindcss/vite";
export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body>
        <StrictMode>
            {children}
        </StrictMode>
        </body>
        </html>
    );
}