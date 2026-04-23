import { modalClasses } from "@mui/material";
import { ISchedule } from "../../types/api.types";
import { mergeDateAndTime, validateScheduleInput } from "./schedule.utilis";

const BASE_URL = "http://localhost:8000";
type ApiResponse<T> = {
  success: boolean;
  result: T;
  message?: string;
  type?: string;
};
export const buildSchedulePayload = (
  schedule: ISchedule,
  sessionId: string,
  mode: string,
  isFromPlaylist: boolean,
) => {
  const repeatType= schedule.repeatType==="none"?"none":"daily"
  const errorMessage = validateScheduleInput({
    startDate: schedule.startDate,
    endDate: schedule.endDate,
    startTime: schedule.startTime,
    endTime: schedule.endTime,
    devices: schedule.devices,
    repeatType: repeatType,
    title: schedule.title,
    isFromPlaylist: isFromPlaylist,
  });

  if (errorMessage) {
    return { errorMessage: errorMessage };
  }

  const start = mergeDateAndTime(
    schedule.startDate,
    schedule.startTime,
    repeatType,
  );

  const end = mergeDateAndTime(
    schedule.endDate,
    schedule.endTime,
    repeatType,
  );

  if (!start || !end) {
    return { errorMessage: "Dates invalides" };
  }

  return {
    data: {
      title: schedule.title,
      playlistId: schedule.playlist.playlistId,
      deviceIdsRaw: schedule.devices.map((dev) => dev.deviceId),
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      priority: 1,
      repeatType: schedule.repeatType,
      isActive: true,
      sessionId: sessionId,
      modalClasses,
      mode: mode,
      scheduleId: schedule.scheduleId,
    },
  };
};
export async function fetchSchedules(
  sessionId: string,
  filterBy: string,
): Promise<ApiResponse<ISchedule[]>> {
  if (!sessionId || !filterBy) {
    throw new Error("Missing required fields");
  }
  const res = await fetch(
    `${BASE_URL}/get-schedules?sessionId=${sessionId}&filterBy=${filterBy}`,
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Erreur serveur");
  }

  return result;
}

export async function createScheduleAPI(data: any) {
  const res = await fetch(`${BASE_URL}/add-schedule`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok && !result) {
    throw new Error("Erreur serveur critique");
  }
  return result;
}

export async function validateScheduleAPI(data: any) {
  const res = await fetch(`${BASE_URL}/validate-schedule`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  let result;
  result = await res.json();

  // if (!res.ok && !result) {
  //   throw new Error("Erreur serveur critique");
  // }

  return result;
}
export async function updateScheduleAPI(data: any) {
  const res = await fetch(`${BASE_URL}/update-schedule`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Erreur serveur");
  }

  return result;
}
export async function deleteScheduleAPI(id: number, sessionId: string) {
  if (!sessionId) {
    throw new Error("Missing sessionId");
  }
  const res = await fetch(
    `${BASE_URL}/delete-schedule?sessionId=${sessionId}`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scheduleId: id }),
    },
  );
  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || `HTTP error ${res.status}`);
  }

  return result;
}
