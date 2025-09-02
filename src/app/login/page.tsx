'use client';

import React from "react";
import { Header } from "@/components/Header";
import { useHeaderContext } from "@/contexts/headerContext";

export default function Login() {
  const { open, setOpen } = useHeaderContext();
  return (
    <div>
      <Header open={open} setOpen={setOpen} />
    </div>
  );
}
