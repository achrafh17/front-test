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
import { ISchedule, ValidationState } from "../../types/api.types";
import { mergeDateAndTime, validateScheduleInput } from "./schedule.utilis";
import {
  buildSchedulePayload,
  createScheduleAPI,
  deleteScheduleAPI,
  validateScheduleAPI,
} from "./scheduleService";
import { useSchedules } from "./useSchedules";
import { usePlaylists } from "./usePlaylists";
import { useDevices } from "./useDevices";

export default function Main() {
  const { userInfo } = useAuth();

  const [openCreate, setOpenCreate] = useState(false);

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
  const { schedules, setSchedules, isLoading } = useSchedules(
    userInfo?.sessionId || "",
    filterBy,
    [openCreate, deleteTrigger],
  );
  const { playlists } = usePlaylists(userInfo?.sessionId || "");
  const { devices } = useDevices(userInfo?.sessionId || "");
  const { setRsbVariant } = useRSB();
  const [step, setStep] = useState(1);
  const [validationError, setValidationError] = useState<ValidationState>({
    type: "",
    message: "",
    code: "",
  });
  const [openValidateScheduleDialog, setOpenValidateScheduleDialog] =
    useState(false);
  const [addScheduleValidationError, setaddScheduleValidationError] =
    useState<ValidationState>({ type: "", message: "", code: "" });
  const [addScheduleValidationSuccess, setAddScheduleValidationSuccess] =
    useState<ValidationState>({ type: "", message: "", code: "" });
  const [addScheduleValidationWarning, setaddScheduleValidationWarning] =
    useState<ValidationState>({
      type: "",
      message: "",
      code: "",
    });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const startTimeInitialValue = new Date();
  startTimeInitialValue.setHours(8, 0, 0, 0);
  const endTimeInitialValue = new Date();
  endTimeInitialValue.setHours(18, 0, 0, 0);
  const [scheduleData, setScheduleData] = useState<ISchedule>({
    scheduleId: null,
    title: "",
    startDate: new Date(),
    startTime: startTimeInitialValue,
    endDate: new Date(),
    endTime: endTimeInitialValue,
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
    setValidationError((prev) => ({
      ...prev,
      type: "",
      code: "",
      message: "",
    }));
    setaddScheduleValidationError({
      type: "",
      code: "",
      message: "",
    });
  }, [step]);
  const onClose = () => {
    //  @ts-ignore
    setScheduleData((prev) => {
      return {
        ...prev,
        startDate: new Date(),
        endDate: new Date(),
        startTime: startTimeInitialValue,
        endTime: endTimeInitialValue,
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
    setStep(1);
  };

  //----------------------------------------------------------------
  // Validate Schedule
  //----------------------------------------------------------------

  const validateSchedule = async () => {
    setValidationError({ type: "", code: "", message: "" });
    setaddScheduleValidationWarning({ type: "", code: "", message: "" });

    const result = buildSchedulePayload(
      scheduleData,
      userInfo?.sessionId || "",
    );

    if (result.errorMessage) {
      setValidationError({ message: result.errorMessage });
      return;
    }
    console.log("PAYLOAD SENT:", result.data);
    try {
      const data = await validateScheduleAPI(result.data);

      if (!data.success) {
        setValidationError(data);
        return;
      }

      if (data.type === "WARNING") {
        setaddScheduleValidationWarning(data);
      }

      setStep(3);
      setOpenValidateScheduleDialog(true);
    } catch (error) {
      console.error("error from validate schedule", error);
      setValidationError({
        type: "ERROR",
        message: "Erreur serveur.",
      });
    }
  };
  //-----------------------------------------------------------------
  // Create Schedule
  //-----------------------------------------------------------------

  const addSchedule = async () => {
    setIsSubmitting(true);
    setaddScheduleValidationError({
      type: "",
      code: "",
      message: "",
    });
    setAddScheduleValidationSuccess({
      type: "",
      message: "",
      code: "",
    });
    const result = buildSchedulePayload(
      scheduleData,
      userInfo?.sessionId || "",
    );
    if (result.errorMessage) {
      setaddScheduleValidationError((prev) => ({
        ...prev,
        type: "ERROR",
        message: result.errorMessage,
      }));
      setIsSubmitting(false);
      return;
    }
    try {
      const data = await createScheduleAPI(result.data);
      console.log("data from adding schedule", data);
      if (!data.success) {
        setaddScheduleValidationError(data);
        return;
      }
      setAddScheduleValidationSuccess(data);
      setTimeout(() => {
        setAddScheduleValidationSuccess((prev) => ({
          ...prev,
          type: "",
          message: "",
          code: "",
        }));
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Add schedule error:", error);

      setaddScheduleValidationError({
        type: "ERROR",
        message: "Erreur serveur.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
  const deleteSchedule = async (id: number) => {
    try {
      setSchedules((prev) => prev.filter((s) => s.scheduleId !== id));
      const data = await deleteScheduleAPI(id, userInfo?.sessionId || "");
      console.log(data);
      setdeleteTrigger((prev) => !prev);
    } catch (error) {
      console.error("eror from delete schedule", error);
    }
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
        setValidationError={setValidationError}
        addScheduleValidationWarning={addScheduleValidationWarning}
        isSubmitting={isSubmitting}
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
