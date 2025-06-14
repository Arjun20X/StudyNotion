import React from 'react'
import Instructor from "../../../Assests/Images/Instructor.png"
import HighlightText from './HighlightText'
import { FaArrowRight } from 'react-icons/fa'
import CTAButton from "../HomePage/Button"

const InstructorSection = () => {
  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-20 items-center" >

        <div className='lg:w-[50%]' >
            <img 
            src={Instructor} 
            alt=''
             className='shadow-white shadow-[-20px_-20px_0_0] ' 
             />
        </div>

        <div className='lg:w-[50%] flex flex-col gap-10 '>

            <div className='text-4xl font-semibold lg:w-[50%] '>
                Become an 
                <HighlightText text={" Instructor"} />
            </div>

            <p className='font-medium text-[16px] text-justify w-[80%] text-richblack-300  ' >
            Instructors from around the world teach millions of students on StudyNotion. We provide the tools and skills to teach what you love.
            </p> 

            <div className='w-fit' >
                <CTAButton active={true} linkto={"/signup"} >
                    <div className='items-center flex flex-row gap-3 ' >
                        Start Learing Today 
                        <FaArrowRight/>
                    </div>
                </CTAButton>
            </div>

        </div>

      </div>
    </div>
  )
}

export default InstructorSection
