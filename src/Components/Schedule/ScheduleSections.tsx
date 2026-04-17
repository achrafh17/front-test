import { Stack, Typography } from "@mui/material";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import { useState, useEffect, useMemo } from "react";
import ScheduleSection from "./ScheduleSection";
import { ISchedule } from "../../types/api.types";
type FilterBy =
  | "name"
  | "startDateAsc"
  | "startDateDesc"
  | "createdDateAsc"
  | "createdDateDesc";
type StatusFilterBy = "active" | "passed" | "daily";

interface Props {
  schedules: ISchedule[];
  searchTerm: string;
  filterBy: FilterBy;
  setFilterBy: (value: FilterBy) => void;
  statusFilter: StatusFilterBy;
  isLoading: boolean;
  handleInfoClick: (value: ISchedule) => void;
  onEdit: (value: ISchedule) => void;
  handleDeleteClick: (value: ISchedule) => void;
}

export default function ScheduleSections({
  searchTerm,
  schedules,
  filterBy,
  setFilterBy,
  statusFilter,
  isLoading,
  handleInfoClick,
  onEdit,
  handleDeleteClick,
}: Props) {
  const [pageActive, setPageActive] = useState(1);
  const [pageDaily, setPageDaily] = useState(1);
  const [pagePassed, setPagePassed] = useState(1);
  const { filteredSchedules, passedSchedules, dailySchedules } = useMemo(() => {
    const now = new Date();

    const lowerSearch = searchTerm.toLowerCase();

    const searched = schedules.filter((s) =>
      (s.title ?? "").toLowerCase().includes(lowerSearch),
    );

    const active = searched.filter(
      (s) => s.repeatType === "none" && s.endDate && new Date(s.endDate) >= now,
    );

    const passed = searched.filter(
      (s) => s.repeatType === "none" && s.endDate && new Date(s.endDate) < now,
    );

    let daily = searched.filter((s) => s.repeatType === "daily");
    if (filterBy === "startDateAsc" || filterBy === "startDateDesc")
      daily.sort((a, b) => {
        if (!a.startDate || !b.startDate) return 0;
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);
        const minutesA = dateA.getHours() * 60 + dateA.getMinutes();
        const minutesB = dateB.getHours() * 60 + dateB.getMinutes();
        return filterBy === "startDateAsc"
          ? minutesA - minutesB
          : minutesB - minutesA;
      });

    return {
      filteredSchedules: active,
      passedSchedules: passed,
      dailySchedules: daily,
    };
  }, [schedules, searchTerm, filterBy]);

  useEffect(() => {
    setFilterBy(statusFilter === "passed" ? "startDateDesc" : "startDateAsc");
  }, [statusFilter]);
  const ITEMS_PER_PAGE = 5;
  const totalActivePages = Math.max(
    1,
    Math.ceil(filteredSchedules.length / ITEMS_PER_PAGE),
  );

  const activeStart = (pageActive - 1) * ITEMS_PER_PAGE;
  const activeEnd = activeStart + ITEMS_PER_PAGE;

  const activeToShow = filteredSchedules.slice(activeStart, activeEnd);
  //----------passed pagination
  const totalPassedPages = Math.max(
    1,
    Math.ceil(passedSchedules.length / ITEMS_PER_PAGE),
  );
  const passedStart = (pagePassed - 1) * ITEMS_PER_PAGE;
  const passedEnd = passedStart + ITEMS_PER_PAGE;
  const passedToShow = passedSchedules.slice(passedStart, passedEnd);
  //--------------daily pagination-------------------
  const totalDailyPages = Math.max(
    1,
    Math.ceil(dailySchedules.length / ITEMS_PER_PAGE),
  );
  const dailyStart = (pageDaily - 1) * ITEMS_PER_PAGE;
  const dailyEnd = dailyStart + ITEMS_PER_PAGE;
  const dailyToShow = dailySchedules.slice(dailyStart, dailyEnd);

  //-------reset pages  -------------------
  useEffect(() => {
    setPageActive(1);
    setPageDaily(1);
    setPagePassed(1);
  }, [statusFilter, searchTerm, filterBy]);
  useEffect(() => {
    if (pageActive > totalActivePages) {
      setPageActive(totalActivePages);
    }
  }, [totalActivePages]);

  useEffect(() => {
    if (pageDaily > totalDailyPages) {
      setPageDaily(totalDailyPages);
    }
  }, [totalDailyPages]);

  useEffect(() => {
    if (pagePassed > totalPassedPages) {
      setPagePassed(totalPassedPages);
    }
  }, [totalPassedPages]);
  return (
    <>
      {statusFilter === "active" &&
      !isLoading &&
      filteredSchedules.length > 0 ? (
        <ScheduleSection
          statusFilter="active"
          filterBy={filterBy}
          setFilterBy={setFilterBy}
          handleInfoClick={handleInfoClick}
          handleDeleteClick={handleDeleteClick}
          onEdit={onEdit}
          page={pageActive}
          setPage={setPageActive}
          totalPages={totalActivePages}
          schedulesToShow={activeToShow}
        />
      ) : (
        !isLoading &&
        statusFilter === "active" && (
          <Stack
            alignItems="center"
            justifyContent="center"
            spacing={1}
            sx={{ py: 8 }}
          >
            <EventBusyIcon sx={{ fontSize: 28, color: "text.disabled" }} />
            <Typography variant="body2">Aucune planification active</Typography>
            <Typography variant="body2" color="text.secondary">
              Les planifications en cours apparaîtront ici.
            </Typography>
          </Stack>
        )
      )}

      {/* Daily */}
      {statusFilter === "daily" && !isLoading && dailySchedules.length > 0 ? (
        <ScheduleSection
          statusFilter="daily"
          filterBy={filterBy}
          setFilterBy={setFilterBy}
          handleInfoClick={handleInfoClick}
          handleDeleteClick={handleDeleteClick}
          onEdit={onEdit}
          page={pageDaily}
          setPage={setPageDaily}
          totalPages={totalDailyPages}
          schedulesToShow={dailyToShow}
        />
      ) : (
        !isLoading &&
        statusFilter === "daily" && (
          <Stack
            alignItems="center"
            justifyContent="center"
            spacing={1}
            sx={{ py: 8 }}
          >
            <EventBusyIcon sx={{ fontSize: 28, color: "text.disabled" }} />
            <Typography variant="body2">
              Aucune planification quotidienne
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Les planifications quotidiennes apparaîtront ici.
            </Typography>
          </Stack>
        )
      )}

      {/* Passed */}
      {statusFilter === "passed" && !isLoading && passedSchedules.length > 0 ? (
        <ScheduleSection
          statusFilter="passed"
          filterBy={filterBy}
          setFilterBy={setFilterBy}
          handleInfoClick={handleInfoClick}
          handleDeleteClick={handleDeleteClick}
          onEdit={onEdit}
          page={pagePassed}
          setPage={setPagePassed}
          totalPages={totalPassedPages}
          schedulesToShow={passedToShow}
        />
      ) : (
        !isLoading &&
        statusFilter === "passed" && (
          <Stack
            alignItems="center"
            justifyContent="center"
            spacing={1}
            sx={{ py: 8 }}
          >
            <EventBusyIcon sx={{ fontSize: 28, color: "text.disabled" }} />
            <Typography variant="body2">Aucune planification passée</Typography>
            <Typography variant="body2" color="text.secondary">
              Les planifications terminées apparaîtront ici.
            </Typography>
          </Stack>
        )
      )}
    </>
  );
}
