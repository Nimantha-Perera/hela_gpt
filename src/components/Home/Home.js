import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
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
    <div>
      
    <MDBContainer className="d-flex flex-column justify-content-start align-items-center">
      <div className="text-center mb-4">
        <h1 className="display-4">Hela GPT</h1>
        <p className="lead">Welcome, {displayName}</p>
      </div>

 

      <MDBRow className="mt-4">
        <MDBCol>
          <MDBCard>
            <MDBCardBody>
              <MDBBtn onClick={handleLogout}>Logout</MDBBtn>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
    <ChatView />
    </div>
  );
}
