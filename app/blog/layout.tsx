import { Plus_Jakarta_Sans } from 'next/font/google'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-display',
  display: 'swap',
})

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <div className={jakarta.variable}>{children}</div>
}
