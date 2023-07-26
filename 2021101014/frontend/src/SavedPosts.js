import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as React from "react";
import PrimarySearchAppBar from "./components/PrimarySearchAppBar";
import axios from "axios";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import BookmarkRemoveIcon from "@mui/icons-material/BookmarkRemove";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import InsertCommentIcon from "@mui/icons-material/InsertComment";
import ReportIcon from "@mui/icons-material/Report";
const SavedPosts = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, []);

  const [posts, setPosts] = useState([]);
  const getPosts = async () => {
    console.log("in get saved posts");
    try {
      const response = await axios.get(
        "http://localhost:8000/api/savedposts/get",
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );
      setPosts(response.data);
      console.log("here", response.data);
    } catch (err) {
      if (err.response.status === 401) {
        localStorage.setItem("token", "");
        navigate("/");
        return;
      }
      console.log(err);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  const upvote = async (title) => {
    try {
      const response = await axios.put(
        "http://localhost:8000/api/posts/upvote",
        { title },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );
      console.log("here", response.data);
      window.location.reload();
    } catch (err) {
      if (err.response.status === 401) {
        localStorage.setItem("token", "");
        navigate("/");
        return;
      }
      console.log(err);
    }
  };
  const comment = () => {
    console.log("comment");
  };
  const follow = () => {
    console.log("comment");
  };
  const report = () => {
    console.log("comment");
  };

  const downvote = async (title) => {
    try {
      const response = await axios.put(
        "http://localhost:8000/api/posts/downvote",
        { title },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );
      console.log("here", response.data);
      window.location.reload();
    } catch (err) {
      if (err.response.status === 401) {
        localStorage.setItem("token", "");
        navigate("/");
        return;
      }
      console.log(err);
    }
  };

  const unSave = async (title) => {
    try {
      const response = await axios.put(
        "http://localhost:8000/api/savedposts/unsavepost",
        { title },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );
      console.log("here", response.data);
      window.location.reload();
    } catch (err) {
      if (err.response.status === 401) {
        localStorage.setItem("token", "");
        navigate("/");
        return;
      }
      console.log(err);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#f1faee",
        width: "100%",
        height: "825px",
      }}
    >
      <PrimarySearchAppBar />
      <h1> saved posts</h1>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {posts.map((card, index) => (
          <Card
            key={index}
            sx={{
              width: "calc(33.33% - 20px)",
              marginBottom: 2,
              marginRight: 2,
            }}
          >
            <CardContent
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <Typography gutterBottom variant="h5" component="div">
                  {card.Title}
                </Typography>
                <Typography gutterBottom variant="h8" component="div">
                  Description: {card.Description}
                </Typography>
                <Typography gutterBottom variant="h8" component="div">
                  Made by: {card.User}
                </Typography>
                <Typography gutterBottom variant="h8" component="div">
                  SubGreddit: {card.subName}
                </Typography>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <IconButton onClick={() => upvote(card.Title)}>
                  <ThumbUpIcon fontSize="small" />
                  <span> {card.Upvotes.length} </span>
                </IconButton>

                <IconButton onClick={() => downvote(card.Title)}>
                  <ThumbDownIcon fontSize="small" />
                  <span> {card.Downvotes.length} </span>
                </IconButton>
                <IconButton onClick={() => unSave(card.Title)}>
                  <BookmarkRemoveIcon fontSize="small" />
                </IconButton>
                <IconButton onClick={() => follow(card.Title)}>
                  <PersonAddIcon fontSize="small" />
                </IconButton>
                <IconButton onClick={() => report(card.Title)}>
                  <ReportIcon fontSize="small" />
                </IconButton>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SavedPosts;
