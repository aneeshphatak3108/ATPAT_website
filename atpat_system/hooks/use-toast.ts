// /hooks/use-toast.ts
"use client"; // necessary for React hooks in Next.js app directory

import { useState } from "react";

type Toast = {
  id: number;
  title: string;
};

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  function toast({ title }: { title: string }) {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, title }]);
    // remove the toast after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }

  return { toast, toasts };
}
