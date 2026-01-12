import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
// @ts-ignore
import { ReactComponent as UpDownArrowSVG } from "../../assets/svg/up-down-arrow.svg";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import useStore from "../../store/store";
import { IAdminUserInfo, isActiveFilterType } from "../../types/admin.types";
import { sort, HEADS } from "../../utils/admin.utils";
import Rows from "./Rows";
import CircularProgress from "@mui/material/CircularProgress";

const UsersTable: React.FC<{}> = () => {
  const [isActiveFilter, setIsActiveFilter] =
    useState<isActiveFilterType>("all");

  const token = useStore((state) => state.token);
  const [data, setData] = useState<IAdminUserInfo[]>([]);
  const [filteredData, setFilteredData] = useState<IAdminUserInfo[]>([]);
  const [sortedData, setSortedData] = useState<IAdminUserInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = (token: string) => {
    setIsLoading(true)
    fetch(`https://www.powersmartscreen.com/admin-get-users?token=${token}`)
      .then((res) => res.json())
      .then((resJson) => {
        setIsLoading(false);
        if (resJson.success) {
          // give created users the same isActive, activationDate, Nombre d'écrans, Stockage utilisé, limite d'upload que leurs admin
          setData(
            (resJson.result as IAdminUserInfo[]).map((user) => ({
              ...user,
              maxUploadSize: parseInt(`${user.maxUploadSize}`),
            }))
          );
        }
      })
      .catch((e) => console.log(e));
  }

  useEffect(() => {
    fetchData(token)
  }, [token]);

  useEffect(() => {
    if (data.length !== 0) {
      if (isActiveFilter === "all") {
        setFilteredData(data);
      } else if (isActiveFilter === "active") {
        setFilteredData(data.filter((u) => u.isActive === true));
      } else {
        setFilteredData(data.filter((u) => u.isActive === false));
      }
    }
  }, [isActiveFilter, data]);

  const [sorting, setSorting] = useState<[string, "asc" | "desc"]>([
    "id",
    "asc",
  ]);

  useEffect(() => {
    setSortedData(sort(filteredData, sorting[0], sorting[1]));
  }, [sorting, filteredData]);

  const onOperationSuccess = () => {
    fetchData(token);
  }

  return (
    <Box
      sx={{
        mt: 3,
        px: 2,
        pt: 2,
        height: "calc(100vh - 100px - 24px)",
        maxHeight: "calc(100vh - 100px - 24px)",
        overflowY: "scroll",
        width: "100%",
      }}
    >
      {isLoading ? <Box sx={{ width: "100%", p: 1, display: "flex", alignItems: "center", "justifyContent": "center" }}>
        <CircularProgress />
      </Box> : <>
        <Box
          sx={{
            backgroundColor: "#e6ebf0",
            display: "flex",
            alignItems: "center",
            borderTopLeftRadius: 7,
            borderTopRightRadius: 7,
            color: "#575b5c",
            width: "fit-content"
          }}
        >
          {HEADS.map(({ id, label, sortable }, idx) => {
            return (
              <Box
                key={idx}
                sx={{
                  p: 2,
                  // flex: 1,
                  minWidth: idx === 0 ? 80 : 250,
                  flex: idx === 0 ? undefined : 1,
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    cursor: sortable ? "pointer" : undefined,
                    display: "flex",
                    alignItems: "center",
                    width: "fit-content",
                    color: "#5F5F64",
                    gap: 1.25,
                  }}
                  onClick={() => {
                    setSorting((oldSorting) => {
                      if (oldSorting[0] === id) {
                        if (oldSorting[1] === "asc") {
                          return [id, "desc"];
                        }
                        return [id, "asc"];
                      }
                      return [id, "asc"];
                    });
                  }}
                >
                  {id === "isActive" ? (
                    <Select
                      value={isActiveFilter}
                      onChange={(e) => {
                        setIsActiveFilter(e.target.value as isActiveFilterType);
                      }}
                      variant="standard"
                      sx={{ px: 1, bottom: 3 }}
                    >
                      <MenuItem value="all">
                        <Typography
                          sx={{
                            fontWeight: isActiveFilter === "all" ? "bold" : "400",
                            color: "#5F5F64",
                          }}
                        >
                          Actif/Inactif
                        </Typography>
                      </MenuItem>
                      <MenuItem value="active">
                        <Typography
                          sx={{
                            fontWeight:
                              isActiveFilter === "active" ? "bold" : "400",
                            color: "#5F5F64",
                          }}
                        >
                          Actif
                        </Typography>
                      </MenuItem>
                      <MenuItem value="inactive">
                        <Typography
                          sx={{
                            fontWeight:
                              isActiveFilter === "inactive" ? "bold" : "400",
                            color: "#5F5F64",
                          }}
                        >
                          Inactif
                        </Typography>
                      </MenuItem>
                    </Select>
                  ) : (
                    <>
                      <Typography sx={{ fontWeight: "bold" }}>{label}</Typography>
                      {sortable ? (
                        sorting[0] === id ? (
                          sorting[1] === "asc" ? (
                            <ArrowDropUpIcon
                              style={{
                                color: "#5F5F64",
                                margin: 0,
                              }}
                            />
                          ) : (
                            <ArrowDropDownIcon
                              style={{
                                color: "#5F5F64",
                                margin: 0,
                              }}
                            />
                          )
                        ) : (
                          <Box sx={{ display: "flex", alignItems: "center", pl: .5 }}>
                            <UpDownArrowSVG fill="#5F5F64" width={14} />
                          </Box>
                        )
                      ) : (
                        <></>
                      )}
                    </>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
        <Rows data={sortedData} onOperationSuccess={onOperationSuccess} />
      </>}
    </Box>
  );
};

export default UsersTable;
