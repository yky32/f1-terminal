"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { GlobalOverviewPayload } from "@/lib/data/global-overview";
import { formatFetchError } from "@/lib/format-fetch-error";
import { apiRequest } from "@/lib/http/api-client";

type GlobalOverviewContextValue = {
  overview: GlobalOverviewPayload | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const GlobalOverviewContext = createContext<GlobalOverviewContextValue | null>(null);

export function GlobalOverviewProvider({ children }: { children: ReactNode }) {
  const [overview, setOverview] = useState<GlobalOverviewPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await apiRequest<GlobalOverviewPayload>({
        url: "/api/global/overview",
      });
      setOverview(data);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load overview";
      setError(formatFetchError(message));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({ overview, loading, error, refresh }),
    [overview, loading, error, refresh],
  );

  return (
    <GlobalOverviewContext.Provider value={value}>{children}</GlobalOverviewContext.Provider>
  );
}

export function useGlobalOverview() {
  const context = useContext(GlobalOverviewContext);
  if (!context) {
    throw new Error("useGlobalOverview must be used within GlobalOverviewProvider");
  }
  return context;
}
