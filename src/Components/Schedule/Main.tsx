// Main.tsx
// @ts-ignore
import { ReactComponent as SearchSvg } from "../../assets/svg/search.svg";
import Button from "@mui/material/Button";
import { useCallback, useEffect, useState } from "react";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
// import "../../styles/Content.css";
import ScheduleList from "./ScheduleList";
import ScheduleDefaultRSB from "../RightSideBars/ScheduleDefaultRSB";
import useSliderValue from "../../hooks/useSliderValue";
import useAuth from "../../hooks/useAuth";
import useRSB from "../../hooks/useRSB";
import useStore from "../../store/store";
// @ts-ignore
import CreateScheduleDialog from "./CreateScheduleDialog";
import { Grid } from "@mui/material";
import { Select, MenuItem, FormControl } from "@mui/material";
import { IContent, IDevice, IPlaylist } from "../../types/api.types";
import { mergeDateAndTime, validateScheduleInput } from "./schedule.utilis";
interface IPlaylistWithContenets extends IPlaylist {
  contents: IContent[];
}
export interface ISchedule {
  scheduleId: number | null;
  title: string;
  startDate?: string;
  startTime: string;
  endTime: string;
  endDate?: string;
  devices?: IDevice[];
  repeatType: string;
  playlist: IPlaylistWithContenets;
}

