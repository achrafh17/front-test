import { useState, useEffect } from "react";
import { fetchSchedules } from "./scheduleService";
import {  ISchedule } from "../../types/api.types";


export function useSchedules(
  sessionId: string ,
  filterBy: string,
  deps: any[] = [],
) {
  const [schedules, setSchedules] = useState<ISchedule[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!sessionId) return;

    const load = async () => {
      setIsLoading(true);

      try {
        const data = await fetchSchedules(sessionId, filterBy);
        if (data.success) setSchedules(data.result);
      } catch (error) {
        console.error("useSchedules error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [sessionId, filterBy, ...deps]);

  return { schedules, isLoading, setSchedules };
}
