"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { state, loaded } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (loaded && !state.onboardingComplete) {
      router.replace("/");
    }
  }, [loaded, state.onboardingComplete, router]);

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!state.onboardingComplete || !state.profile) {
    return null;
  }

  return <>{children}</>;
}
