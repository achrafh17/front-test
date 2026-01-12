import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  ITwitterApiResponse,
  IFormattedTwitterApiResponse,
} from "../../../types/api.types";
//@ts-ignore
import TwitterVerifiedIMG from "../../../assets/images/twitter-verified.png";
import dayjs from "dayjs";

interface props {
  duration: number;
  searchBy: string;
  searchText: string;
  theme: string;
  fontSize: string;
  onTweets: (newTweets: ITwitterApiResponse) => void
}

const SIZES = {
  small: 11,
  medium: 12,
  large: 14,
};

const TwitterPreview: React.FC<props> = ({
  duration,
  searchBy,
  searchText,
  theme,
  fontSize,
  onTweets,
}) => {
  const [twitterResponse, setTwitterResponse] =
    React.useState<ITwitterApiResponse | null>(null);
  const [formattedTwitterResponse, setFormattedTwitterResponse] =
    React.useState<IFormattedTwitterApiResponse | null>(null);

  React.useEffect(() => {
    setTwitterResponse(null);
    let t = setTimeout(async () => {
      if (!searchText) return;
      var response = await fetch(
        `https://www.powersmartscreen.com/get-tweets?searchBy=${searchBy}&searchText=${searchText}`
      );
      var resJson = await response.json();
      if (resJson.success) {
        if (resJson.data.meta.result_count !== 0) {
          setTwitterResponse(resJson.data as ITwitterApiResponse);
        }
      }
    }, 1500);

    return () => {
      clearTimeout(t);
    };
  }, [searchBy, searchText,]);

  React.useEffect(() => {
    if (twitterResponse !== null) {
      var users = {};
      twitterResponse.includes.users.forEach((user) => {
        users[user.id] = user;
      });
      var media = {};
      twitterResponse.includes.media?.forEach((medium) => {
        media[medium.media_key] = medium;
      });
      setFormattedTwitterResponse({
        data: twitterResponse.data,
        users: users,
        media: media,
      });
      setFormattedTwitterResponse({
        data: twitterResponse.data,
        users: users,
        media: media,
      });
    } else {
      setFormattedTwitterResponse(null);
    }
    onTweets(
      twitterResponse ?? {
        data: [],
        includes: { users: [] },
      }
    );
  }, [twitterResponse]);

  React.useEffect(() => {
    if (formattedTwitterResponse !== null) {
      var t: any = null;
      var sliderContainer = document.getElementById("twitter-preview");
      if (sliderContainer !== null) {
        var SliderContainerWidth = sliderContainer.scrollWidth;
        sliderContainer.scrollTo(0, 0);
        if (formattedTwitterResponse.data.length) {
          t = setInterval(() => {
            if (sliderContainer!.scrollLeft + 340 !== SliderContainerWidth) {
              sliderContainer!.scrollTo(sliderContainer!.scrollLeft + 340, 0);
            } else {
              sliderContainer!.scrollTo(0, 0);
            }
          }, duration * 1000);
        }

        return () => {
          clearInterval(t);
        };
      }
    }
  }, [formattedTwitterResponse, duration]);

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        overflowX: "auto",
        scrollSnapType: "x mandatory",
        scrollBehavior: "smooth",
        position: "relative",
        backgroundColor: theme === "dark" ? "#222222" : "white",
        color: theme === "dark" ? "white" : "black",
      }}
      className="hide-scrollbar"
      id="twitter-preview"
    >
      {formattedTwitterResponse === null ? (
        <Box sx={{height:"100%", width:"100%", backgroundColor: "#888"}}></Box>
      ) : (
        formattedTwitterResponse.data.map((content, idx) => {
          if (content?.attachments?.media_keys) {
            console.log(
              formattedTwitterResponse?.media?.[
                content.attachments.media_keys[0]
              ]
            );
          }
          return (
            <Box
              key={idx}
              sx={{
                width: 340,
                minWidth: 340,
                maxWidth: 340,
                height: 190,
                maxHeight: 190,
                scrollSnapAlign: "start",
                display: "flex",
              }}
            >
              {/* media */}
              {content?.attachments?.media_keys !== undefined && (
                <Box
                  sx={{
                    flex: 2,
                    height: "100%",
                    backgroundColor: "#888",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    alt=""
                    src={
                      formattedTwitterResponse?.media?.[
                        content?.attachments?.media_keys[0]
                      ].url ??
                      formattedTwitterResponse?.media?.[
                        content?.attachments?.media_keys[0]
                      ].preview_image_url ??
                      ""
                    }
                    style={{
                      height: "100%",
                      width: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              )}
              <Box sx={{ p: 1, flex: 3, height: "100%", maxHeight: 190 }}>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      alt=""
                      src={
                        formattedTwitterResponse.users[content.author_id]
                          .profile_image_url
                      }
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography
                        sx={{
                          color: "inherit",
                          fontWeight: "bold",
                          fontSize: 12,
                        }}
                      >
                        {formattedTwitterResponse.users[content.author_id].name}
                      </Typography>
                      <img
                        alt="verified"
                        src={TwitterVerifiedIMG}
                        style={{ width: 12, height: 12 }}
                      />
                    </Box>
                    <Typography sx={{ fontSize: 10, color: "#888" }}>
                      {`@${
                        formattedTwitterResponse.users[content.author_id]
                          .username
                      }  •  ${dayjs(content.created_at).format(
                        "DD/MM/YYYY HH:mm"
                      )}`}
                    </Typography>
                  </Box>
                </Box>
                <p
                  style={{
                    fontSize: SIZES[fontSize],
                    overflowY: "scroll",
                    maxHeight: 110,
                  }}
                >
                  {content.text.split(" ").map((word, idx) => {
                    if (word[0] === "@" || word[0] === "#") {
                      return (
                        <span
                          key={idx + ""}
                          style={{
                            color: "#1c95e0",
                          }}
                        >
                          {word + " "}
                        </span>
                      );
                    } else {
                      return (
                        <span
                          key={idx + ""}
                          style={{
                            color: "inherit",
                          }}
                        >
                          {word + " "}
                        </span>
                      );
                    }
                  })}
                </p>
              </Box>
            </Box>
          );
        })
      )}
    </Box>
  );
};

export default TwitterPreview;
