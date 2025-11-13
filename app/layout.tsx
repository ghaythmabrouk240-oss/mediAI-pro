export const metadata = {
  title: 'MediAI Pro - Medical AI Assistant',
  description: 'Expert medical AI consultation platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
