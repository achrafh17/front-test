import React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
//@ts-ignore
import { ReactComponent as AddSvg } from "../../assets/svg/add-active.svg";
//@ts-ignore
import { ReactComponent as FilterSvg } from "../../assets/svg/filter.svg";
import Device from "./Device";
import MoreHorizontalFilters from "../MoreHorizontalFilters";
import { IDevice } from "../../types/api.types";


interface props {
  openAddScreenModal: () => void;
  isLoading: boolean;
  devices: IDevice[];
  setSelectedIdToDelete: (deviceId: number) => void;
  searchTerm: string;
}

const DevicesList: React.FC<props> = ({
  openAddScreenModal,
  isLoading,
  devices,
  setSelectedIdToDelete,
  searchTerm
}) => {

  return (
    <Box sx={{ padding: 3 }}>
      <Grid
        container
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        columnSpacing={1}
      >
        <Grid item sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1" component="h1">
            Écrans
            {/* <Typography
              variant="body2"
              component="span"
              sx={{ marginLeft: 1, color: "#ccc" }}
            >
              {!isLoading && `${devices.length} sur ${devices.length}`}
            </Typography> */}
          </Typography>
        </Grid>
        <Grid item>
          <FilterSvg
            style={{ width: "24px", height: "24px" }}
            className="hover-dark stroke"
          />
        </Grid>
        <MoreHorizontalFilters />
      </Grid>
      <Grid container flexDirection="row" spacing={2} sx={{ mt: 1 }}>
        {isLoading ? (
          <>
            <Grid item sm={4} lg={3} xl={2}>
              <Skeleton
                animation="wave"
                variant="rectangular"
                width="100%"
                height={70}
                sx={{ borderRadius: 1 }}
              />
            </Grid>
            <Grid item sm={4} lg={3} xl={2}>
              <Skeleton
                animation="wave"
                variant="rectangular"
                width="100%"
                height={70}
                sx={{ borderRadius: 1 }}
              />
            </Grid>
          </>
        ) : (
          devices.map((deviceInfo, idx) => {
            if(!deviceInfo.name.toLowerCase().includes(searchTerm.toLowerCase())){
              return <div key={idx}></div>
            }
            return (
              <Device
                deviceInfo={deviceInfo}
                key={idx}
                onDeletePress={() => {
                  setSelectedIdToDelete(deviceInfo.deviceId);
                }}
              />
            );
          })
        )}

        <Grid item sm={4} lg={3} xl={2}>
          <div
            className="add-entity"
            onClick={openAddScreenModal}
            title="ajouter un écran"
          >
            <AddSvg color="#aaa" />
          </div>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DevicesList;