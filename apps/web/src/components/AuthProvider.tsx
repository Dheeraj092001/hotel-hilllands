import { ReactNode } from "react";
import { useAuthStore } from "../stores/authStore";
import PageLoader from "./ui/PageLoader";

export function AuthProvider({ children }: { children: ReactNode }) {
  const isInitialized = useAuthStore((s) => s.isInitialized);

  if (!isInitialized) return <PageLoader />;

  return <>{children}</>;
}
