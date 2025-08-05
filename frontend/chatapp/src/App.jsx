import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import NotificationsPage from "./pages/NotificationsPage";
import OnboardingPage from "./pages/OnboardingPage";
import CallPage from "./pages/CallPage";
import ChatPage from "./pages/ChatPage";

import { Routes, Route, Navigate,useLocation,useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
/*import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./lib/axios.js";*/
import PageLoader from "./components/PageLoader.jsx";
import { getAuthUser } from "./lib/api.js";
import useAuthUser from "./hooks/useAuthUser.js";
import { LayOut } from "./components/LayOut.jsx";
import { useThemeStore } from "./store/useThemeStore.js";
//import { LayOut } from "./components/LayOut.jsx";
const App = () => {
  const navigate = useNavigate();
    const location = useLocation();
   const { theme } = useThemeStore();
 /* const { data: authData, isLoading, error } = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry:false,
    
  });*/
  const { isLoading, authUser, error} = useAuthUser();
  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;
  // Redirect to login on 401 Unauthorized error
  useEffect(() => {
    if (
      error?.response?.status === 401 &&
      location.pathname !== "/login" &&
      location.pathname !== "/signup"
    ) {
      navigate("/login", { replace: true });
    }
  }, [error, navigate, location.pathname]);

  //if (isLoading) return <div>Loading...</div>;
   if(isLoading) return <PageLoader />
  //const authUser = authData?.user;
  return (
    <div className="h-screen" data-theme={theme}>
      
      <Routes>
        <Route path="/" element={isAuthenticated  &&  isOnboarded?(
          <LayOut showSidebar={true}>
          <HomePage/>
          </LayOut>
          ):(
            <Navigate to={!isAuthenticated ? "/login":"/onboarding"} />
          )}/>
        <Route path="/signup" element={!isAuthenticated  ? <SignUpPage /> : <Navigate to={
          isOnboarded ? "/":"/onboarding" }  />} />
        <Route path="/login" element={!isAuthenticated  ? <LoginPage /> :<Navigate to={
          isOnboarded ? "/":"/onboarding" }  />} />
        <Route path="/notifications" element={isAuthenticated &&isOnboarded ?(
          <LayOut showSidebar={true}>
            <NotificationsPage/>
          </LayOut>
        ):(
          <Navigate to={!isAuthenticated ? "/login" : "/onboarding"}/>
        )} />

        <Route path="/onboarding" element={isAuthenticated  ? (
          !isOnboarded ?(
            <OnboardingPage/>
          ) :(
            <Navigate to="/"/>
          )
        ) :(
          <Navigate to="/login"/>
        )}/>
        <Route path="/call/:id" element={
          isAuthenticated && isOnboarded   ? (
             <CallPage />
          ):(
             <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
          )
        } />
        <Route path="/chat/:id" element={isAuthenticated && isOnboarded   ?(
          <LayOut showSidebar={false}>
            <ChatPage/>
          </LayOut>
        ):(
          <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
        ) } />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
