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
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const data = await res.json();
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
