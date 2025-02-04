"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider>{children}</ClerkProvider>
    </QueryClientProvider>
  );
}
