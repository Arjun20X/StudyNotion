import {combineReducers} from "@reduxjs/toolkit";
import authReducer from "../slice/authSlice"
import profileReducer from "../slice/profileSlice"
import cartReducer from "../slice/cartSlice"
import viewCourseReducer from "../slice/viewCourseSlice"
import courseReducer from "../slice/courseSlice"


const rootReducer = combineReducers({
    auth:authReducer,
    profile:profileReducer,
    cart:cartReducer,
    viewCourse:viewCourseReducer,
    course: courseReducer,
})

export default rootReducer