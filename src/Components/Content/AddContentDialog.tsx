import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from '@mui/icons-material/Cancel';
import React, { useState, useEffect } from "react";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { Alert, Divider, Typography } from "@mui/material";
import useAuth from "../../hooks/useAuth";
import { IContent } from "../../types/api.types";
import {formatBits} from "../../utils/admin.utils"

interface props {
  open: boolean, 
  onClose: () => void,
  onSave: (newContents: IContent[]) => void
}

const AddContentDialog : React.FC<props> = ({ open, onClose, onSave })  => {
  const { userInfo } = useAuth();
  let maxUploadSize = parseInt(userInfo?.admin?.maxUploadSize ?? userInfo?.maxUploadSize ?? "800000000")

  const dialogBodyElement = React.useRef<HTMLElement | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  //stores an array to show the progress of uploading for each file
  //0 : not uploaded yet
  //1 : loading
  //2 : success
  //3 : failed
  const [fileStates, setFileStates] = useState<number[]>([]);

  const [isUploadContentTabShown, setIsUploadContentTabShown] = useState(true);

  const [filesToUpload, setFilesToUpload] = useState<{
    name: string;
    uri: string;
    fileObject: File;
  }[]>([]);

  const handleSubmit = async () => {
    if (filesToUpload.length > 0 && userInfo?.sessionId) {
      // scroll to bottom to show the list of files
      if(dialogBodyElement.current){
        dialogBodyElement.current.scrollTo({
          behavior: "smooth",
          top: dialogBodyElement.current.scrollHeight,
        });
      }
      setIsLoading(true);
      try {
        const successfullyUploadedFiles: IContent[] = [];
        for (let i = 0; i < filesToUpload.length; ++i) {
          setFileStates((old) => {
            var newFileStates = [...old];
            newFileStates[i] = 1;
            return newFileStates;
          });
          var payload = new FormData();
          payload.append("sessionId", userInfo?.sessionId);
          payload.append("file", filesToUpload[i].fileObject);

          // check if file size is less than user's size limit of upload
          // File.size is returned in bytes so we convert it to bits
          let fileSizeInBits = filesToUpload[i].fileObject.size * 8;
          if (fileSizeInBits <= maxUploadSize) {
            try {
              var res = await fetch("https://www.powersmartscreen.com/add-content", {
                method: "POST",
                body: payload,
              });
              var resJson = await res.json();
              console.log(resJson);

              if (resJson.success === true) {
                successfullyUploadedFiles.push(resJson.result as IContent);
                setFileStates((old) => {
                  var newFileStates = [...old];
                  newFileStates[i] = 2;
                  return newFileStates;
                });
              } else {
                setFileStates((old) => {
                  var newFileStates = [...old];
                  newFileStates[i] = 3;
                  return newFileStates;
                });
              }
            } catch (e) {
              console.log(e);
            }
          } else {
            setFileStates((old) => {
              var newFileStates = [...old];
              newFileStates[i] = 3;
              return newFileStates;
            });
          }
        }
        onSave(successfullyUploadedFiles);
        // Check if there's a file that had an error in upload
        // if there is, don't close the popup
        // if there isn't, meaning if all files were uploaded successfully, close the popup
        setTimeout(() => {
          setFileStates([])
          setFilesToUpload([])
          onClose();
        }, 1000);
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
      }
    }
  };



  useEffect(() => {
    if(dialogBodyElement.current !== null){
      // once new  files are added, scroll to bottom to show the uploaded files, cuz in some screens it doesn't show untill user scrolls
      // and a lot of users didn't know they had to scroll 
      dialogBodyElement.current.scrollTop = dialogBodyElement.current.scrollHeight;
    }
    var newFileStates = filesToUpload.map((i) => (typeof i !== "number" ? 0 : i));
    setFileStates(newFileStates);
  }, [filesToUpload]);

  const handleChange : React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e?.target?.files) {
      var fileList = Array.from(e.target.files);
      setFilesToUpload((old) => {
        var newFiles = fileList.map((newFile) => {
          var newFileURI = URL.createObjectURL(newFile);
          return {
            name: newFile.name,
            uri: newFileURI,
            fileObject: newFile,
          };
        });
        return [...old, ...newFiles];
      });
    }
  };

  const handleClose = () => {
    setFilesToUpload([]);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      id="add-content-dialog"
      maxWidth="md"
    >
      <div className="add-dialog-top">
        <DialogTitle>Ajouter un contenu</DialogTitle>
        <CloseIcon
          onClick={handleClose}
          sx={{ marginRight: 2, cursor: "pointer", color: "#ccc" }}
        />
      </div>
      <DialogContent ref={dialogBodyElement} sx={{ padding: 0, maxHeight: 600, scrollBehavior:"smooth" }}>
        <Box
          sx={{
            px: 3,
            py: 1.5,
            display: "flex",
            justifyContent: "center",
          }}
        >
          {/* <ButtonGroup variant="outlined" fullWidth>
            <Button
              onClick={() => {
                setIsUploadContentTabShown(true);
              }}
            >
              Charger des fichiers
            </Button>
            <Button
              onClick={() => {
                setIsUploadContentTabShown(false);
              }}
            >
              Ajouter du contenu web
            </Button>
          </ButtonGroup> */}
          <Alert severity="info">{`Vous avez une limite d'upload de ${formatBits(
            maxUploadSize
          )}. Contactez Power Society pour pouvoir augmenter cette limite.`}</Alert>
        </Box>
        {isUploadContentTabShown ? (
          <Box
            sx={{
              padding: 3,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="body1"
              sx={{ textAlign: "center", fontSize: 16, mb: 3 }}
            >
              Vous pouvez télécharger des fichiers images et vidéos
              {/* , audios et des HTML zippés */}
              .
            </Typography>
            <Box
              sx={{
                border: isDragging ? undefined: "3px dashed #e1e4e6",
                width: "70%",
                height: 300,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                gap: 3,
                padding: 3,
                borderRadius: 1.3,
                backgroundColor: isDragging ? "#90ee9040" : undefined,
              }}
            >
              <input
                type="file"
                multiple
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "red",
                  opacity: 0,
                }}
                onChange={handleChange}
                onDragOver={() => {
                  setIsDragging(true);
                }}
                onDragLeave={() => {
                  setIsDragging(false);
                }}
                onDrop={() => {
                  setIsDragging(false);
                }}
              />
              {isDragging ? (
                <>
                  <Typography variant="h5">Relâchez!</Typography>
                  <FileUploadIcon sx={{ color: "#000", fontSize: 52 }} />
                </>
              ) : (
                <>
                  <Typography variant="h5">
                    Glissez-déposez vos fichiers ici
                  </Typography>
                  <Typography variant="subtitle1">ou</Typography>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      document?.getElementById("upload-content")?.click();
                    }}
                  >
                    <input
                      type="file"
                      className="upload-content"
                      id="upload-content"
                      onChange={handleChange}
                      accept="image/*,video/*,audio/mp3,audio/mpeg,application/zip,.zip"
                      multiple
                    />
                    Selectionner des fichiers
                  </Button>
                </>
              )}
            </Box>
            <Box
              sx={{
                width: "100%",
                paddingTop: 3,
                px: 3,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {filesToUpload.map((file, idx) => {
                return (
                  <Box key={idx}>
                    <Box
                      sx={{
                        display: "flex",
                        maxHeight: 100,
                        width: "100%",
                        alignItems: "center",
                      }}
                    >
                      <img src={file.uri} alt="" className="preview-content" />
                      <Typography
                        variant="subtitle1"
                        sx={{ height: "100%", px: 2, py: 1, flex: 1 }}
                      >
                        {file.name}
                      </Typography>
                      <>
                        {fileStates[idx] === 0 ? (
                          <CloseIcon
                            onClick={() => {
                              setFilesToUpload((old) => {
                                return old.filter(
                                  (_file, index) => index !== idx
                                );
                              });
                            }}
                            sx={{
                              marginRight: 2,
                              cursor: "pointer",
                              color: "#ccc",
                            }}
                          />
                        ) : fileStates[idx] === 1 ? (
                          <CircularProgress />
                        ) : fileStates[idx] === 2 ? (
                          <CheckCircleIcon sx={{ color: "#05cd7d" }} />
                        ) : (
                          <CancelIcon sx={{ color: "#F00020" }} />
                        )}
                      </>
                    </Box>
                    {idx !== filesToUpload.length - 1 && (
                      <Divider
                        sx={{
                          height: 1,
                          width: "100%",
                          backgroundColor: "#e6ebf0",
                          my: 0.5,
                        }}
                      />
                    )}
                  </Box>
                );
              })}
            </Box>
          </Box>
        ) : (
          <Box></Box>
        )}
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{ paddingX: 5 }}
          disabled={isLoading}
        >
          Annuler
        </Button>
        <Button
          type="submit"
          onClick={handleSubmit}
          variant="contained"
          sx={{ paddingX: 5 }}
          disabled={isLoading}
        >
          Télécharger
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddContentDialog;