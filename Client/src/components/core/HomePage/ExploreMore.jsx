import React, { useState } from 'react'
import {HomePageExplore} from "../../../data/homepage-explore"
import HighlightText from "../../core/HomePage/HighlightText"
import CourseCard from './CourseCard';

const tabsName = [
    "Free",
    "New to coding",
    "Most popular",
    "Skill paths",
    "Career paths",
];

const ExploreMore = () => {

    const [currentTab, setCurrentTab] = useState(tabsName[0]);
    const [courses, setCourses] = useState(HomePageExplore[0].courses);
    const [currentCard, setCurrentCard] = useState(HomePageExplore[0].courses[0].heading);

    const setMyCards = (value) => {
      setCurrentTab(value);
      const result = HomePageExplore.filter((courses) => courses.tag === value);
      setCourses(result[0].courses);
      setCurrentCard(result[0].courses[0].heading);
    }

  return (
    <div>
      {/* Explore More Section */}
      <div className='text-4xl font-semibold text-center my-10 ' >
        Unlock the 
        <HighlightText text={"Power of Code"} />
      </div>

      <p className='text-center text-richblack-300 text-[17px] font-semibold mt-3' >
      Learn to Build Anything You Can Imagine
      </p>

      {/* Mobile tabs - horizontal scroll */}
      <div className="flex lg:hidden overflow-x-auto gap-2 -mt-5 mx-auto w-full pb-2 scrollbar-hide">
        {
          tabsName.map((element, index) => (
            <div
              className={`text-[14px] whitespace-nowrap flex-shrink-0 flex flex-row items-center gap-2 ${
                currentTab === element
                  ? "bg-richblack-900 text-richblack-5 font-medium"
                  : "text-richblack-200"
              } rounded-full transition-all duration-200 cursor-pointer bg-richblack-800 px-5 py-2`}
              key={index}
              onClick={() => setMyCards(element)}
            >
              {element}
            </div>
          ))
        }
      </div>

      {/* Desktop tabs */}
      <div className="hidden lg:flex gap-5 -mt-5 mx-auto w-max bg-richblack-800 text-richblack-200 p-1 rounded-full font-medium drop-shadow-[0_1.5px_rgba(255,255,255,0.25)]" >
        {
          tabsName.map((element, index) => {
            return (
              <div className={`text-[16px] flex flex-row items-center gap-2 ${currentTab === element ? "bg-richblack-900 text-richblack-5 font-medium" 
              : "text-richblack-200"} rounded-full transition-all duration-200 cursor-pointer hover:bg-richblack-900 hover:text-richblack-5 px-7 py-2 `}
              key={index} 
              onClick={() => setMyCards(element)} 
              >

                {element}

              </div>
            )
          })
        }
      </div>

      <div className="hidden lg:block lg:h-[200px]" ></div>

      {/* Course Card Div */}
      <div className="lg:absolute gap-6 lg:gap-0 justify-center flex lg:justify-between flex-wrap w-full lg:bottom-[0] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[50%] text-black mb-7 lg:mb-0 px-3 lg:px-0 mt-6 lg:mt-0" >
        {
          courses.map( (element,index) => {
            return (
              <CourseCard 
              key={index} 
              cardData = {element} 
              currentCard={currentCard} 
              setCurrentCard = {setCurrentCard} 
              />
            )
          })
        }
      </div>

    </div>
  )
}

export default ExploreMore;
