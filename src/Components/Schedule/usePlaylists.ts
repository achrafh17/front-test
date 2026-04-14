import { useState, useEffect } from "react";
import { IPlaylist } from "../../types/api.types";

export function usePlaylists(sessionId: string) {
  const [playlists, setPlaylists] = useState<IPlaylist[]>([]);
  useEffect(() => {
    if (!sessionId) return;
    const load = async () => {
      try {
        const res = await fetch(
          `https://www.powersmartscreen.com/get-playlists?sessionId=${sessionId}`,
        );
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const data = await res.json();
        setPlaylists(data.result);
        console.log(data);
      } catch (error) {
        console.error("from get playlists", error);
      }
    };
    load();
  }, [sessionId]);
  return {playlists}
}
