import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "../styles/App.scss";
import Header from "./Header";
import Footer from "./Footer";
import Home_page from "./pages/Home_page";
import Sign_up from "./pages/Sign_up";
import SignIn from "./pages/Sign_in";
import SignInAsOwner from "./pages/Sign_in_owners";
import Profile from "./pages/owner/Profile";
import MyReservations from "./pages/client/My_reservation";
import Private_owner_route from "./Private_owner_route";
import { AuthProvider } from "./Auth_context";
import Private_client_route from "./Private_client_route";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home_page />} />
              <Route path="/SignUp" element={<Sign_up />} />
              <Route path="/SignIn" element={<SignIn />} />
              <Route path="/SignInAsOwner" element={<SignInAsOwner />} />
              <Route
                path="/owner/profile"
                element={
                  <Private_owner_route>
                    <Profile />
                  </Private_owner_route>
                }
              />
              <Route
                path="/owner/myoffers"
                element={<Private_owner_route></Private_owner_route>}
              />
              <Route
                path="/owner/reservations"
                element={<Private_owner_route></Private_owner_route>}
              />
              <Route
                path="/client/reservations"
                element={
                  <Private_client_route>
                    <MyReservations />
                  </Private_client_route>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
