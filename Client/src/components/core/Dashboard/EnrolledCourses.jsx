import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getUserEnrolledCourses } from '../../../Services/operations/profileAPI';
import ProgressBar from '@ramonak/react-progress-bar';
import { useNavigate } from "react-router-dom"


const EnrolledCourses = () => {

    const {token} = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const [enrolledCourses, setEnrolledCourses] = useState(null);

    const getEnrolledCourses = async() => {
        try{
            const response = await getUserEnrolledCourses(token);  // Getting all the published and the drafted courses
            setEnrolledCourses(response);
        }
        catch(error){
            console.log("Unable to fetch Enrolled Courses");
        }
    }

    useEffect(() => {
        getEnrolledCourses();
    },[]);

  return (
    <div>
      <div className="text-3xl text-richblack-50 uppercase tracking-wider lg:text-left text-center">Enrolled Courses</div>
      {
        !enrolledCourses ? (<div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
            <div className="spinner"></div>
        </div>)
         : !enrolledCourses.length ? (<p className="grid h-[10vh] w-full place-content-center text-richblack-5">You have not enrolled in any course yet</p>)
         : (
            <div className="overflow-x-auto">
                <div className='my-8 text-richblack-5 w-[650px] md:w-full'>
                    <p className="w-[45%] px-5 py-3 uppercase tracking-wider">Course Name</p>
                    <p className="w-1/4 px-2 py-3 uppercase tracking-wider">Durations</p>
                    <p className="flex-1 px-2 py-3 uppercase tracking-wider">Progress</p>
                </div>
                {/* Cards yha se shuru hote h ab */}
                {
                    enrolledCourses.map((course,index) => {
                        <div className='flex items-center border border-richblack-700 '>
                            <div 
                            onClick={() => {
                                navigate(
                                  `/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`
                                )
                              }}
                            className='flex w-[45%] cursor-pointer items-center gap-4 px-5 py-3'>
                                <img 
                                alt='course_img'
                                src={course.thubnail} 
                                className="h-14 w-14 rounded-lg object-cover"
                                />
                                <div className="flex max-w-xs flex-col gap-2">
                                    <p className="font-semibold uppercase tracking-wider">{course.courseName}</p>
                                    <ul style={{ listStyle: 'none', padding: 0 }} className="tracking-wider">
                                        {course.courseDescription.split('\n').splice(0, 1).map((line, index) => (
                                            <li key={index} style={{ display: 'flex', alignItems: 'flex-start' }} className="text-xs text-richblack-300">
                                            <span style={{ marginRight: '0.5em' }}>{index + 1}.</span>
                                            <span>{line.trim().substring(line.indexOf('.') + 1).trim().slice(0, 50)}{line.length > 50 ? '...' : ''}</span>
                                            </li>
                                        ))}
                                    </ul>                                
                                </div>
                            </div>

                            <div className="w-1/4 px-2 py-3 tracking-wider uppercase">
                                {course?.totalDuration}
                            </div>

                            <div className="flex w-1/5 flex-col gap-2 px-2 py-3 tracking-wider uppercase">
                                <p>Progress: {course.progressPercentage || 0}% </p>
                                <ProgressBar
                                completed={course.progressPercentage || 0}
                                height='8px'
                                isLabelVisible={false} 
                                />
                                

                            </div>

                        </div>
                    })
                }
            </div>
         )
      }
    </div>
  )
}

export default EnrolledCourses
