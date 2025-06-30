
import Header from "@/components/header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function WebLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await auth.api.getSession({
    headers: await headers()
})
  return (
    <>
    <Header user={session?.user || null} />
    {children}
  </>
  );
}
