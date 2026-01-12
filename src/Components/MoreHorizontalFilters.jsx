import { useState } from "react";
import Grid from "@mui/material/Grid";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

export default function MoreHorizontalFilters(props) {
  // handle opening/closing menu on hover on moreHorizIcon
  const [anchorElement, setAnchorElement] = useState(null);
  const open = Boolean(anchorElement);
  const handleOpenMenu = (event) => {
    setAnchorElement(event.target);
  };
  const handleCloseMenu = () => {
    setAnchorElement(null);
  };

  return (
    <>
      <Grid item id="test" onClick={handleOpenMenu}>
        <MoreHorizIcon
          fontSize="medium"
          sx={{ color: "#ccc" }}
          className="hover-dark fill"
        />
      </Grid>
      <Menu
        anchorEl={anchorElement}
        open={open}
        onClose={handleCloseMenu}
        dense
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}  
      >
        <MenuItem onClick={handleCloseMenu} sx={{ py: 0.4, px: 1 }}>
          Du plus récent
        </MenuItem>
        <MenuItem onClick={handleCloseMenu} sx={{ py: 0.4, px: 1 }}>
          Du moins récent
        </MenuItem>
        <MenuItem onClick={handleCloseMenu} sx={{ py: 0.4, px: 1 }}>
          A — z
        </MenuItem>
        <MenuItem onClick={handleCloseMenu} sx={{ py: 0.4, px: 1 }}>
          z — A
        </MenuItem>
        <MenuItem onClick={handleCloseMenu} sx={{ py: 0.4, px: 1 }}>
          Sélectionner tout
        </MenuItem>
      </Menu>
    </>
  );
}
