import { useEffect, useState } from "react";

import { ValidationState, ISchedule } from "../../types/api.types";
import {
  buildSchedulePayload,
  validateScheduleAPI,
  createScheduleAPI,
  updateScheduleAPI,
} from "./scheduleService";

export function useScheduleForm(sessionId: string) {
  const [mode, setMode] = useState<"edit" | "create">("create");

  const [step, setStep] = useState(1);
  const [validationFeedBack, setValidationFeedBack] = useState<ValidationState>(
    {
      type: "",
      message: "",
      code: "",
    },
  );

  // feedBack hook for API add-schedule /edit -schedule
  const [feedBackFinal, setFeedBackFinal] = useState<ValidationState>({
    type: "",
    message: "",
    code: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const createStartTime = () => {
    const d = new Date();
    d.setHours(8, 0, 0, 0);
    return d;
  };

  const createEndTime = () => {
    const d = new Date();
    d.setHours(18, 0, 0, 0);
    return d;
  };
  const [scheduleData, setScheduleData] = useState<ISchedule>({
    scheduleId: null,
    title: "",
    startDate: new Date(),
    startTime: createStartTime(),
    endDate: new Date(),
    endTime: createEndTime(),
    repeatType: "none",
    playlist: {
      contents: [],
      playlistId: 0,
      name: "",
      totalDuration: null,
      numberOfScreens: null,
      numberOfWidgets: null,
      userId: 0,
    },
    devices: [],
  });
  const SUCCESS_DELAY = 1500;
  const resetForm = () => {
    setScheduleData({
      title: "",
      playlist: {
        playlistId: 0,
        name: "",
        contents: [],
        totalDuration: null,
        numberOfScreens: null,
        numberOfWidgets: null,
        userId: 0,
      },
      devices: [],
      startDate: new Date(),
      endDate: new Date(),
      startTime: createStartTime(),
      endTime: createEndTime(),
      repeatType: "none",
      scheduleId: null,
    });
    setStep(1);
    setMode("create");
    resetFeedback();
  };
  useEffect(() => {
    if (step === 2 && validationFeedBack.type === "ERROR") {
      setValidationFeedBack({ type: "", message: "", code: "" });
    }
    if (step == 3 && feedBackFinal.type === "ERROR") {
      setFeedBackFinal({ type: "", message: "", code: "" });
    }
  }, [step]);

  //----------------------------------------------------------------
  // Validate Schedule
  //----------------------------------------------------------------

  const validateSchedule = async () => {
    resetFeedback();
    if (!sessionId) return;
    const result = buildSchedulePayload(scheduleData, sessionId);

    if (result.errorMessage) {
      setValidationFeedBack({
        type: "ERROR",
        message: result.errorMessage,
        code: "",
      });
      return;
    }
    try {
      const data = await validateScheduleAPI(result.data);
      if (!data.success) {
        setValidationFeedBack(data);
        return;
      }
      if (data.type === "WARNING") {
        setValidationFeedBack(data);
      }
      setStep(3);
    } catch (error) {
      console.error("error from validate schedule", error);
      setValidationFeedBack({
        type: "ERROR",
        message: "Erreur serveur.",
        code: "",
      });
    }
  };

  //---------------------------------------------
  // create/update schedule
  //---------------------------------------------
  const handleSubmit = async (onClose?: () => void) => {
    setIsSubmitting(true);
    const result = buildSchedulePayload(scheduleData, sessionId);
    if (result.errorMessage) {
      setFeedBackFinal({
        code: "",
        type: "ERROR",
        message: result.errorMessage,
      });
      setIsSubmitting(false);
      return;
    }
    try {
      const data =
        mode === "create"
          ? await createScheduleAPI(result.data)
          : await updateScheduleAPI(result.data);
      console.log("data from adding schedule", data);
      if (!data.success) {
        setFeedBackFinal(data);
        return;
      }
      setFeedBackFinal(data);
      setTimeout(() => {
        resetFeedback();
        onClose?.();
        console.log("hello");
      }, SUCCESS_DELAY);
    } catch (error) {
      console.error("Add schedule error:", error);

      setFeedBackFinal({
        type: "ERROR",
        message: "Erreur serveur.",
        code: "",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  //---------------------------------------------
  //load schedule for edit
  //-----------------------------------------------
  const loadScheduleForEdit = (schedule: ISchedule) => {
    setMode("edit");
    setStep(1);
    //in update we need to pass through content
    const playlist = {
      //@ts-ignore
      contents: schedule.playlist.contents.map((c) => c.content),
      playlistId: schedule.playlist.playlistId,
      name: schedule.playlist.name,
      totalDuration: schedule.playlist.totalDuration,
      numberOfScreens: schedule.playlist.numberOfScreens,
      numberOfWidgets: schedule.playlist.numberOfWidgets,
      userId: schedule.playlist.userId,
    };

    setScheduleData({
      ...schedule,
      //@ts-ignore
      //in update we need to pass through device
      devices: schedule.devices.map((d) => d.device),
      playlist: playlist,
      startDate: new Date(schedule.startDate),
      endDate: new Date(schedule.endDate),
      startTime: new Date(schedule.startDate),
      endTime: new Date(schedule.endDate),
    });
    resetFeedback();
  };

  const resetFeedback = () => {
    setValidationFeedBack({ type: "", message: "", code: "" });
    setFeedBackFinal({ type: "", message: "", code: "" });
  };
  return {
    scheduleData,
    setScheduleData,
    step,
    setStep,
    mode,
    setMode,
    validationFeedBack,
    setValidationFeedBack,
    feedBackFinal,
    isSubmitting,
    validateSchedule,
    handleSubmit,
    loadScheduleForEdit,
    resetForm,
  };
}
