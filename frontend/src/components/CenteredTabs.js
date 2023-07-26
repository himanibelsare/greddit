import { Route, Routes, useNavigate } from "react-router-dom";
import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import IconButton from "@mui/material/IconButton";
import { Container } from "@mui/system";
import Button from "@mui/material/Button";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function CenteredTabs({ subName }) {
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);
  const [users, setUsers] = React.useState([]);
  const [blockedusers, setblockedUsers] = React.useState([]);
  const [requests, setRequests] = React.useState([]);
  const [reports, setReports] = React.useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const loadUsers = async () => {
    console.log("in load users");
    try {
      const response = await axios.post(
        "http://localhost:8000/api/mysubgreddits/getusers",
        { subName },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );
      //   console.log(response.data);
      setUsers(response.data.Users);
      setblockedUsers(response.data.BlockedUsers);
      const res = await axios.post(
        "http://localhost:8000/api/mysubgreddits/getrequests",
        { subName },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );
      console.log(res.data.Requests);
      setRequests(res.data.Requests);
      const result = await axios.post(
        "http://localhost:8000/api/reports/getreports",
        { subName },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );
      console.log(result.data);
      setReports(result.data);
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
    loadUsers();
  }, []);

  const acceptRequest = async (user) => {
    console.log(subName, user);
    try {
      const response = await axios.put(
        "http://localhost:8000/api/mysubgreddits/acceptrequests",
        { subName, user },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );
      console.log("here", response.data.Requests);
      console.log("here2", response.data.Users);
      setRequests(response.data.Requests);
      setUsers(response.data.Users);
    } catch (err) {
      if (err.response.status === 401) {
        localStorage.setItem("token", "");
        navigate("/");
        return;
      }
      console.log(err);
    }
  };

  const rejectRequest = async (user) => {
    console.log(subName, user);
    try {
      const response = await axios.put(
        "http://localhost:8000/api/mysubgreddits/deletingrequests",
        { subName, user },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );
      console.log("here", response.data.Requests);
      setRequests(response.data.Requests);
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
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "#ffcad4" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          centered
        >
          <Tab label="Users" {...a11yProps(0)} onClick={loadUsers} />
          <Tab label="Requests" {...a11yProps(1)} />
          <Tab label="Stats" {...a11yProps(2)} />
          <Tab label="Reports" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Box
          className="container-wrapper"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <div className="container">
            <h1> followers:</h1>
            <div className="row">
              {users.map((item, index) => (
                <div key={index} className="col-md-12 mb-0">
                  <div className="card">
                    <div className="card-body d-flex justify-content-between">
                      <h5>{item}</h5>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="container">
            <h1> blocked:</h1>
            <div className="row">
              {blockedusers.map((item, index) => (
                <div key={index} className="col-md-12 mb-0">
                  <div className="card">
                    <div className="card-body d-flex justify-content-between">
                      <h5>{item}</h5>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Box>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Container component="main" maxWidth="md">
          <h1> requests:</h1>
          <div className="row">
            {requests.map((item, index) => (
              <div key={index} className="col-md-12 mb-0">
                <div className="card ">
                  <div className="card-body d-flex justify-content-between">
                    <div>
                      <h5>{item}</h5>
                    </div>
                    <div>
                      <IconButton
                        style={{ marginLeft: "0.8rem" }}
                        onClick={() => {
                          acceptRequest(item);
                        }}
                      >
                        <DoneIcon />
                      </IconButton>
                      <IconButton
                        style={{ marginLeft: "0.8rem" }}
                        onClick={() => {
                          rejectRequest(item);
                        }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </TabPanel>
      <TabPanel value={value} index={2}>
        Stats
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Container component="main" maxWidth="md">
          <h1> reports:</h1>
          <div className="row">
            {reports &&
              reports.map((item, index) => (
                <div key={index} className="col-md-12 mb-0">
                  <div className="card ">
                    <div className="card-body d-flex justify-content-between">
                      <div>
                        <h5>Title: {item.Post}</h5>
                        <h6>ReportedBy: {item.ReportedBy}</h6>
                        <h6>Reason: {item.Reason}</h6>
                        <h6>Author of the Post: {item.personReported}</h6>
                      </div>
                      <div>
                      <Button variant="text">ignore</Button>
                      <Button variant="text">delete</Button>
                      <Button variant="text">block</Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </Container>
      </TabPanel>
    </Box>
  );
}
