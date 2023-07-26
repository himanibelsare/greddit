import { useState, useEffect } from "react";
import { styled, alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import * as React from "react";
import PrimarySearchAppBar from "./components/PrimarySearchAppBar";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import LaunchIcon from "@mui/icons-material/Launch";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import { margin } from "@mui/system";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const AllSubGreddits = () => {
  const navigate = useNavigate();
  const [joinedSubs, setJoinedSubs] = useState([]);
  const [otherSubs, setOtherSubs] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, []);

  const Subs = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/allsubgreddits/getjoinedsubs",
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );
      setJoinedSubs(response.data);
      console.log("here", response.data);
      const res = await axios.get(
        "http://localhost:8000/api/allsubgreddits/getothersubs",
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );
      setOtherSubs(res.data);
      console.log("here", res.data);
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
    Subs();
  }, []);

  const leaveSub = async (subName) => {
    try {
      const response = await axios.put(
        "http://localhost:8000/api/allsubgreddits/leavingsubs",
        { subName },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );
      window.location.reload();
      console.log(response.data);
    } catch (err) {
      if (err.response.status === 401) {
        localStorage.setItem("token", "");
        navigate("/");
        return;
      }
      console.log(err);
    }
  };

  const joinSub = async (subName) => {
    try {
      const response = await axios.put(
        "http://localhost:8000/api/mysubgreddits/requesttojoin",
        { subName },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );
      window.location.reload();
    } catch (err) {
      if (err.response.status === 401) {
        localStorage.setItem("token", "");
        navigate("/");
        return;
      }
      if (err.response.status === 402) {
        alert("you left once!");
        return;
      }
      console.log(err);
    }
  };

  const launchSubDetails = (name) => {
    navigate(`/allsubgreddits/${name}`);
  };

  return (
    <div
      style={{
        backgroundColor: "#fcd5ce",
      }}
    >
      <PrimarySearchAppBar />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1> All SubGreddits!</h1>
      </div>

      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search…"
          inputProps={{ "aria-label": "search" }}
        />
      </Search>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h3> Joined:</h3>
      </div>
      <div className="app">
        <div
          className="user-list"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "20px",
          }}
        >
          {joinedSubs.map((user) => (
            <div className="card" key={user.Name}>
              <div className="card-header">
                <h2
                  style={{
                    backgroundColor: "#fcd5ce",
                    display: "flex", // add this to enable flexbox
                    alignItems: "center", // add this to center the icon vertically
                    justifyContent: "space-between",
                    // marginRight: "5px"
                  }}
                >
                  {user.Name}
                  <div>
                    <IconButton
                      style={{ marginLeft: "0.8rem" }}
                      onClick={() => {
                        launchSubDetails(user.Name);
                      }}
                    >
                      <LaunchIcon />
                    </IconButton>
                    <Button
                      onClick={() => {
                        leaveSub(user.Name);
                      }}
                      variant="outlined"
                    >
                      Leave
                    </Button>
                  </div>
                </h2>
              </div>
              <div className="card-body">
                <p>
                  <strong>Description:</strong> {user.Description}
                </p>
                <p>
                  <strong>Banned Keywords:</strong>
                  {user.BannedWords}
                </p>
                <p>
                  <strong>Users:</strong>
                  {user.Users.length}
                </p>
                <p>
                  <strong>Posts:</strong> {user.Posts}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h3> Others:</h3>
      </div>
      <div className="app">
        <div
          className="user-list"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "20px",
          }}
        >
          {otherSubs.map((user) => (
            <div className="card" key={user.Name}>
              <div className="card-header">
                <h2
                  style={{
                    backgroundColor: "#fcd5ce",
                    display: "flex", // add this to enable flexbox
                    alignItems: "center", // add this to center the icon vertically
                    justifyContent: "space-between",
                    // marginRight: "5px"
                  }}
                >
                  <div>{user.Name}</div>
                  <div>
                    <Button
                      onClick={() => {
                        joinSub(user.Name);
                      }}
                      variant="outlined"
                    >
                      JOIN
                    </Button>
                  </div>
                </h2>
              </div>
              <div className="card-body">
                <p>
                  <strong>Description:</strong> {user.Description}
                </p>
                <p>
                  <strong>Banned Keywords:</strong>
                  {user.BannedWords}
                </p>
                <p>
                  <strong>Users:</strong>
                  {user.Users.length}
                </p>
                <p>
                  <strong>Posts:</strong> {user.Posts}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllSubGreddits;
