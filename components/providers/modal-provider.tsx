"use client";
import { useEffect, useState } from "react";
import LoginCheckModal from "@/components/modals/login-check-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <LoginCheckModal />
    </>
  );
};
