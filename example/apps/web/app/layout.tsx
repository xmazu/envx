import '@example/ui/globals.css';

export const metadata = {
  title: 'example',
  description: 'Built with OpenEnvx',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
