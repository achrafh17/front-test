//@ts-ignore
import { ReactComponent as SearchSvg } from "../../assets/svg/search.svg";
import Button from "@mui/material/Button";
import AddContentDialog from "./AddContentDialog";
import React, { useCallback, useEffect, useState } from "react";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import "../../styles/Content.css";
import ContentContentList from "./ContentContentList";
import useSliderValue from "../../hooks/useSliderValue";
import useAuth from "../../hooks/useAuth";
import useRSB from "../../hooks/useRSB";
import { IContent } from "../../types/api.types";
import ContentDefaultRSB from "../RightSideBars/ContentDefaultRSB";
import DeleteContentDialog from "./DeleteContentDialog";
import useStore from "../../store/store";

export default function Main() {
  const { userInfo } = useAuth();

  const [contents, setContents] = useState<IContent[]>([]);

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedIdToDelete, setSelectedIdToDelete] = useState<number | null>(
    null
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    // fetch contents

    setIsLoading(true);
    fetch(`https://www.powersmartscreen.com/get-contents?sessionId=${userInfo?.sessionId}`)
      .then((res) => res.json())
      .then((resJson) => {
        setIsLoading(false);
        if (resJson.success) {
          setContents(resJson.result as IContent[]);
        } else {
          //handle error
        }
      })
      .catch((e) => {
        setIsLoading(false);
      });
  }, [userInfo?.sessionId]);

  const setErrorMsg = useStore(state => state.setErrorMsg)
  const [sliderMax, sliderValue, setSliderValue] = useSliderValue();
  const [searchTerm, setSearchTerm] = useState("");

  //better to recheck sliderValue > sliderMax on window resize

  const addContent = useCallback(() => {
    if (userInfo?.privileges.contents !== true) {
      setErrorMsg("Vous n'avez pas les droits nécessaires");
      return;
    }
    setOpen(true);
  }, [userInfo?.privileges.contents, setErrorMsg]);

  const handleContentDeletePress = (contentId: number) => {
    if(userInfo?.privileges.contents !== true) {
      setErrorMsg("Vous n'avez pas les droits nécessaires");
      return;
    }
    setSelectedIdToDelete(contentId);
    setIsDeleteDialogOpen(true);
  };

  const { setRsbVariant } = useRSB();
  useEffect(() => {
    setRsbVariant({
      name: "CONTENT_DEFAULT",
      renderComponent: () => <ContentDefaultRSB addContent={addContent} />,
    });
  }, [setRsbVariant, addContent]);

  return (
    <div className="main-screen">
      <div className="main-screen-top">
        <div className="search">
          <SearchSvg fill="none" stroke="#bec4c4" />
          <input
            type="text"
            placeholder="Rechercher"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
        </div>
        <CustomSlider
          sx={{ width: 100, color: "#bec4c4", mx: 1 }}
          step={1}
          min={1}
          max={sliderMax}
          size="small"
          value={sliderValue}
          onChange={(e) => {
            if (e.target) {
              //@ts-ignore
              setSliderValue(e.target.value);
            }
          }}
        />
        <Button variant="outlined" size="small" onClick={addContent}>
          Ajouter Contenu
        </Button>
      </div>
      <ContentContentList
        contents={contents}
        isLoading={isLoading}
        sliderValue={sliderValue}
        handleContentDeletePress={handleContentDeletePress}
        searchTerm={searchTerm}
      />
      <AddContentDialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        onSave={(newContents: IContent[]) => {
          setContents((old) => [...old, ...newContents]);
        }}
      />
      {selectedIdToDelete !== null && (
        <DeleteContentDialog
          contentId={selectedIdToDelete}
          open={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
          }}
          onDelete={(deletedId: number) => {
            setContents((old) => {
              const newContents = old.filter(
                (item) => item.contentId !== deletedId
              );
              return newContents;
            });
            setRsbVariant({
              name: "CONTENT_DEFAULT",
              renderComponent: () => <></>,
            });
          }}
        />
      )}
     
    </div>
  );
}

const CustomSlider = styled(Slider)({
  height: 3,
  "& .MuiSlider-track": {
    border: "none",
    height: 3,
  },
  "& .MuiSlider-thumb": {
    height: 16,
    width: 16,
    backgroundColor: "white",
    border: "2px solid currentColor",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "inherit",
    },
    "&:before": {
      display: "none",
    },
  },
});
