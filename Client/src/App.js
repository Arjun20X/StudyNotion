import "./App.css";
import { useEffect, Suspense, lazy } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { getUserDetails } from "./Services/operations/profileAPI";
import Navbar from "./components/Common/Navbar"
import OpenRoute from "./components/core/Auth/OpenRoute";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import { ACCOUNT_TYPE } from "./utils/constants";
import {useDispatch, useSelector } from "react-redux";
import Spinner from "./components/Common/Spinner";

const Home = lazy(() => import("./pages/Home"));
const Contact = lazy(() => import("./pages/Contact"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const UpdatePassword = lazy(() => import("./pages/UpdatePassword"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const About = lazy(() => import("./pages/About"));
const MyProfile = lazy(() => import("./components/core/Dashboard/MyProfile"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Error = lazy(() => import("./pages/Error"));
const Settings = lazy(() => import("./components/core/Dashboard/Settings"));
const EnrolledCourses = lazy(() => import("./components/core/Dashboard/EnrolledCourses"));
const PurchaseHistory = lazy(() => import("./components/core/Dashboard/PurchaseHistory"));
const Cart = lazy(() => import("./components/core/Dashboard/Cart"));
const AddCourse = lazy(() => import("./components/core/Dashboard/AddCourse"));
const MyCourses = lazy(() => import("./components/core/Dashboard/MyCourses"));
const EditCourse = lazy(() => import("./components/core/Dashboard/EditCourse"));
const Catalog = lazy(() => import("./pages/Catalog"));
const CourseDetails = lazy(() => import("./pages/CourseDetails"));
const ViewCourse = lazy(() => import("./pages/ViewCourse"));
const VideoDetails = lazy(() => import("./components/core/ViewCourse/VideoDetails"));
const Instructor = lazy(() => import("./components/core/Dashboard/InstructorDashboard/Instructor"));

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
            <Suspense fallback={<div className="w-screen flex-1 flex justify-center items-center"><Spinner /></div>}>
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
                                <Route path="dashboard/purchase-history" element={<PurchaseHistory/>} />
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
            </Suspense>
        </div>
    );
}

export default App;