export default function Main() {
  const { userInfo } = useAuth();
  const today = new Date();
  const [schedules, setSchedules] = useState<ISchedule[]>([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [playlists, setplaylists] = useState([]);
  const [devices, setDevices] = useState<IDevice[]>([]);

  const setErrorMsg = useStore((state) => state.setErrorMsg);
  const [sliderMax, sliderValue, setSliderValue] = useSliderValue();
  const [searchTerm, setSearchTerm] = useState("");
  //a variable to refresh the schedules list after deleted schedule
  const [deleteTrigger, setdeleteTrigger] = useState(false);
  const [statusFilter, setStatusFilter] = useState<
    "active" | "daily" | "passed"
  >("active");
  const [filterBy, setFilterBy] = useState<
    | "name"
    | "startDateAsc"
    | "startDateDesc"
    | "createdDateAsc"
    | "createdDateDesc"
  >("startDateAsc");

  const { setRsbVariant } = useRSB();
  const [step, setStep] = useState(1);
  const [validationError, setValidationError] = useState({});
  const [openValidateScheduleDialog, setOpenValidateScheduleDialog] =
    useState(false);
  const [addScheduleValidationError, setaddScheduleValidationError] = useState(
    {},
  );
  const [addScheduleValidationSuccess, setAddScheduleValidationSuccess] =
    useState({});
  const [scheduleData, setScheduleData] = useState<ISchedule>({
    scheduleId: null,
    title: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
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
  useEffect(() => {
    setValidationError({});
    setaddScheduleValidationError({});
  }, [step]);
  const onClose = () => {
    //  @ts-ignore
    setScheduleData((prev) => {
      const s = new Date();
      s.setHours(8, 0, 0, 0);
      const e = new Date();
      e.setHours(18, 0, 0, 0);
      return {
        ...prev,
        startDate: today,
        endDate: today,
        startTime: s,
        endTime: e,
        repeatType: "none",
        devices: [],
        title: "",
        playlist: {
          contents: [],
          playlistId: 0,
          name: "",
          totalDuration: null,
          numberOfScreens: null,
          numberOfWidgets: null,
          userId: 0,
        },
      };
    });
    setOpenCreate(false);
    setStep(0);
  };
  //----------------------------------------------------------------
  // Validate Schedule
  //----------------------------------------------------------------
 
  const validateSchedule = () => {
    setValidationError({});
    setAddScheduleValidationSuccess({})
    const errorMessage = validateScheduleInput({
      startDate: scheduleData.startDate,
      endDate: scheduleData.endDate,
      startTime: scheduleData.startTime,
      endTime: scheduleData.endTime,
      devices: scheduleData.devices,
      repeatType: scheduleData.repeatType,
    });
    if (errorMessage) {
      setValidationError((prev) => ({ ...prev, message: errorMessage }));
      setTimeout(() => {
        setValidationError({});
      }, 3000);
      return;
    }

    fetch("http://localhost:8000/validate-schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: scheduleData.title,
        playlistId: scheduleData.playlist.playlistId,
        deviceIdsRaw: scheduleData.devices?.map((dev) => dev.deviceId),
        startDate: mergeDateAndTime(
          scheduleData.startDate,
          scheduleData.startTime,
          scheduleData.repeatType,
        ).toISOString(),
        endDate: mergeDateAndTime(
          scheduleData.endDate,
          scheduleData.endTime,
          scheduleData.repeatType,
        ).toISOString(),
        priority: 1,
        repeatType: scheduleData.repeatType,
        isActive: true,
        sessionId: userInfo?.sessionId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          setValidationError(data);
          setTimeout(() => {
            setValidationError({});
          }, 3000);
          return;
        }
        if (data.type === "WARNING") {
          setAddScheduleValidationSuccess(data);
        }

        setStep(3);
        setOpenValidateScheduleDialog(true);
      })
      .catch(() => {
        setValidationError((prev) => ({ ...prev, message: "Erreur serveur." }));
      });
  };
  //-----------------------------------------------------------------
  // Create Schedule
  //-----------------------------------------------------------------

  const addSchedule = () => {
    setaddScheduleValidationError({});
    const errorMessage = validateScheduleInput({
      startDate: scheduleData.startDate,
      endDate: scheduleData.endDate,
      startTime: scheduleData.startTime,
      endTime: scheduleData.endTime,
      devices: scheduleData.devices,
      repeatType: scheduleData.repeatType,
    });
    if (errorMessage) {
      setaddScheduleValidationError((prev) => ({
        ...prev,
        message: errorMessage,
      }));
      setTimeout(() => {
        setaddScheduleValidationError({});
      }, 3000);
      return;
    }
    fetch("http://localhost:8000/add-schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: scheduleData.title,
        playlistId: scheduleData.playlist.playlistId,
        deviceIdsRaw: scheduleData.devices?.map((dev) => dev.deviceId),
        startDate: mergeDateAndTime(
          scheduleData.startDate,
          scheduleData.startTime,
          scheduleData.repeatType,
        ).toISOString(),
        endDate: mergeDateAndTime(
          scheduleData.endDate,
          scheduleData.endTime,
          scheduleData.repeatType,
        ).toISOString(),
        priority: 1,
        repeatType: scheduleData.repeatType,
        isActive: true,
        sessionId: userInfo?.sessionId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("data from adding schedule", data);
        if (!data.success) {
          setaddScheduleValidationError(data);
          return;
        }
        setAddScheduleValidationSuccess(data);
        setTimeout(() => {
          setAddScheduleValidationSuccess({});
          onClose();
        }, 5000);
      })
      .catch(() => {
        setaddScheduleValidationError((prev) => ({
          ...prev,
          message: "Erreur serveur.",
        }));
      });
  };


  //-----------------------------------------------------------------------
  // get Schedules
  //-----------------------------------------------------------------------
  useEffect(() => {
    if (!userInfo?.sessionId) return;
    setIsLoading(true);
    fetch(
      `http://localhost:8000/get-schedules?sessionId=${userInfo.sessionId}&filterBy=${filterBy}`,
    )
      .then((res) => res.json())
      .then((json) => {
        setIsLoading(false);
        if (json.success) setSchedules(json.result);
      })
      .catch(() => setIsLoading(false));
  }, [userInfo?.sessionId, openCreate, deleteTrigger, filterBy]);
  //----------------------get Schedules------------------------------------
  useEffect(() => {
    fetch(
      `https://www.powersmartscreen.com/get-playlists?sessionId=${userInfo?.sessionId}`,
    )
      .then((res) => res.json())
      .then((data) => {
        setplaylists(data.result);
        console.log(data);
      });
  }, []);
  //------------------------get Devices--------------------------------------
  useEffect(() => {
    fetch(
      `https://www.powersmartscreen.com/get-devices?sessionId=${userInfo?.sessionId}`,
    )
      .then((res) => res.json())
      .then((data) => {
        setDevices(data.result);

        console.log("get devices", data);
      });
  }, []);

  //-----------------------------------------------------------------------
  // Ajouter un nouveau
  //-----------------------------------------------------------------------
  const showAddScheduleDialog = useCallback(() => {
    if (!userInfo?.privileges.contents)
      return setErrorMsg("Vous n'avez pas les droits nécessaires");
    setStep(1);
    setOpenCreate(true);
  }, [userInfo?.privileges.contents, setErrorMsg]);

  //-----------------------------------------------------------------------
  // Modifier un existant
  //-----------------------------------------------------------------------
  const editExistingSchedule = (schedule: ISchedule) => {
    setOpenCreate(true);
  };

  //-----------------------------------------------------------------------
  // Suppression local front
  //-----------------------------------------------------------------------
  const deleteSchedule = (id: number) => {
    setSchedules((prev) => prev.filter((s) => s.scheduleId !== id));
    fetch(
      `http://localhost:8000/delete-schedule?sessionId=${userInfo?.sessionId}`,
      {
        method: "DELETE",
        headers: { "content-Type": "application/json" },
        body: JSON.stringify({ scheduleId: id }),
      },
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setdeleteTrigger((prev) => !prev);
      });
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
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <Select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "active" | "daily" | "passed")
            }
          >
            <MenuItem value="active">Actives</MenuItem>
            <MenuItem value="daily">Quotidiennes</MenuItem>
            <MenuItem value="passed">Terminées</MenuItem>
          </Select>
        </FormControl>
        <CustomSlider
          sx={{ width: 100, mx: 1 }}
          min={1}
          max={sliderMax}
          value={sliderValue}
          onChange={(e, value) =>
            typeof value === "number" && setSliderValue(value)
          }
        />

        <Button
          variant="contained"
          size="small"
          onClick={showAddScheduleDialog}
        >
          Nouveau Schedule
        </Button>
      </div>

      <Grid
        sx={{
          ml: 0,
          overflowY: "scroll",
          maxHeight: "calc(100vh - 80px -  (24px * 2) - 32px)",
        }}
        className="hide-scrollbar"
      >
        <ScheduleList
          schedules={schedules}
          isLoading={isLoading}
          sliderValue={sliderValue}
          searchTerm={searchTerm}
          onEdit={editExistingSchedule}
          onDelete={deleteSchedule}
          devices={devices}
          statusFilter={statusFilter}
          filterBy={filterBy}
          setFilterBy={(value: string) => {
            const validValues = [
              "name",
              "startDateAsc",
              "startDateDesc",
              "createdDateAsc",
              "createdDateDesc",
            ] as const;
            if (validValues.includes(value as any)) {
              setFilterBy(value as (typeof validValues)[number]);
            }
          }}
        />
      </Grid>

      {/* Modal création / modification */}
      <CreateScheduleDialog
        playlists={playlists}
        devices={devices}
        open={openCreate}
        onClose={onClose}
        scheduleData={scheduleData}
        setScheduleData={setScheduleData}
        onAdd={addSchedule}
        onValidate={validateSchedule}
        step={step}
        setStep={setStep}
        validationError={validationError}
        openValidateScheduleDialog={openValidateScheduleDialog}
        addScheduleValidationError={addScheduleValidationError}
        addScheduleValidationSuccess={addScheduleValidationSuccess}
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
