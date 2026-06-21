"use server";

import { cookies } from "next/headers";

export async function setLocale(locale: "tr" | "en") {
  (await cookies()).set("NEXT_LOCALE", locale, { path: "/" });
}
