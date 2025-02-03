import React, { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";

export default function Providers({ children }: { children: ReactNode }) {
  return <ClerkProvider>{children}</ClerkProvider>;
}
