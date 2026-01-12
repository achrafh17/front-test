import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { IUserSingle, userPrivilegesStripped } from "../../types/api.types";
import UserTile from "./UserTile";
import useRSB from "../../hooks/useRSB";
import Grid from "@mui/material/Grid";
//@ts-ignore
import { ReactComponent as AddSvg } from "../../assets/svg/add-active.svg";
import UserSettingsRSB from "../RightSideBars/UserSettingsRSB";
import DeleteUserDialog from "./DeleteUserDialog";

interface props {
  searchTerm: string;
  users: IUserSingle[];
  removeUser: (userId: number) => void;
  onAddUserPress: () => void;
  updatePrivileges: (userIdx: number, newPrivileges: userPrivilegesStripped) => void;
}

const UsersList: React.FC<props> = ({
  searchTerm,
  users,
  removeUser,
  updatePrivileges,
  onAddUserPress,
}) => {
  const { setRsbVariant } = useRSB();

  const [rsbUserId, setRsbUserId] = useState<number | null>(null);
  const [selectedUserIdToDelete, setSelectedUserIdToDelete] = useState<
    number | null
  >(null);

  const handleDeleteUserPress = (userIdx: number) => {
    setSelectedUserIdToDelete(users[userIdx].userId);
  };



  const onUserTileClick = (userIdx: number) => {
    setRsbUserId(users[userIdx].userId);
    setRsbVariant({
      name: "USER_SETTINGS",
      renderComponent: () => (
        <UserSettingsRSB
          user={users[userIdx]}
          onDeleteUserPress={() => {
            handleDeleteUserPress(userIdx);
          }}
          updatePrivileges={(newPrivileges)=>{
            updatePrivileges(userIdx, newPrivileges)
          }}
        />
      ),
    });
  };

  return (
    <>
      <Box
        sx={{
          p: 3,
          height: "calc(100vh - 60px - 80px - 36px)",
          maxHeight: "calc(100vh - 60px - 80 px - 36px)",
          overflowY: "scroll",
        }}
        className="hide-scrollbar"
      >
        <Typography sx={{ mb: 2 }}>Utilisateurs</Typography>
        <Grid container spacing={2}>
          {users
            .map((user, idx) =>
              user.email.includes(searchTerm) ||
              (user.userName !== null && user.userName.includes(searchTerm)) ? (
                <UserTile
                  user={user}
                  highlighted={rsbUserId === user.userId}
                  key={idx}
                  onTileClick={() => {
                    onUserTileClick(idx);
                  }}
                />
              ) : undefined
            )
            .filter((c) => Boolean(c))}
          <Grid item sm={4} lg={3} xl={2} onClick={onAddUserPress}>
            <Box
              sx={{
                height: 230,
                border: "2px solid #e3e3e3",
                borderRadius: "6px",
                px: 2,
                py: 4,
                // mr: 1,
                // mb: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: ".3s all ease",
                "&:hover": {
                  boxShadow: "0 9px 18px rgb(132 137 138 / 30%)",
                },
              }}
            >
              <AddSvg style={{ maxWidth: 70 }} />
            </Box>
          </Grid>
        </Grid>
      </Box>
      {selectedUserIdToDelete !== null && (
        <DeleteUserDialog
          userId={selectedUserIdToDelete}
          open={selectedUserIdToDelete !== null}
          onClose={() => {
            setSelectedUserIdToDelete(null);
          }}
          onSuccess={() => {
            removeUser(selectedUserIdToDelete);
          }}
        />
      )}
    </>
  );
};

export default UsersList;
