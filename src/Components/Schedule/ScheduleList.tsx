import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { ISchedule } from "./Main";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import ScheduleInfoDialog from "./ScheduleInfoDialog";
import { Stack } from "@mui/material";
import { IDevice } from "../../types/api.types";

import ScheduleSections from "./ScheduleSections";

interface Props {
  isLoading: boolean;
  sliderValue: number;
  schedules: ISchedule[];
  searchTerm: string;
  onEdit: (schedule: ISchedule) => void;
  onDelete: (scheduleId: number) => void;
  devices?: IDevice[];
  statusFilter: StatusFilter;
  filterBy: FilterBy;
  setFilterBy: (value: FilterBy) => void;
}
type StatusFilter = "active" | "daily" | "passed";
type FilterBy =
  | "name"
  | "startDateAsc"
  | "startDateDesc"
  | "createdDateAsc"
  | "createdDateDesc";

const ScheduleList: React.FC<Props> = ({
  isLoading,
  schedules,
  searchTerm,
  statusFilter,
  onEdit,
  onDelete,
  devices = [],
  filterBy,
  setFilterBy,
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<ISchedule | null>(
    null,
  );
  const [showInfoSchedule, setShowInfoSchedule] = useState<ISchedule | null>(
    null,
  );

  const handleDeleteClick = (schedule: ISchedule) => {
    setSelectedSchedule(schedule);
    setShowConfirmDelete(true);
  };

  const handleInfoClick = (schedule: ISchedule) => {
    setShowInfoSchedule(schedule);
  };

  useEffect(() => {
    if (!showInfoSchedule) return;
    const timer = setTimeout(() => {
      setShowInfoSchedule(null);
    }, 16000);
    return () => {
      clearTimeout(timer);
    };
  }, [showInfoSchedule]);

  return (
    <Box
      sx={{
        maxWidth: 760,
        mx: "auto",
        mt: 5,
        px: 2,
      }}
    >
      <Stack spacing={5}>
        {isLoading && (
          <Stack spacing={2}>
            {[1, 2, 3].map((n) => (
              <Skeleton
                key={n}
                variant="rectangular"
                height={64}
                sx={{ borderRadius: 2 }}
              />
            ))}
          </Stack>
        )}

        <ScheduleSections
          searchTerm={searchTerm}
          schedules={schedules}
          filterBy={filterBy}
          setFilterBy={setFilterBy}
          statusFilter={statusFilter}
          isLoading={isLoading}
          handleInfoClick={handleInfoClick}
          handleDeleteClick={handleDeleteClick}
          onEdit={onEdit}
        />

        <ConfirmDeleteDialog
          open={showConfirmDelete && !!selectedSchedule}
          title={selectedSchedule?.title}
          onClose={() => {
            setShowConfirmDelete(false);
            setSelectedSchedule(null);
          }}
          onConfirm={() => {
            if (selectedSchedule) onDelete(selectedSchedule.scheduleId);
            setShowConfirmDelete(false);
            setSelectedSchedule(null);
          }}
        />
        <ScheduleInfoDialog
          open={!!showInfoSchedule}
          schedule={showInfoSchedule}
          devices={devices}
          onClose={() => {
            setShowInfoSchedule(null);
          }}
        />
      </Stack>
    </Box>
  );
};

export default ScheduleList;
