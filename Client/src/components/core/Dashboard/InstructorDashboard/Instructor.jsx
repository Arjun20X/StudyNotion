import React, { useEffect, useState } from 'react'
import { getInstructorData } from '../../../../Services/operations/profileAPI';
import { useSelector } from 'react-redux';
import { fetchInstructorCourses } from '../../../../Services/operations/courseDetailsAPI';
import { Link } from 'react-router-dom';
import InstructorChart from './InstructorChart';
import Spinner from "../../../Common/Spinner"

const Instructor = () => {

    const [loading, setLoading] = useState(false);
    const {user} = useSelector((state) => state.profile);
    const {token} = useSelector((state) => state.auth);
    const [instructorData, setInstructorData] = useState(null);
    const [courses, setCourses] = useState(null);

    useEffect(() => {
        const getCourseDataWithStats = async() => {
            setLoading(true);
            const instructorApiData = await getInstructorData(token);
            const result = await fetchInstructorCourses(token);

            console.log(instructorApiData);
            console.log("RESULT..",result);

            if(instructorApiData.length){
                setInstructorData(instructorApiData);
            }
            if(result){
                setCourses(result);
            }
            setLoading(false);
        }
        getCourseDataWithStats();
    },[])

    const totalAmount = instructorData?.reduce((acc,curr) => acc+ curr.totalAmountGenerated, 0);
    const totalStudents = instructorData?.reduce((acc,curr) => acc+ curr.totalStudentsEnrolled, 0);

  return (
    <div>
      <div className='space-y-2' >
        <h1 className='text-richblack-5 text-2xl font-bold ' >Hi {user?.firstName} </h1>
        <p className='text-richblack-200 font-medium ' >Let's Start Something New </p>
      </div>

       {loading ? (<div className='h-[calc(100vh-10rem)] grid place-items-center' ><Spinner /></div>)
        : courses.length > 0
        ? (<div>
            <div className='flex flex-col md:flex-row gap-5 my-10'>
              <div className='w-full' >
                  <InstructorChart courses={instructorData} />
                  <div>

                    <p>Statistics</p>
                    <div>
                      <p>Total Courses</p>
                      <p>{courses.length}</p>
                    </div>

                    <div>
                      <p>Total Students</p>
                      <p>{totalStudents}</p>
                    </div>

                    <div>
                      <p>Total Income</p>
                      <p>{totalAmount}</p>
                    </div>

                  </div>
              </div>
        </div>

        <div>
          {/* Render 3 courses */}
          <div>
            <p>Your Courses </p>
            <Link to="/dashboard/my-courses" >
              <p>View All</p>
            </Link>
          </div>

          <div>
            {
              courses.slice(0,3).map((course) => (
                <div>
                  <img 
                    src={course.thumbnail}
                  />
                  <div>
                    <p>{course.courseName}</p>
                    <div>
                      <p>Students {course.studentsEnrolled.length}</p>
                      <p>|</p>
                      <p>Rs {course.price}</p>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>

        </div>

        </div>
        )   
        :(<div className='text-center mt-20 bg-richblack-800 px-6  py-20 rounded-md'>
          <p className='text-2xl font-bold text-richblack-5'>You Have not created any course yet</p>
          <Link to="/dashboard/addCourse" >
            <p className='mt-3  text-lg font-semibold text-yellow-50 underline' >Create a Course</p>
          </Link>
        </div>)
    }

    </div>
  )
}

export default Instructor
