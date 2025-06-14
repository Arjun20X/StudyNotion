import "./App.css";
import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import { getUserDetails } from "./Services/operations/profileAPI";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Common/Navbar"
import OpenRoute from "./components/core/Auth/OpenRoute";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import About from "./pages/About";
import MyProfile from "./components/core/Dashboard/MyProfile";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
// import Sidebar from "./components/core/Dashboard/Sidebar";
import Error from "./pages/Error"
import Settings from "./components/core/Dashboard/Settings";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import Cart from "./components/core/Dashboard/Cart";
import { ACCOUNT_TYPE } from "./utils/constants";
import {useDispatch, useSelector } from "react-redux";
import AddCourse from "./components/core/Dashboard/AddCourse";
import MyCourses from "./components/core/Dashboard/MyCourses";
import EditCourse from "./components/core/Dashboard/EditCourse";
import Catalog from "./pages/Catalog";
import CourseDetails from "./pages/CourseDetails";
import ViewCourse from "./pages/ViewCourse";
import VideoDetails from "./components/core/ViewCourse/VideoDetails";
import Instructor from "./components/core/Dashboard/InstructorDashboard/Instructor";

function App() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {user} = useSelector((state) => state.profile)

    useEffect(() => {
        if (localStorage.getItem("token")) {
          const token = JSON.parse(localStorage.getItem("token"))
          dispatch(getUserDetails(token, navigate))
        }
    
      }, [dispatch, navigate])

    return (
        <div className="flex min-h-screen w-screen flex-col bg-richblack-900 font-inter" >
            <Navbar/>
            <Routes>
                <Route path="/" element={<OpenRoute><Home/></OpenRoute>} />
                <Route path="/catalog/:catalogName" element={<Catalog/>} />
                <Route path="courses/:courseId" element={<CourseDetails/>} />
                <Route path="/contact" element={<Contact/>} />

                <Route path="login" element={<OpenRoute><Login/></OpenRoute>} />
                <Route path="signup" element={<OpenRoute><Signup/></OpenRoute>} />
                <Route path="forgot-password" element={<OpenRoute><ForgotPassword/></OpenRoute>} />
                <Route path="update-password/:id" element={<OpenRoute><UpdatePassword/></OpenRoute>} />
                <Route path="verify-email" element={<OpenRoute><VerifyEmail/></OpenRoute>} />
                <Route path="/about" element={<OpenRoute><About/></OpenRoute>} />
                <Route element={<PrivateRoute><Dashboard/></PrivateRoute>}>

                    <Route path="dashboard/my-profile" element={<MyProfile/>} />
                     <Route path="dashboard/settings" element={<Settings/>} />


                    {
                        user?.accountType === ACCOUNT_TYPE.STUDENT && (
                            <>
                                <Route path="dashboard/cart" element={<Cart/>} />
                                <Route path="dashboard/enrolled-courses" element={<EnrolledCourses/>} />
                            </>
                        )
                    }

                    {
                        user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
                            <>
                                <Route path="dashboard/instructor" element={<Instructor/>} />
                                <Route path="dashboard/add-course" element={<AddCourse />} />
                                <Route path="dashboard/my-courses" element={<MyCourses />} />
                                <Route path="dashboard/edit-course/:courseId" element={<EditCourse />} />
                            </>
                        )
                    }

                </Route>


                <Route element={
                    <PrivateRoute>
                        <ViewCourse />
                    </PrivateRoute>
                } >

                    {
                        user?.accountType === ACCOUNT_TYPE.STUDENT && (
                            <>
                                <Route 
                                    path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                                    element={<VideoDetails />}
                                />
                            </>
                        )
                    }

                </Route>

                <Route path="*" element={<Error/>} />
            </Routes>
        </div>
    );
}

export default App;