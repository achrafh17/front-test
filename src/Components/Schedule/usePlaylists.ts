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
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || `HTTP error ${res.status}`);
        }
        setPlaylists(data.result);
        console.log(data);
      } catch (error) {
        console.error("from get playlists", error);
      }
    };
    load();
  }, [sessionId]);
  return { playlists };
}
