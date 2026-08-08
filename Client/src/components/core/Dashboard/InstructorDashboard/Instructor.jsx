import React, { useEffect, useState } from 'react'
import { getInstructorData } from '../../../../Services/operations/profileAPI';
import { useSelector } from 'react-redux';
import { fetchInstructorCourses } from '../../../../Services/operations/courseDetailsAPI';
import { Link } from 'react-router-dom';
import InstructorChart from './InstructorChart';
import Spinner from "../../../Common/Spinner"
import { VscBook, VscPeople } from 'react-icons/vsc'
import { HiOutlineCurrencyRupee } from 'react-icons/hi'

const Instructor = () => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector((state) => state.profile);
    const { token } = useSelector((state) => state.auth);
    const [instructorData, setInstructorData] = useState(null);
    const [courses, setCourses] = useState(null);

    useEffect(() => {
        const getCourseDataWithStats = async () => {
            setLoading(true);
            const instructorApiData = await getInstructorData(token);
            const result = await fetchInstructorCourses(token);

            if (instructorApiData?.length) {
                setInstructorData(instructorApiData);
            }
            if (result) {
                setCourses(result);
            }
            setLoading(false);
        }
        getCourseDataWithStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const totalAmount = instructorData?.reduce((acc, curr) => acc + curr.totalAmountGenerated, 0) || 0;
    const totalStudents = instructorData?.reduce((acc, curr) => acc + curr.totalStudentsEnrolled, 0) || 0;

    return (
        <div className="space-y-6">
            {/* Greeting Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold text-richblack-5 tracking-wide">
                    Hi {user?.firstName} 👋
                </h1>
                <p className="font-medium text-richblack-200 text-sm">
                    Let's check your course performance and student engagement stats.
                </p>
            </div>

            {loading ? (
                <div className="grid min-h-[calc(100vh-12rem)] place-items-center">
                    <Spinner />
                </div>
            ) : courses?.length > 0 ? (
                <div className="space-y-8">
                    {/* Visualise Chart & Stats Card Section */}
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Render Chart */}
                        <div className="flex-1">
                            <InstructorChart courses={instructorData} />
                        </div>

                        {/* Summary Stats Cards */}
                        <div className="flex flex-col gap-4 min-w-[280px] lg:w-[320px] justify-between rounded-2xl border border-richblack-700 bg-richblack-800 p-6 shadow-lg">
                            <h2 className="text-lg font-bold text-richblack-5 tracking-wide uppercase">
                                Statistics Summary
                            </h2>

                            <div className="space-y-4">
                                {/* Total Courses */}
                                <div className="flex items-center gap-4 rounded-xl border border-richblack-700 bg-richblack-900/60 p-4 transition-all hover:bg-richblack-900">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-50/10 text-yellow-50">
                                        <VscBook size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-richblack-300 uppercase tracking-wider">Total Courses</p>
                                        <p className="text-2xl font-bold text-richblack-5">{courses?.length || 0}</p>
                                    </div>
                                </div>

                                {/* Total Students */}
                                <div className="flex items-center gap-4 rounded-xl border border-richblack-700 bg-richblack-900/60 p-4 transition-all hover:bg-richblack-900">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-caribbeangreen-500/10 text-caribbeangreen-200">
                                        <VscPeople size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-richblack-300 uppercase tracking-wider">Total Students</p>
                                        <p className="text-2xl font-bold text-richblack-5">{totalStudents}</p>
                                    </div>
                                </div>

                                {/* Total Income */}
                                <div className="flex items-center gap-4 rounded-xl border border-richblack-700 bg-richblack-900/60 p-4 transition-all hover:bg-richblack-900">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-50/10 text-yellow-50">
                                        <HiOutlineCurrencyRupee size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-richblack-300 uppercase tracking-wider">Total Income</p>
                                        <p className="text-2xl font-bold text-yellow-50">₹{totalAmount}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Courses Preview Section */}
                    <div className="rounded-2xl border border-richblack-700 bg-richblack-800 p-6 shadow-lg space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-richblack-5 tracking-wide uppercase">Your Courses</h2>
                            <Link to="/dashboard/my-courses" className="text-sm font-semibold text-yellow-50 hover:underline">
                                View All
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courses?.slice(0, 3).map((course) => (
                                <div
                                    key={course._id}
                                    className="group flex flex-col overflow-hidden rounded-xl border border-richblack-700 bg-richblack-900 transition-all duration-200 hover:border-richblack-500"
                                >
                                    <div className="overflow-hidden">
                                        <img
                                            src={course.thumbnail}
                                            alt={course.courseName}
                                            className="h-[180px] w-full object-cover transition-transform duration-200 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="flex flex-1 flex-col justify-between p-4 space-y-3">
                                        <p className="font-semibold text-richblack-5 text-base tracking-wide truncate group-hover:text-yellow-50 transition-colors">
                                            {course.courseName}
                                        </p>
                                        <div className="flex items-center justify-between text-xs text-richblack-300">
                                            <span>{course.studentsEnrolled?.length || 0} Students</span>
                                            <span className="font-semibold text-yellow-50 text-sm">₹{course.price}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="my-10 flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-richblack-700 bg-richblack-800 p-8 text-center space-y-4">
                    <p className="text-2xl font-bold text-richblack-5">You Have Not Created Any Courses Yet</p>
                    <Link
                        to="/dashboard/add-course"
                        className="rounded-md bg-yellow-50 px-6 py-3 font-semibold text-richblack-900 transition-all duration-200 hover:scale-95"
                    >
                        Create a Course
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Instructor;
