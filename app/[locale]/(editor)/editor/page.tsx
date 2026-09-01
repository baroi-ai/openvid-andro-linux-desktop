import { locales } from "@/i18n";
import { setRequestLocale } from "next-intl/server";
import EditorClient from "./EditorClient";

export const dynamic = "force-static";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function EditorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <EditorClient />;
}