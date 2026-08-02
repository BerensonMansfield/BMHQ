import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { AccountForm } from "@/components/account-form";
import { createAccount } from "../actions";

export default async function NewAccountPage() {
  const supabase = await createClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .order("full_name");

  return (
    <>
      <PageHeader title="New account" description="Add a client company." />
      <div className="max-w-2xl px-8 pb-16">
        <AccountForm
          profiles={profiles ?? []}
          action={createAccount}
          submitLabel="Create account"
        />
      </div>
    </>
  );
}
