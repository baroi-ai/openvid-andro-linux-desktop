import { createBrowserClient } from "@supabase/ssr";

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

export const createClient = () => {
  if (typeof window === "undefined") {
    return createBrowserClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {},
      },
    });
  }
  return createBrowserClient(supabaseUrl, supabaseKey);
};
