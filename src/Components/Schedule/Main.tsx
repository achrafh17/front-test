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

import { Grid, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Select, MenuItem, FormControl } from "@mui/material";
import { ISchedule } from "../../types/api.types";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";
import ScheduleDialog from "./ScheduleDialog";
import { useSchedules } from "./useSchedules";
import { usePlaylists } from "./usePlaylists";
import { useDevices } from "./useDevices";
import { useScheduleForm } from "./useScheduleForm";
import { SnackBar } from "./snackBar";

export default function Main() {
  const { userInfo } = useAuth();
  const [openCreate, setOpenCreate] = useState(false);
  const setErrorMsg = useStore((state) => state.setErrorMsg);
  const [sliderMax, sliderValue, setSliderValue] = useSliderValue();
  const [searchTerm, setSearchTerm] = useState("");
  //a variable to refresh the schedules list after deleted schedule
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
  const { schedules, setSchedules, isLoading, error } = useSchedules(
    userInfo?.sessionId || "",
    filterBy,
    openCreate,
  );
  const { playlists } = usePlaylists(userInfo?.sessionId || "");
  const { devices } = useDevices(userInfo?.sessionId || "");
  const { setRsbVariant } = useRSB();
  const {
    scheduleData,
    setScheduleData,
    step,
    setStep,
    mode,
    setMode,
    validationFeedBack,
    setValidationFeedBack,
    submissionFeedback,
    setSubmissionFeedback,
    isSubmitting,
    validateSchedule,
    handleSubmit,
    deleteSchedule,
    loadScheduleForEdit,
    resetForm,
    showConfirmDelete,
    setShowConfirmDelete,
  } = useScheduleForm(userInfo?.sessionId || "");

  //-----------------------------------------------------------------------
  // launch create schedule
  //-----------------------------------------------------------------------
  const showAddScheduleDialog = useCallback(() => {
    resetForm();
    setMode("create");
    if (!userInfo?.privileges.contents)
      return setErrorMsg("Vous n'avez pas les droits nécessaires");
    setOpenCreate(true);
  }, [userInfo?.privileges.contents, setErrorMsg]);

  //-----------------------------------------------------------------------
  // launch edit schedule
  //-----------------------------------------------------------------------
  const editExistingSchedule = async (schedule: ISchedule) => {
    resetForm();
    loadScheduleForEdit(schedule);
    setOpenCreate(true);
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
      <Collapse in={Boolean(error)}>
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          action={
            <IconButton size="small" onClick={() => window.location.reload()}>
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          {error}
        </Alert>
      </Collapse>
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
          setShowConfirmDelete={setShowConfirmDelete}
          showConfirmDelete={showConfirmDelete}
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
      <SnackBar
        open={submissionFeedback.message !== ""}
        onClose={() =>
          setSubmissionFeedback({ type: "", message: "", code: "" })
        }
        message={submissionFeedback.message || ""}
        type={submissionFeedback.type === "SUCCESS" ? "success" : "error"}
      />
      {/* Modal create / Edit */}
      <ScheduleDialog
        playlists={playlists}
        mode={mode}
        devices={devices}
        open={openCreate && step === 1}
        openCreate={openCreate}
        onClose={() => {
          setOpenCreate(false);
          resetForm();
        }}
        scheduleData={scheduleData}
        setScheduleData={setScheduleData}
        onSubmit={() =>
          handleSubmit(() => {
            setOpenCreate(false);
          })
        }
        onValidate={validateSchedule}
        step={step}
        setStep={setStep}
        validationFeedBack={validationFeedBack}
        submissionFeedback={submissionFeedback}
        setValidationFeedBack={setValidationFeedBack}
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
