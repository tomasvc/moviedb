import React, { useState, useEffect } from "react";
import { Header } from "../../components/Header";
import { useHeaderContext } from "../../contexts/headerContext";

export const Login = () => {
  const { open, setOpen } = useHeaderContext();
  return (
    <div>
      <Header open={open} setOpen={setOpen} />
    </div>
  );
};
