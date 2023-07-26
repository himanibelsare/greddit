import { Route, Routes, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PrimarySearchAppBar from "./components/PrimarySearchAppBar";
import { useParams } from "react-router-dom";
import CenteredTabs from "./components/CenteredTabs";

const SubGredDetails = () => {
  const navigate = useNavigate();
  const { subName } = useParams();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, []);
  return (
    <div
      style={{
        // backgroundColor: "#a0c4ff",
        width: "100%",
        height: "825px",
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
          <h1> gr/{subName}</h1>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CenteredTabs subName={subName} />
        </div>

    </div>
  );
};

export default SubGredDetails;
