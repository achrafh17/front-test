import { useState, useEffect } from "react";
import { IDevice } from "../../types/api.types";

export function useDevices(sessionId: string) {
  const [devices, setDevices] = useState<IDevice[]>([]);
  useEffect(() => {
    if (!sessionId) return;
    const load = async () => {
      try {
        const res = await fetch(
          `https://www.powersmartscreen.com/get-devices?sessionId=${sessionId}`,
        );
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || `HTTP error ${res.status}`);
        }
        setDevices(data.result);

        console.log("get devices", data);
      } catch (error) {
        console.error("from get devices", error);
      }
    };
    load();
  }, [sessionId]);

  return { devices };
}
