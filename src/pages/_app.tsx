import '@/styles/tailwind.css';
import '@sweetalert2/theme-dark';
import '@/styles/sweetalert2.css';
import type { AppProps } from 'next/app';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { GoogleOAuthProvider } from '@react-oauth/google';

const NEXT_PUBLIC_GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

const defaultTheme = createTheme({
  palette: {
    mode: 'dark', // Activa el modo oscuro
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={defaultTheme}>
      <GoogleOAuthProvider clientId={NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ''}>
        <Component {...pageProps} />
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
}
