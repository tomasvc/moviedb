'use client';

import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Header } from "@/components/Header";
import { SettingsPanel } from "@/components/Account/SettingsPanel";

export default function Account() {
  const { status, data } = useSession();

  const [open, setOpen] = useState<boolean | null>(false);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!data) {
    return (
      <div>
        <h1>Please sign in</h1>
        <button onClick={() => signIn("auth0")}>Sign in with Auth0</button>
      </div>
    );
  }

  return (
    <div className="bg-slate-50">
      <Header open={open ?? false} setOpen={setOpen} />
      <div className="flex gap-10 pt-20 px-4 md:px-0 w-full md:w-2/3 mx-auto">
        <SettingsPanel />
        <div>
          <h1 className="text-xl font-bold mb-4">Edit Profile</h1>
          <div>
            <img
              className="w-20 h-20 rounded-full"
              src={data?.user?.image ?? ""}
              alt={data?.user?.name ?? ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
