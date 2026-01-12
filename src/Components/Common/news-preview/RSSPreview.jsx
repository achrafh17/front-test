import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";

const SIZES = {
    "small": {
        title: 8,
        body: 6,
    },
    "medium": {
        title: 11,
        body: 9,
    },
    "large": {
        title: 14,
        body: 12,
    },
}

const Post = ({ title, description, image, fontSize, color, idx }) => {

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        scrollSnapAlign: "start",
        display: "flex",
        alignItems: "center",
      }}
    >
      {!!image && <Box sx={{ flex: 4, height: "100%", overflow: "hidden" }}>
        <img
          src={image}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </Box>}
      <Box
        sx={{
          flex: 5,
          p: 1,
          height: "100%",
          maxHeight: "100%",
          overflowY: "scroll",
          scrollBehavior: "smooth",
          color: color
        }}
        className="hide-scrollbar"
        id={`post-content-${idx}`}
      >
        <Typography
          sx={{
            fontSize: SIZES?.[fontSize]?.["title"] ?? 11,
            fontWeight: "bold",
            lineHeight: 1.1,
            mb: 1,
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{ fontSize: SIZES?.[fontSize]?.["body"] ?? 9, fontWeight: "500" }}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  );
};

export default function RSSPreview({ link, duration, fontSize, theme }) {
  const { userInfo } = useAuth();

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if(link){
      fetch(`https://www.powersmartscreen.com/get-rss-info?link=${encodeURIComponent(link)}`)
        .then((res) => res.json())
        .then((resJson) => {
          if (resJson?.success) {
            setPosts(resJson.result);
          }
        })
        .catch((e) => {});
    }
  }, [link, userInfo?.sessionId]);

  useEffect(() => {
    var t = null;
    var postsContainer = document.getElementById("posts-container");
    var postsContainerWidth = postsContainer.scrollWidth;
    postsContainer.scrollTo(0, 0);
    if (posts.length) {
      t = setInterval(() => {
        if (postsContainer.scrollLeft + 340 !== postsContainerWidth) {
          postsContainer.scrollTo(postsContainer.scrollLeft + 340, 0);
        } else {
          postsContainer.scrollTo(0, 0);
        }
      }, duration * 1000);
    }

    return () => {
      clearInterval(t);
    };
  }, [posts, duration]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flew",
        overflowX: "auto",
        scrollSnapType: "x mandatory",
        scrollBehavior: "smooth",
        backgroundColor: theme === "light" ? "white" : "#222",
      }}
      className="hide-scrollbar"
      id="posts-container"
    >
      {posts.map((post, idx) => {
        return (
          <Post
            key={idx}
            title={post.title}
            description={post.description}
            image={post.image}
            fontSize={fontSize}
            idx={idx}
            color={theme === "light" ? "#222" : "white"}
          />
        );
      })}
    </Box>
  );
}
