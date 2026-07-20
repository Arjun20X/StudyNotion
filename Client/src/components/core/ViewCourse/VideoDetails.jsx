import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import {updateCompletedLectures} from "../../../slice/viewCourseSlice";
import { CiPlay1 } from "react-icons/ci";
import { markLectureAsComplete} from "../../../Services/operations/courseDetailsAPI"
import Iconbtn from "../../Common/Iconbtn";
import "video-react/dist/video-react.css"
import { BigPlayButton, ControlBar, CurrentTimeDisplay, ForwardControl, LoadingSpinner, PlaybackRateMenuButton, Player, ReplayControl, TimeDivider } from "video-react"
import { BiSkipNextCircle, BiSkipPreviousCircle } from "react-icons/bi"
import { MdOutlineReplayCircleFilled } from "react-icons/md"


const VideoDetails = () => {

  const {courseId, sectionId, subSectionId} = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const playerRef = useRef();
  const {token} = useSelector((state) => state.auth);
  const {courseSectionData, courseEntireData, completedLectures} = useSelector((state) => state.viewCourse);

  const [videoData, setVideoData] = useState([]);
  const [videoEnded, setVideoEnded] = useState(false);
  const [loading , setLoading] = useState(false);
  const [previewSource, setPreviewSource] = useState("")


  useEffect (() => {

    const setVideoSpecificDetails = () => {
      if(!courseSectionData.length){
        return;
      }
      if(!courseId && !sectionId && !subSectionId){
        navigate("/dashboard/enrolled-courses");
      }
      else{
        // let's assume that all 3 fields are present

        const filteredData = courseSectionData.filter(
          (course) => course._id === sectionId
        )

        const filteredVideoData = filteredData?.[0].subSection.filter(
          (data) => data._id === subSectionId
        )

        setVideoData(filteredVideoData[0]);
        setPreviewSource(courseEntireData.thumbnail)
        setVideoEnded(false);

      }
    }

    setVideoSpecificDetails();

  },[courseSectionData, courseEntireData, location.pathname])


  const isFirstVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id  === sectionId   
    )

    const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
      (data) => data._id === subSectionId
    )
    if(currentSectionIndex === 0 && currentSubSectionIndex === 0){
      return true;
    }
    else{
      return false;
    }

  }

  const isLastVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id  === sectionId   
    )

    const noOfSubSections = courseSectionData[currentSectionIndex].subSection.length;

    const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
      (data) => data._id === subSectionId
    )

    if(currentSectionIndex === courseSectionData.length - 1 &&
      currentSubSectionIndex === noOfSubSections-1) {
        return true;
    }
    else{
      return false;
    }

  }

  const goToNextVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id  === sectionId 
    )

    const noOfSubSections = courseSectionData[currentSectionIndex].subSection.length;


    const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
      (data) => data._id === subSectionId
    )

    if(currentSubSectionIndex !== noOfSubSections - 1){
      // same section ki next wali video me jana h
      const nextSubSectionId = courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex + 1]._id;
      // is video pr jao
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`);
    }
    else{
      // different section ki first video
      const nextSectionId = courseSectionData[currentSectionIndex + 1]._id;
      const nextSubSectionId = courseSectionData[currentSectionIndex + 1].subSection[0]._id;
      // iss video pr jao
      navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`)
      }

  }

  const goToPreviousVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id  === sectionId   
    )

    const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
      (data) => data._id === subSectionId
    )

    if(currentSubSectionIndex != 0){
      // same section , previous video
      const prevSubSectionId = courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex - 1]._id;
      // is video pr jao
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`)

    }
    else{
      // different section last video
      const prevSectionId = courseSectionData[currentSectionIndex - 1]._id;
      const prevSubSectionLength = courseSectionData[currentSectionIndex - 1].subSection.length;
      const prevSubSectionId = courseSectionData[currentSectionIndex - 1].subSection[prevSubSectionLength - 1]._id;

      // iss video pr jao
      navigate(`/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`);
    }

  }

  const handleLectureCompletion = async() => {
    // dummy code, baad me we will replace it with the actual call
    setLoading(true);
    // Pending => Course Progress
    const res = await markLectureAsComplete({courseId: courseId, subSectionId: subSectionId }, token);

    // state update
    if(res){
      dispatch(updateCompletedLectures(subSectionId));
    }

    setLoading(false);

  }
  
  return (
    <div className='md:w-[calc(100vw-320px)] w-screen p-3'>
      {
        !videoData ? (
          <div>
            No data Found
          </div>
        ):(
          <Player
            ref = {playerRef}
            aspectRatio="16:9"
            fluid={true}
            autoPlay={false}
            onEnded={() => setVideoEnded(true)}
            src={videoData?.videoUrl}
          >
            <CiPlay1  />

            <LoadingSpinner />
                <ControlBar>
                  <PlaybackRateMenuButton rates={[5, 2, 1, 0.5, 0.1]} order={7.1} />
                  <ReplayControl seconds={5} order={7.1} />
                  <ForwardControl seconds={5} order={7.2} />
                  <TimeDivider order={4.2} />
                  <CurrentTimeDisplay order={4.1} />
                  <TimeDivider order={4.2} />
                  </ControlBar>
            {
              videoEnded && (
                <div className='flex justify-center items-center'>
                  !completedLectures.includes(subSectionId) && (
                    <Iconbtn 
                      disabled={loading}
                      onClick={() => handleLectureCompletion()}
                      text={!loading ? "Mark As Completed" : "Loading..."}
                      className='bg-yellow-100 text-richblack-900 absolute top-[20%] hover:scale-90 z-20 font-medium md:text-sm px-4 py-2 rounded-md'
                    />
                  )

                  <Iconbtn 
                    disabled={loading}
                    onClick={() => {
                      if(playerRef?.current){
                        playerRef.current?.seek(0);
                        setVideoEnded(false)
                      }
                    }}
                    text="Rewatch"
                    className='bg-yellow-100 text-richblack-900 absolute top-[20%] hover:scale-90 z-20 font-medium md:text-sm px-4 py-2 rounded-md'
                  />

                  <div>
                    {!isFirstVideo() && (
                      <button
                        disabled={loading}
                        onClick={goToPreviousVideo}
                        className='blackButton'
                      >
                        Prev
                      </button>
                    )}
                    {!isLastVideo() && (
                      <button
                        disabled={loading}
                        onClick={goToNextVideo}
                        className='blackButton'
                      >
                        Next
                      </button>
                    )}
                  </div>

                </div>
              )
            }

          </Player>
        )
      }
      <h1 className='text-2xl font-bold text-richblack-25'>
        {videoData?.title}
      </h1>
      <p className='text-gray-500 text-richblack-100'>
        {videoData?.description}
      </p>
    </div>
  )
}

export default VideoDetails
