import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'ReUse Campus — Sustainable Resource Stewardship',
  description:
    'A university-wide circular platform connecting departments and students with surplus equipment, electronics, books, and furnishings.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1C1B18] antialiased selection:bg-[#EAE4D9] selection:text-[#1C1B18]">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
