import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getUserEnrolledCourses } from '../../../Services/operations/profileAPI'
import { formatDate } from '../../../Services/formatDate'
import Spinner from '../../Common/Spinner'
import { useNavigate } from 'react-router-dom'
import { FaCheckCircle } from 'react-icons/fa'

const PurchaseHistory = () => {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const [purchases, setPurchases] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      setLoading(true)
      try {
        const response = await getUserEnrolledCourses(token)
        setPurchases(response)
      } catch (error) {
        console.log("Could not fetch purchase history")
      }
      setLoading(false)
    }
    fetchPurchaseHistory()
  }, [token])

  if (loading) {
    return (
      <div className="grid min-h-[calc(100vh-12rem)] place-items-center">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-richblack-5 tracking-wider uppercase lg:text-left text-center">
        Purchase History
      </h1>

      {!purchases || purchases.length === 0 ? (
        <div className="my-10 flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-richblack-700 bg-richblack-800 p-8 text-center">
          <p className="text-xl font-medium text-richblack-200">
            You have no purchase history yet.
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
            <p className="w-[40%]">Course Name</p>
            <p className="w-[20%]">Date</p>
            <p className="w-[20%]">Amount</p>
            <p className="w-[20%] text-right">Status</p>
          </div>

          {/* Rows */}
          <div className="divide-y divide-richblack-700">
            {purchases.map((course, index) => {
              const firstSectionId = course?.courseContent?.[0]?._id
              const firstSubSectionId = course?.courseContent?.[0]?.subSection?.[0]?._id

              return (
                <div
                  key={index}
                  className="flex w-full items-center justify-between px-6 py-5 transition-all duration-200 hover:bg-richblack-700/30"
                >
                  {/* Course Info */}
                  <div className="flex w-[40%] items-center gap-4">
                    <img
                      src={course?.thumbnail || course?.thubnail}
                      alt={course?.courseName}
                      className="h-14 w-20 rounded-lg object-cover shadow-md"
                    />
                    <div className="flex flex-col gap-1 overflow-hidden">
                      <p
                        onClick={() => {
                          if (firstSectionId && firstSubSectionId) {
                            navigate(`/view-course/${course?._id}/section/${firstSectionId}/sub-section/${firstSubSectionId}`)
                          }
                        }}
                        className="font-semibold text-richblack-5 text-sm tracking-wide truncate cursor-pointer hover:text-yellow-50 transition-colors"
                      >
                        {course?.courseName}
                      </p>
                      <p className="text-xs text-richblack-300">
                        By {course?.instructor?.firstName} {course?.instructor?.lastName}
                      </p>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="w-[20%] text-sm text-richblack-200">
                    {formatDate(course?.createdAt || course?.updatedAt)}
                  </div>

                  {/* Amount */}
                  <div className="w-[20%] text-sm font-semibold text-yellow-50">
                    ₹{course?.price || 0}
                  </div>

                  {/* Status */}
                  <div className="w-[20%] flex justify-end">
                    <span className="flex items-center gap-1.5 rounded-full bg-caribbeangreen-900/30 px-3 py-1 text-xs font-medium text-caribbeangreen-200 border border-caribbeangreen-500/30">
                      <FaCheckCircle className="text-xs" />
                      Paid
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default PurchaseHistory
