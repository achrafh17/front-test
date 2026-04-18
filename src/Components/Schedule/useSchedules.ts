import { useState, useEffect } from "react";
import { fetchSchedules } from "./scheduleService";
import { ISchedule } from "../../types/api.types";

export function useSchedules(
  sessionId: string,
  filterBy: string,
  openCreate: boolean,
) {
  const [schedules, setSchedules] = useState<ISchedule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchSchedules(sessionId, filterBy);
        if (isMounted && data?.success) {
          setSchedules(data.result || []);
        }
      } catch (error) {
        if (isMounted) {
          setError("Erreur Serveur");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [sessionId, filterBy, openCreate]);

  return { schedules, isLoading, setSchedules, error };
}
