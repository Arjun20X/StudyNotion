import React from 'react'
import Swiper from 'swiper'
import { SwiperSlide } from 'swiper/react'
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import { FreeMode, Autoplay, Pagination, Navigation } from 'swiper/modules'
import Course_Card from './Course_Card'

const CourseSlider = ({Courses}) => {
  return (
    <>
        {
            Courses?.length ? (
                <Swiper
                    slidesPerView={1}
                    loop={true}
                    spaceBetween={25}
                    modules={[Pagination, Autoplay, Navigation,FreeMode]}
                    className="mySwiper max-h-[30rem] "
                    autoplay={{
                        delay: 1000,
                        disableOnInteraction: false,
                    }}
                    breakpoints={{
                        1024:{slidesPerView:3}
                    }}
                >
                    {
                        Courses.map((course, index) => (
                            <SwiperSlide key={index} >
                                <Course_Card course={course} Height={"h-[250px]"} />
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            ) : (
                <p className="text-xl text-richblack-5"> No Course Found </p>
            )
        }
    </>
  )
}

export default CourseSlider
