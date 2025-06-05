import React, { useEffect, useState } from 'react'
import { VscAdd } from "react-icons/vsc"
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { fetchInstructorCourses } from '../../../Services/operations/courseDetailsAPI';
import CoursesTable from './InstructorCourses/CoursesTable';
import Iconbtn from '../../Common/Iconbtn';
import Spinner from "../../Common/Spinner"


const MyCourses = () => {

    const {token} = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCourses = async() => {
            setLoading(true);
            const result = await fetchInstructorCourses(token);
            console.log("PRINTING INSIDE COURSES", result);
            if(result){
                setCourses(result);
            }
            setLoading(false);
        }
        fetchCourses();
    },[token]) ;

   return (
     <div>
        <div  className='flex flex-col md:flex-row md:justify-between md:items-center mb-14 gap-y-5' >
            <h1 className='text-3xl font-medium text-richblack-5 lg:text-left text-center uppercase tracking-wider' >My Courses</h1>
            <div className='hidden md:block'>
                <Iconbtn
                    type='btn'
                    text="Add Courses"
                    onClick={() => navigate("/dashboard/add-course")}
                    customClasses="hidden md:block uppercase tracking-wider"
                >
                    <VscAdd />
                </Iconbtn>
            </div>
      </div>
        

      <div >
        {
          loading ?
            (
              <div>
                <Spinner />
              </div>
            )
            :
            !courses || courses.length === 0 ?
              (
                <div>
                  <div className='h-[1px] mb-10  mx-auto bg-richblack-500' ></div>
                  <p className='text-center text-2xl font-medium text-richblack-100 select-none' >No Courses Found</p>
                </div>
              )
              :
              <CoursesTable courses={courses} setCourses={setCourses} />
        }
      </div>
      
     </div>
   )
 }
 
 export default MyCourses
 