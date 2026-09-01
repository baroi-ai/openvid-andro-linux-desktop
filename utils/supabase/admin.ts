import { createClient } from "@supabase/supabase-js";

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const rawKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseUrl =
  !rawUrl || rawUrl === "x.y.z"
    ? "https://placeholder-project.supabase.co"
    : rawUrl.startsWith("http://") || rawUrl.startsWith("https://")
      ? rawUrl
      : `https://${rawUrl}`;

const serviceRoleKey =
  !rawKey || rawKey === "x.y.z"
    ? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy"
    : rawKey;

export const createAdminClient = () =>
  createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });