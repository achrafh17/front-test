import {
  Stack,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ScheduleCard from "./ScheduleCard";
import { ISchedule } from "./Main";
type FilterBy =
  | "name"
  | "startDateAsc"
  | "startDateDesc"
  | "createdDateAsc"
  | "createdDateDesc";
type StatusFilterBy = "active" | "passed" | "daily";
interface Props {
  statusFilter: StatusFilterBy;
  filterBy: FilterBy;
  setFilterBy: (value: FilterBy) => void;
  handleInfoClick: (value: ISchedule) => void;
  onEdit: (value: ISchedule) => void;
  handleDeleteClick: (value: ISchedule) => void;
  page: number;
  setPage: (value: any) => void;
  totalPages: number;
  schedulesToShow: ISchedule[];
}

export default function ScheduleSection({
  statusFilter,
  filterBy,
  setFilterBy,
  handleInfoClick,
  onEdit,
  handleDeleteClick,
  page,
  setPage,
  totalPages,
  schedulesToShow,
}: Props) {
  return (
    <Stack spacing={2}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        {" "}
        <Typography
          variant="overline"
          sx={{
            letterSpacing: 1,
            color: "text.secondary",
          }}
        >
          {statusFilter.toUpperCase()} ({schedulesToShow.length})
        </Typography>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel shrink>Filtrer</InputLabel>
          {statusFilter === "active" && (
            <Select
              value={filterBy}
              label="Filter"
              onChange={(e) => setFilterBy(e.target.value as FilterBy)}
            >
              <MenuItem value="name">Nom</MenuItem>
              <MenuItem value="startDateAsc">Commence bientôt</MenuItem>
              <MenuItem value="startDateDesc">Commence le plus tard </MenuItem>
              <MenuItem value="createdDateAsc">
                Date d'ajout (plus ancien)
              </MenuItem>
              <MenuItem value="createdDateDesc">
                Date d'ajout (plus récent)
              </MenuItem>
            </Select>
          )}
          {statusFilter === "daily" && (
            <Select
              value={filterBy}
              label="Filter"
              onChange={(e) => setFilterBy(e.target.value as FilterBy)}
            >
              <MenuItem value="name">Nom</MenuItem>
              <MenuItem value="startDateAsc">
                Heure de début (plus tôt)
              </MenuItem>
              <MenuItem value="startDateDesc">
                Heure de début (plus tard)
              </MenuItem>
              <MenuItem value="createdDateAsc">
                Date d'ajout (plus ancien)
              </MenuItem>
              <MenuItem value="createdDateDesc">
                Date d'ajout (plus récent)
              </MenuItem>
            </Select>
          )}
          {statusFilter === "passed" && (
            <Select
              value={filterBy}
              label="Filter"
              onChange={(e) => setFilterBy(e.target.value as FilterBy)}
            >
              <MenuItem value="name">Nom</MenuItem>
              <MenuItem value="startDateDesc">Terminées récemment</MenuItem>
              <MenuItem value="startDateAsc">
                Terminées depuis longtemps
              </MenuItem>
            </Select>
          )}
        </FormControl>
      </Box>

      <Stack spacing={1.5}>
        {schedulesToShow.map((s) => (
          <ScheduleCard
            key={s.scheduleId}
            schedule={s}
            type={statusFilter}
            onInfo={handleInfoClick}
            onEdit={onEdit}
            onDelete={handleDeleteClick}
          />
        ))}
      </Stack>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 2,
          mt: 2,
          pt: 1,
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <IconButton
          size="small"
          disabled={page === 1}
          onClick={() => setPage((p: number) => p - 1)}
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
        <Typography variant="caption" color="text.secondary">
          Page {page} / {totalPages}
        </Typography>
        <IconButton
          size="small"
          disabled={page === totalPages}
          onClick={() => setPage((p: number) => p + 1)}
        >
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
      </Box>
    </Stack>
  );
}
