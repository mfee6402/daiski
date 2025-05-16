// context套用第3步: 在最外(上)層包裹提供者元件
// 建立P(Providers)到C(Consumer)的階層關係
import Providers from './providers';
import '@/styles/globals.css';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { ThemeProvider } from '@/components/theme-provider';

export const metadata = {
  title: 'DAISKI',
  description: 'SKI!',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <Header></Header>
            {children}
            <Footer></Footer>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
