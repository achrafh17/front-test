import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
//@ts-ignore
// import { ReactComponent as UserSvg } from "../../assets/svg/user.svg";
import useAuth from "../../hooks/useAuth";
import useRSB from "../../hooks/useRSB";
import { TextField } from "@mui/material";
import PhoneInput from "../Common/phone-input";
import ChangePasswordView from "./ChangePasswordView";

const INITIAL_FORM_FIELDS = {
  userName: "",
  email: "",
  phone: "",
  company: "",
};

export default function Main() {
  const { userInfo, setUserInfo } = useAuth();
  const { setRsbVariant } = useRSB();
  const [isEditing, setIsEditing] = React.useState(false);
  const [isChangingPassword, setIsChangingPassword] = React.useState(false);
  const [formFields, setFormFields] = React.useState(INITIAL_FORM_FIELDS);

  React.useEffect(() => {
    setRsbVariant({
      name: "NULL",
      renderComponent: () => <> </>,
    });
  }, [setRsbVariant]);

  React.useEffect(() => {
    setFormFields({
      userName: userInfo?.userName ?? "",
      email: userInfo?.email ?? "",
      phone: userInfo?.phone ?? "",
      company: userInfo?.company ?? "",
    });
  }, [userInfo]);

  const fields = [
    {
      label: "Nom d'utilisateur",
      value: "userName",
    },
    {
      label: "Email",
      value: "email",
    },
    {
      label: "Numéro de Téléphone",
      value: "phone",
    },
    {
      label: "Société",
      value: "company",
    },
  ];

  const onSave = async () => {
    let payload = { ...formFields, sessionId: userInfo?.sessionId };
    try {
      let res = await fetch("https://www.powersmartscreen.com/update-user-info", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      let resJson = await res.json();
      if (resJson.success === true) {
        setUserInfo({
          ...userInfo!,
          phone: payload.phone,
          email: payload.email,
          userName: payload.userName,
          company: payload.company,
        });
        setIsEditing(false);
      }
    } catch (e) {}
  };

  const onCancel = () => {
    setFormFields({
      userName: userInfo?.userName ?? "",
      email: userInfo?.email ?? "",
      phone: userInfo?.phone ?? "",
      company: userInfo?.company ?? "",
    });
    setIsEditing(false);
  };

  return (
    <div className="main-screen">
      <Box
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "40%",
            //   border: "1px solid red",
            p: 1,
            minHeight: "50%",
          }}
        >
          {isChangingPassword ? (
            <ChangePasswordView
              onBack={() => {
                setIsChangingPassword(false);
              }}
            />
          ) : (
            <Box>
              <Typography
                sx={{
                  fontSize: 20,
                  fontWeight: "500",
                  color: "#3f4242",
                  mb: 3,
                }}
              >
                Paramètres de l'utilisateur
              </Typography>

              <Box sx={{display:"flex", justifyContent:"flex-end"}}>
                <Typography
                  sx={{
                    fontSize: 14,
                    color: "#888",
                    mb: 3,
                    cursor: "pointer",
                    "&:hover": {
                      color: "#F00020",
                      textDecoration: "underline",
                    },
                  }}
                  onClick={() => {
                    setIsChangingPassword(true);
                  }}
                >
                  Changer le mot de passe
                </Typography>
              </Box>
              {isEditing
                ? fields.map(({ label, value }, idx) => (
                    <Box key={idx} sx={{ mb: 2 }}>
                      {value === "phone" ? (
                        <PhoneInput
                          value={formFields.phone}
                          onChange={(newVal) =>
                            setFormFields((old) => ({ ...old, phone: newVal }))
                          }
                        />
                      ) : (
                        <TextField
                          fullWidth
                          variant="outlined"
                          label={label}
                          value={formFields?.[value]}
                          onChange={(e) => {
                            setFormFields((old) => ({
                              ...old,
                              [value]: e.target.value,
                            }));
                          }}
                        />
                      )}
                    </Box>
                  ))
                : fields.map(({ label, value }, idx) => (
                    <Box key={idx} sx={{ mb: 3, p: 0.5 }}>
                      <Typography
                        sx={{ fontSize: 12, color: "#84898a", pl: 1 }}
                      >
                        {label}
                      </Typography>
                      <Typography sx={{ fontSize: 16, pl: 1, minHeight: 24 }}>
                        {formFields?.[value] ?? ""}
                      </Typography>
                      <div
                        style={{
                          height: 1,
                          width: "100%",
                          backgroundColor: "rgba(0,0,0,0.23)",
                          marginTop: 5,
                        }}
                      />
                    </Box>
                  ))}

              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                  mt: 2,
                }}
              >
                {isEditing ? (
                  <>
                    <Button
                      sx={{ py: 1, width: 170 }}
                      color="success"
                      variant="contained"
                      onClick={onSave}
                    >
                      Enregistrer
                    </Button>
                    <Button
                      sx={{ py: 1, width: 170 }}
                      color="error"
                      variant="contained"
                      onClick={onCancel}
                    >
                      Annuler
                    </Button>
                  </>
                ) : (
                  <Button
                    color="info"
                    variant="outlined"
                    sx={{ width: 230, py: 1 }}
                    onClick={() => {
                      setIsEditing(true);
                    }}
                  >
                    Modifier
                  </Button>
                )}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </div>
  );
}
