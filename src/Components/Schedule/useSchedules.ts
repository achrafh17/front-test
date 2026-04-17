import { useState, useEffect } from "react";
import { fetchSchedules } from "./scheduleService";
import { ISchedule } from "../../types/api.types";

export function useSchedules(
  sessionId: string,
  filterBy: string,
  deps: any[] = [],
) {
  const [schedules, setSchedules] = useState<ISchedule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchSchedules(sessionId, filterBy);
        if (data?.success) {
          setSchedules(data.result || []);
        }
      } catch (error: any) {
        console.error("useSchedules error:", error);
        setError("Erreur Serveur");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [sessionId, filterBy, ...deps]);

  return { schedules, isLoading, setSchedules, error };
}
