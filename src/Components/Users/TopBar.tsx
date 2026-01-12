import React from "react"
import Button from "@mui/material/Button"
//@ts-ignore
import { ReactComponent as SearchSvg } from "../../assets/svg/search.svg";

interface props {
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    onAddUserPress : () => void
}

const TopBar :  React.FC<props> = ({searchTerm, setSearchTerm, onAddUserPress}) => {
    return (
      <div className="main-screen-top">
        <div className="search">
          <SearchSvg fill="none" stroke="#bec4c4" />
          <input
            type="text"
            placeholder="Commencez à taper pour chercher des utilisateurs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Button
          variant="outlined"
          color="primary"
          onClick={onAddUserPress}
          sx={{ px: 2}}
        >
          Ajouter un utilisateur
        </Button>
      </div>
    );
}

export default TopBar;