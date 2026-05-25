import './globals.css';

export const metadata = {
  title: 'Maniams — Wooden Puzzle Set | One Set. Infinite Possibilities.',
  description:
    'A premium handcrafted wooden puzzle set. 47 unique geometric pieces that assemble into over 100 buildable forms. Discover the art of endless creativity.',
  openGraph: {
    title: 'Maniams Wooden Puzzle — One Set. Infinite Possibilities.',
    description: 'Handcrafted wooden puzzle blocks. 47 pieces. Infinite forms.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
