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
) => {
  const errorMessage = validateScheduleInput({
    startDate: schedule.startDate,
    endDate: schedule.endDate,
    startTime: schedule.startTime,
    endTime: schedule.endTime,
    devices: schedule.devices,
    repeatType: schedule.repeatType,
  });

  if (errorMessage) {
    return { errorMessage: errorMessage };
  }

  const start = mergeDateAndTime(
    schedule.startDate,
    schedule.startTime,
    schedule.repeatType,
  );

  const end = mergeDateAndTime(
    schedule.endDate,
    schedule.endTime,
    schedule.repeatType,
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
      sessionId:sessionId,
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

  if (!res.ok) throw new Error("Failed to fetch schedules");

  return res.json();
}

export async function createScheduleAPI(data: any) {
  const res = await fetch(`${BASE_URL}/add-schedule`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to create schedule");

  return res.json();
}

export async function validateScheduleAPI(data: any) {
  const res = await fetch(`${BASE_URL}/validate-schedule`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to validate schedule");

  return res.json();
}
export async function deleteScheduleAPI(id: number, sessionId: string) {
  if (!sessionId) {
    throw new Error("Missing sessionId");
  }
  const res = await fetch(
    `${BASE_URL}/delete-schedule?sessionId=${sessionId}`,
    {
      method: "DELETE",
      headers: { "content-Type": "application/json" },
      body: JSON.stringify({ scheduleId: id }),
    },
  );
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);
  return res.json();
}
