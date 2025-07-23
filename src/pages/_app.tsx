import "../styles/globals.css";
import { AppProps } from "next/app";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';

function MyApp({ Component, pageProps }: AppProps) {
  const session = useSession();

  useEffect(() => {
    if (session) {
      fetch('/api/user/sync', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
    }
  }, [session]);

  return <Component {...pageProps} />;
}


export default MyApp;

