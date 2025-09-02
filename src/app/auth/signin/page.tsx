'use client';

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Header } from "@/components/Header";

export default function SignIn() {
  const [open, setOpen] = useState<boolean | null>();

  return (
    <div>
      <Header open={open ?? false} setOpen={setOpen} />
      <div className="pt-20 w-full md:w-2/3 mx-4 md:mx-auto">
        <h1 className="text-3xl mb-4">Sign In</h1>
        <button
          className="border border-gray-400 px-4 py-1 rounded hover:bg-gray-800 hover:text-white transition"
          onClick={() => signIn("auth0", { callbackUrl: "/account" })}
        >
          Sign in with Auth0
        </button>
      </div>
    </div>
  );
}
