import { useState, useEffect } from "react";
import { fetchSchedules } from "./scheduleService";
import { ISchedule, ValidationState } from "../../types/api.types";

export function useSchedules(
  sessionId: string,
  filterBy: string,
  step: "closed" | "info" | "timeline" | "review",
) {
  const [schedules, setSchedules] = useState<ISchedule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    if (step !== "closed") return;
    const load = async () => {
      setIsLoading(true);
      setError("");
      try {
        const data = await fetchSchedules(sessionId, filterBy);
        if (isMounted && data?.success) {
          setSchedules(data.result || []);
        }
      } catch (status) {
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
  }, [sessionId, filterBy, step]);

  return { schedules, isLoading, setSchedules, error, setError };
}
