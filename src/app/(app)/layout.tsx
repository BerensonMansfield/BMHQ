import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      <Sidebar userEmail={user.email ?? ""} />
      <main className="min-w-0 flex-1 md:h-dvh md:overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
