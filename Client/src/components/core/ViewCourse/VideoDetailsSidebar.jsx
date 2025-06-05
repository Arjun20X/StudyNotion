import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Iconbtn from '../../Common/Iconbtn';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { MdOutlineKeyboardArrowDown } from 'react-icons/md'
import { FaAngleDoubleRight } from 'react-icons/fa'

const VideoDetailsSidebar = ({setReviewModal}) => {

    const [activeStatus, setActiveStatus] = useState("");
    const [showSidebar, setShowSidebar] = useState(false);
    const [videobarActive, setVideoBarActive] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const {sectionId, subSectionId, courseId} = useParams();
    const{
        courseSectionData,
        courseEntireData,
        totalNoOfLectures,
        completedLectures,
    } = useSelector((state) => state.viewCourse);

    useEffect(() => {
        const setActiveFlag = () => {
            if(!courseSectionData.length){
                return;
            }
            const currentSectionIndex = courseSectionData.findIndex(
                (data) => data._id === sectionId
            );
            const currentSubSectionIndex = courseSectionData?.[currentSectionIndex]?.subSection.
            findIndex(
                (data) => data._id === subSectionId            
            )

            const activeSubSectionId = courseSectionData[currentSectionIndex]?.subSection?.
            [currentSubSectionIndex]?._id;
            
            // set current section here
            setActiveStatus(courseSectionData?.[currentSectionIndex]?._id);

            // set current subSection here
            setVideoBarActive(activeSubSectionId);
        }
        setActiveFlag();
    },[courseSectionData, courseEntireData, location.pathname])

    const handleAddReview = () => {
        console.log("I am inside add review");
        setReviewModal(true);
    }

  return (
    <>
        <div className='text-white' >
            {/* for buttonn and headings */}
            <div>
                {/* for buttons */}
                <div>
                    <div
                    onClick={() => {
                        navigate("/dashboard/enrolled-courses")
                    }}
                    >
                        Back
                    </div>

                    <Iconbtn 
                        text="Add Review"
                        onclick={() => handleAddReview()}
                    />
                    
                   
                </div>
                {/* for heading or title */}
                <div className='flex flex-col'>
                    <p>{courseEntireData?.courseName}</p>
                    <p className='text-sm font-semibold text-richblack-500'>{completedLectures?.length} / {totalNoOfLectures} </p>
                </div>
            </div>

            {/* For sections and subsections */}
            <div className='h-[calc(100vh - 5rem)] overflow-y-auto px-2'>
                {
                    courseSectionData.map((section, index) => {
                        <div
                        onClick={() => setActiveStatus(section?._id)}
                        key={index}
                        >

                            {/* Section */}
                            <div>
                                <div>
                                    {section?.sectionName}
                                </div>
                                {/* HW- Add arrow icon here and handle roate 180 logic */}
                                <MdOutlineKeyboardArrowDown className='arrow' />
                            </div>

                            {/* subSections */}
                            <div>
                                {
                                    activeStatus === section?._id && (
                                        <div>
                                            {
                                                section.subSection.map((topic, index) => {
                                                    <div
                                                    className={`flex gap-5 p-5 ${
                                                        videobarActive === topic._id 
                                                        ? "bg-yellow-200 text-richblack-900"
                                                        : "bg-richblack-900 text-white"
                                                    } `}
                                                    key={index}
                                                    onClick={() => {
                                                        navigate(
                                                            `/view-course/${courseEntireData?._id}/section/${section?._id}/sub-section/${topic?._id}`
                                                        )
                                                        setVideoBarActive(topic?._id);
                                                    }}
                                                    >
                                                        <input 
                                                            type='checkbox'
                                                            checked = {completedLectures.include(topic?._id)}
                                                            onChange={() => {}}
                                                        />
                                                        <span>
                                                            {topic.title}
                                                        </span>
                                                    </div>
                                                })
                                            }
                                        </div>
                                    )
                                }
                            </div>

                        </div>
                    })
                }
            </div>

        </div>
    </>
  )
}

export default VideoDetailsSidebar
