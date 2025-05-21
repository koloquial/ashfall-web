import Navbar from '@/components/Navbar';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/hooks/useAuth';
import { MusicPlayerProvider } from '@/contexts/MusicPlayerContext';
import DetachablePlayer from '@/components/DetachablePlayer';
import "@/styles/index.css";
import MusicModal from '@/components/MusicModal';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Ashfall',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=IM+Fell+English&family=Meddon&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <MusicPlayerProvider>
          <ThemeProvider>
            <AuthProvider>
              <Navbar />
              {children}
              <MusicModal />
              <DetachablePlayer />
              <Footer />
            </AuthProvider>
          </ThemeProvider>
        </MusicPlayerProvider>
      </body>
    </html>
  );
}
