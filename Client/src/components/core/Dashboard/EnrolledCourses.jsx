import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getUserEnrolledCourses } from '../../../Services/operations/profileAPI';
import ProgressBar from '@ramonak/react-progress-bar';
import { useNavigate } from "react-router-dom"
import Spinner from "../../Common/Spinner"

const EnrolledCourses = () => {
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const [enrolledCourses, setEnrolledCourses] = useState(null);

    const getEnrolledCourses = async () => {
        try {
            const response = await getUserEnrolledCourses(token);
            setEnrolledCourses(response);
        } catch (error) {
            console.log("Unable to fetch Enrolled Courses");
        }
    };

    useEffect(() => {
        getEnrolledCourses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-semibold text-richblack-5 tracking-wider lg:text-left text-center uppercase">
                Enrolled Courses
            </h1>

            {!enrolledCourses ? (
                <div className="grid min-h-[calc(100vh-12rem)] place-items-center">
                    <Spinner />
                </div>
            ) : !enrolledCourses.length ? (
                <div className="my-10 flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-richblack-700 bg-richblack-800 p-8 text-center">
                    <p className="text-xl font-medium text-richblack-200">
                        You have not enrolled in any course yet.
                    </p>
                    <button
                        onClick={() => navigate("/catalog/web-development")}
                        className="mt-6 rounded-md bg-yellow-50 px-6 py-3 font-semibold text-richblack-900 transition-all duration-200 hover:scale-95"
                    >
                        Explore Courses
                    </button>
                </div>
            ) : (
                <div className="my-8 rounded-2xl border border-richblack-700 bg-richblack-800 text-richblack-5 shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="flex w-full items-center justify-between border-b border-richblack-700 bg-richblack-700/50 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-richblack-200">
                        <p className="w-[45%]">Course Name</p>
                        <p className="w-1/4">Duration</p>
                        <p className="w-1/4">Progress</p>
                    </div>

                    {/* Course Rows */}
                    <div className="divide-y divide-richblack-700">
                        {enrolledCourses.map((course, index) => {
                            const progress = course.progressPercentage || 0;
                            const firstSectionId = course.courseContent?.[0]?._id;
                            const firstSubSectionId = course.courseContent?.[0]?.subSection?.[0]?._id;

                            return (
                                <div
                                    key={index}
                                    className="flex w-full items-center justify-between px-6 py-5 transition-all duration-200 hover:bg-richblack-700/30"
                                >
                                    {/* Course Info & Thumbnail */}
                                    <div
                                        onClick={() => {
                                            if (firstSectionId && firstSubSectionId) {
                                                navigate(
                                                    `/view-course/${course?._id}/section/${firstSectionId}/sub-section/${firstSubSectionId}`
                                                );
                                            }
                                        }}
                                        className="flex w-[45%] cursor-pointer items-center gap-4 group"
                                    >
                                        <img
                                            alt={course?.courseName || "course_img"}
                                            src={course.thumbnail || course.thubnail}
                                            className="h-16 w-24 rounded-lg object-cover shadow-md transition-transform duration-200 group-hover:scale-105"
                                        />
                                        <div className="flex flex-col gap-1 overflow-hidden">
                                            <p className="font-semibold text-richblack-5 text-base tracking-wide truncate group-hover:text-yellow-50 transition-colors">
                                                {course.courseName}
                                            </p>
                                            <p className="text-xs text-richblack-300 line-clamp-1">
                                                {course.courseDescription?.split("\n")?.[0] || ""}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Duration */}
                                    <div className="w-1/4 text-sm font-medium text-richblack-100">
                                        {course?.totalDuration || "N/A"}
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="flex w-1/4 flex-col gap-2">
                                        <div className="flex justify-between text-xs font-semibold">
                                            <span className="text-richblack-200">Progress</span>
                                            <span className={progress === 100 ? "text-caribbeangreen-200" : "text-yellow-50"}>
                                                {progress}%
                                            </span>
                                        </div>
                                        <ProgressBar
                                            completed={progress}
                                            height="8px"
                                            isLabelVisible={false}
                                            bgColor={progress === 100 ? "#05A77B" : "#FFD60A"}
                                            baseBgColor="#2C333F"
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EnrolledCourses;
