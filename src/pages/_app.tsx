import "../styles/globals.css";
import { AppProps } from "next/app";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-4">
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
}

export default MyApp;

