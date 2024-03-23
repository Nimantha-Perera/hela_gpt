import React from "react";
import { useNavigate } from "react-router";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBWelcome,
  MDBBtn,
} from "mdb-react-ui-kit";
import ChatView from "./ChatView";

export default function Home() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigator = useNavigate();

  const displayName = user && user.displayName ? user.displayName : "Guest";

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      navigator("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <MDBContainer>
      <h1>Welcome, {displayName}</h1>

       <ChatView />
    </MDBContainer>

   
  );
}
