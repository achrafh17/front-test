import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { IAdminUserInfo } from "../../types/admin.types";
import dayjs from "dayjs";
import Cell from "./Cell";
import {
  activateUser,
  changeUserMaxUploadSize,
  deactivateUser,
  deleteUser,
  formatBytes,
} from "../../utils/admin.utils";
import useStore from "../../store/store";
import UploadSizeCell from "./uploadSizeCell";

interface props {
  user: IAdminUserInfo;
  onOperationSuccess: () => void;
}

const SingleRow: React.FC<props> = ({
  user,
  onOperationSuccess
}) => {
  let id = `${user.userId}`,
    email = user.email,
    phone = user.phone ?? "",
    parentEmail = user.createdByEmail ?? "",
    activeLabel = user.isActive ? "Actif" : "Inactif",
    activationDate = user.activationDate
      ? dayjs(user.activationDate).format("DD-MM-YYYY, HH:mm")
      : "",
    numberOfDevices = `${user.numberOfDevices ?? 0}`,
    totalStorageSize = `${formatBytes(user.totalStorageSize ?? 0)}`;

  let rowValues = [
    id,
    email,
    phone,
    parentEmail,
    activeLabel,
    activationDate,
    numberOfDevices,
    totalStorageSize,
  ];

  const token = useStore((state) => state.token);

  const setUserToPerformActionOn = useStore(
    (state) => state.setUserToPerformActionOn
  );
  const setOnConfirm = useStore((state) => state.setOnConfirm);
  const setFailState = useStore((state) => state.setFailState);
  const setSuccessState = useStore((state) => state.setSuccessState);

  const handleActivationPress = () => {
    setUserToPerformActionOn(user.userId);
    setOnConfirm(() => {
      if (user.isActive) {
        deactivateUser(user.userId, token, {
          onSuccess: () => {
            onOperationSuccess();
            setUserToPerformActionOn(null);
            setSuccessState(true);
          },
          onFailure: () => {
            setFailState(true);
          },
        });
      } else {
        activateUser(user.userId, token, {
          onSuccess: () => {
            onOperationSuccess();
            setUserToPerformActionOn(null);
            setSuccessState(true);
          },
          onFailure: () => {
            setFailState(true);
          },
        });
      }
    });
  };

  const handleDeleteUserPress = () => {
    setUserToPerformActionOn(user.userId);
    setOnConfirm(() => {
      deleteUser(user.userId, token, {
        onSuccess: () => {
          onOperationSuccess();
          setUserToPerformActionOn(null);
          setSuccessState(true);
        },
        onFailure: () => {
          setFailState(true);
        },
      });
    });
  };

  const handleSaveNewUploadMaxSize = (newValue: number) => {
    changeUserMaxUploadSize(user.userId, token, newValue,  {
      onSuccess: () => {
        onOperationSuccess();
        setUserToPerformActionOn(null);
        setSuccessState(true);
      },
      onFailure: () => {
        setFailState(true);
      },
    });
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid #aaa",
        py: 1,
        minHeight: 66,
        width:"fit-content",
      }}
    >
      {rowValues.map((v, i) => (
        <Cell first={i === 0} key={i}>
          <Typography noWrap>{v}</Typography>
        </Cell>
      ))}
      <Cell>
        <UploadSizeCell
          value={user.maxUploadSize}
          onSave={handleSaveNewUploadMaxSize}
        />
      </Cell>
      <Cell>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1.2,
            width: "100%",
          }}
        >
          {user.createdBy === null && (
            <Button
              variant="contained"
              color="info"
              size="small"
              sx={{
                color: "white",
                py: 0.5,
                px: 2,
              }}
              onClick={() => {
                handleActivationPress();
              }}
            >
              {user.isActive ? "Désactiver" : "Activer"}
            </Button>
          )}
          <Button
            variant="contained"
            sx={{
              color: "white",
              py: 0.5,
              px: 1.75,
            }}
            onClick={handleDeleteUserPress}
          >
            Supprimer
          </Button>
        </Box>
      </Cell>
    </Box>
  );
};

export default SingleRow;
