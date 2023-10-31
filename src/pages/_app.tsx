import '@/styles/tailwind.css';
import '@sweetalert2/theme-dark';
import '@/styles/sweetalert2.css';
import type { AppProps } from 'next/app';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { ConfigProvider, theme } from 'antd';
import esESAnt from 'antd/lib/locale/es_ES';
import { esES } from '@mui/material/locale';

const { darkAlgorithm } = theme;

const NEXT_PUBLIC_GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

const defaultTheme = createTheme(
  {
    palette: {
      mode: 'dark', // Activa el modo oscuro
    },
  },
  esES
);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={defaultTheme}>
      <ConfigProvider locale={esESAnt} theme={{ algorithm: darkAlgorithm }}>
        <GoogleOAuthProvider clientId={NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ''}>
          <LocalizationProvider dateAdapter={AdapterMoment} dateFormats={{ fullDate: 'DD-MM-YYY' }}>
            <Component {...pageProps} />
          </LocalizationProvider>
        </GoogleOAuthProvider>
      </ConfigProvider>
    </ThemeProvider>
  );
}
