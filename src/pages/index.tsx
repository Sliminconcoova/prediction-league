import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from '@/lib/supabaseClient'
//import { supabaseClient } from "@/lib/supabaseClient";
import { useSession } from "@supabase/auth-helpers-react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

export default function Home() {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session) {
      router.push("/fixtures2");
    }
  }, [session]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
      {!session && (
        <div className="w-full max-w-md mx-auto p-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20">
          <h1 className="text-white text-3xl font-bold mb-6 text-center">Welcome to Prediction League</h1>
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme="dark"
            providers={["github", "google"]}
          />
        </div>
      )}
    </div>
  );
}
