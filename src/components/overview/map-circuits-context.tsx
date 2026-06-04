"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { LiveCircuitsBothResponse } from "@/lib/data/live-circuit-activity";
import { formatFetchError } from "@/lib/format-fetch-error";
import { readCachedMapSnapshot, writeCachedMapSnapshot } from "@/lib/f1/local-map-cache";
import { CLIENT_MAP_REFRESH_MS, MAP_LOCAL_TTL_MS } from "@/lib/f1/refresh-policy";
import { apiRequest } from "@/lib/http/api-client";
import { usePageVisible } from "@/lib/use-page-visible";

type MapCircuitsContextValue = {
  data: LiveCircuitsBothResponse | null;
  loading: boolean;
  error: string | null;
  refresh: (options?: { silent?: boolean }) => Promise<void>;
};

const MapCircuitsContext = createContext<MapCircuitsContextValue | null>(null);

export function MapCircuitsProvider({ children }: { children: ReactNode }) {
  const pageVisible = usePageVisible();
  const [data, setData] = useState<LiveCircuitsBothResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (options?: { silent?: boolean }) => {
    const silent = options?.silent ?? false;
    const cached = readCachedMapSnapshot();
    const cachedFresh = cached ? Date.now() - cached.cachedAt < MAP_LOCAL_TTL_MS : false;

    if (cached && !silent) {
      setData(cached.snapshot);
      setLoading(false);
      setError(null);
    }

    if (cachedFresh) return;

    try {
      if (!silent && !cached) setLoading(true);

      const { data: response } = await apiRequest<LiveCircuitsBothResponse>({
        url: "/api/map/live-circuits",
        query: { mode: "both" },
      });

      if (response.error) {
        throw new Error(formatFetchError(response.error));
      }

      setData(response);
      writeCachedMapSnapshot(response);
      setError(null);
    } catch (err) {
      if (!silent && !cached) {
        const message = err instanceof Error ? err.message : "Failed to load circuits";
        setError(formatFetchError(message));
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!pageVisible) return;

    const interval = setInterval(() => void refresh({ silent: true }), CLIENT_MAP_REFRESH_MS);
    return () => clearInterval(interval);
  }, [pageVisible, refresh]);

  const wasHiddenRef = useRef(false);
  useEffect(() => {
    if (!pageVisible) {
      wasHiddenRef.current = true;
      return;
    }

    if (wasHiddenRef.current) {
      wasHiddenRef.current = false;
      void refresh({ silent: true });
    }
  }, [pageVisible, refresh]);

  const value = useMemo(
    () => ({ data, loading, error, refresh }),
    [data, loading, error, refresh],
  );

  return <MapCircuitsContext.Provider value={value}>{children}</MapCircuitsContext.Provider>;
}

export function useMapCircuits() {
  const context = useContext(MapCircuitsContext);
  if (!context) {
    throw new Error("useMapCircuits must be used within MapCircuitsProvider");
  }
  return context;
}
