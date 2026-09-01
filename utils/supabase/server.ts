import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabaseUrl =
  !rawUrl || rawUrl === "x.y.z"
    ? "https://placeholder-project.supabase.co"
    : rawUrl.startsWith("http://") || rawUrl.startsWith("https://")
      ? rawUrl
      : `https://${rawUrl}`;

const supabaseKey =
  !rawKey || rawKey === "x.y.z"
    ? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy"
    : rawKey;

export const createClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
  
        }
      },
    },
  });
};
