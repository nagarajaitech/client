import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/index";
import { Box, Typography, Paper, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ProductCreationForm from "../Product/CreateProduct";

const DashBoard = () => {
  const [userData, setUserData] = useState<{
    username?: string;
    email: string;
    token: string | null;
  } | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const reduxUserData = useSelector((state: RootState) => state.auth.userData);
  const navigate = useNavigate();

  useEffect(() => {
    if (!reduxUserData) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUserData(JSON.parse(storedUser));
      }
    } else {
      setUserData(reduxUserData);
    }
  }, [reduxUserData]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="black"
      width="100%"
    >
      <Paper
        elevation={2}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "10px",
          borderRadius: "30px",
          backgroundColor: "#03a3e8",
          width: "100%",
          maxWidth: "600px",
          maxHeight:'560px',
          textAlign: "center",
        }}
      >
        {userData ? (
          <>
            <Typography
              variant="h4"
              style={{ color: "#FFF", fontWeight: "bold" }}
            >
              Welcome back,{" "}
              <span style={{ color: "#FFF" }}>{userData.username}!</span>
            </Typography>

            <ProductCreationForm
              open={openForm}
              onClose={() => setOpenForm(false)}
            />
            <div style={{ display: "inline" }}>
              <Button
                variant="contained"
                color="secondary"
                style={{
                  marginTop: "20px",
                  backgroundColor: "#3004e0",
                  margin: 20,
                }}
                onClick={() => navigate("/home")}
              >
                View Products
              </Button>
            </div>
          </>
        ) : (
    
            <Typography
              variant="h5"
              style={{ color: "black", fontWeight: "bold" }}
            >
             Go To Login Page
            </Typography>

        )}
      </Paper>
    </Box>
  );
};

export default DashBoard;
