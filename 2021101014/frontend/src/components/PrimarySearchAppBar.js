import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import AccountCircle from "@mui/icons-material/AccountCircle";
import RedditIcon from "@mui/icons-material/Reddit";
import AllInboxIcon from "@mui/icons-material/AllInbox";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";

export default function PrimarySearchAppBar() {
  const navigate = useNavigate();
  const profilePageClicked = () => {
    navigate("/profile");
  };
  const AllSubGredditsClicked = () => {
    navigate("/allsubgreddits");
  };
  const saveButtonClicked = () => {
    navigate("/savedposts");
  };
  const mySubGredditsClicked = () => {
    navigate("/mysubgreddits");
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "#263238" }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <RedditIcon fontSize="large" />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            GREDDIT
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton
              size="large"
              color="inherit"
              onClick={saveButtonClicked}
            >
              <BookmarkBorderIcon />
            </IconButton>
            <IconButton
              size="large"
              color="inherit"
              onClick={mySubGredditsClicked}
            >
              <HomeIcon />
            </IconButton>
            <IconButton
              size="large"
              color="inherit"
              onClick={AllSubGredditsClicked}
            >
              <AllInboxIcon />
            </IconButton>
            <IconButton
              size="large"
              color="inherit"
              onClick={profilePageClicked}
            >
              <AccountCircle />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
