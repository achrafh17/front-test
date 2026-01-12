// Main.tsx
// @ts-ignore
import { ReactComponent as SearchSvg } from "../../assets/svg/search.svg";
import Button from "@mui/material/Button";
import React, { useCallback, useEffect, useState } from "react";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import "../../styles/Content.css";
import ScheduleList from "./ScheduleList";
import ScheduleDefaultRSB from "../RightSideBars/ScheduleDefaultRSB";
import useSliderValue from "../../hooks/useSliderValue";
import useAuth from "../../hooks/useAuth";
import useRSB from "../../hooks/useRSB";
import useStore from "../../store/store";
// @ts-ignore
import CreateScheduleDialog from "./CreateScheduleDialog";

export interface ISchedule {
  scheduleId: number;
  title: string;
  startDate?: string;
  endDate?: string;
  screens?: any[];
}

export default function Main() {
  const { userInfo } = useAuth();
  const [schedules, setSchedules] = useState<ISchedule[]>([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [editSchedule, setEditSchedule] = useState<ISchedule | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [schedule, setSchedule] = useState<ISchedule>();

  const setErrorMsg = useStore((state) => state.setErrorMsg);
  const [sliderMax, sliderValue, setSliderValue] = useSliderValue();
  const [searchTerm, setSearchTerm] = useState("");

  const { setRsbVariant } = useRSB();

  //-----------------------------------------------------------------------
  // Charger les schedules
  //-----------------------------------------------------------------------
  useEffect(() => {
    if (!userInfo?.sessionId) return;
    setIsLoading(true);
    fetch(`http://localhost:8000/get-schedules?sessionId=${userInfo.sessionId}`)
      .then((res) => res.json())
      .then((json) => {
        setIsLoading(false);
        if (json.success) setSchedules(json.result);
      })
      .catch(() => setIsLoading(false));
  }, [userInfo?.sessionId]);

  //-----------------------------------------------------------------------
  // Ajouter un nouveau
  //-----------------------------------------------------------------------
  const addSchedule = useCallback(() => {
    if (!userInfo?.privileges.contents)
      return setErrorMsg("Vous n'avez pas les droits nécessaires");
    setEditSchedule(null);
    setOpenCreate(true);
  }, [userInfo?.privileges.contents, setErrorMsg]);

  //-----------------------------------------------------------------------
  // Modifier un existant
  //-----------------------------------------------------------------------
  const editExistingSchedule = (schedule: ISchedule) => {
    setEditSchedule(schedule);
    setOpenCreate(true);
  };

  //-----------------------------------------------------------------------
  // Suppression local front
  //-----------------------------------------------------------------------
  const deleteSchedule = (id: number) => {
    setSchedules((prev) => prev.filter((s) => s.scheduleId !== id));
  };

  //-----------------------------------------------------------------------
  // Sidebar par défaut (fix)
  //-----------------------------------------------------------------------
  useEffect(() => {
    setRsbVariant({
      name: "SCHEDULE_DEFAULT" as any,
      renderComponent: () => <ScheduleDefaultRSB />,
    });
  }, []);

  //-----------------------------------------------------------------------
  return (
    <div className="main-screen">
      {/* Barre du haut */}
      <div className="main-screen-top">
        <div className="search">
          <SearchSvg stroke="#bcbcbc" fill="none" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <CustomSlider
          sx={{ width: 100, mx: 1 }}
          min={1}
          max={sliderMax}
          value={sliderValue}
          onChange={(e, value) =>
            typeof value === "number" && setSliderValue(value)
          }
        />

        <Button variant="contained" size="small" onClick={addSchedule}>
          Nouveau Schedule
        </Button>
      </div>

      {/* Liste schedulers */}
      <ScheduleList
        schedules={schedules}
        isLoading={isLoading}
        sliderValue={sliderValue}
        searchTerm={searchTerm}
        onEdit={editExistingSchedule}
        onDelete={deleteSchedule}
      />

      {/* Modal création / modification */}
      <CreateScheduleDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        editSchedule={editSchedule}
        onSave={(schedule: ISchedule) => {
          console.log("here is the schedule", schedule);
          setSchedule(schedule);
          if (editSchedule) {
            // 🟢 correction mise à jour
            setSchedules((prev) =>
              prev.map((s) =>
                s.scheduleId === editSchedule.scheduleId
                  ? { ...schedule, id: editSchedule.scheduleId }
                  : s
              )
            );
          } else {
            setSchedules((prev) => [
              ...prev,
              { ...schedule, scheduleId: Date.now() },
            ]);
          }
          setEditSchedule(null);
        }}
      />
    </div>
  );
}

// Style Slider (ancien simple gris)
const CustomSlider = styled(Slider)({
  height: 3,
  "& .MuiSlider-thumb": {
    width: 14,
    height: 14,
    background: "#fff",
    border: "2px solid #888",
  },
});
