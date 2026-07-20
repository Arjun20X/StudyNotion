import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { changePassword } from "../../../../Services/operations/SettingsAPI"
import IconBtn from "../../../Common/Iconbtn"

export default function UpdatePassword() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const submitPasswordForm = async (data) => {
    // console.log("password Data - ", data)
    try {
      await changePassword(token, data)
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(submitPasswordForm)}>
        <div className='my-5 rounded-md border border-richblack-700 bg-richblack-800 p-8 px-12'>
          <h2 className='text-lg mb-6 font-semibold text-richblack-5 uppercase tracking-wider'>Password</h2>
          <div className='flex flex-col lg:flex-row gap-5'>
            <div className='relative flex flex-col gap-x-2 w-full'>
              <label htmlFor="oldPassword" className="lable-style uppercase tracking-wider mb-1">
                Current Password <span className='text-pink-100'>*</span>
              </label>
              <input
                type={showOldPassword ? "text" : "password"}
                name="oldPassword"
                id="oldPassword"
                placeholder="Enter Current Password"
                className="form-style  !pr-12 placeholder:uppercase placeholder:text-sm placeholder:tracking-wider'"
                {...register('oldPassword', {
                  required: {
                    value: true,
                    message: 'Please enter your New Password'
                  },
                  minLength: {
                    value: 6,
                    message: 'Invalid password'
                  }
                })}              
                />
              <span
                onClick={() => setShowOldPassword((prev) => !prev)}
                className="absolute right-3 top-[38px] z-[10] cursor-pointer"
              >
                {showOldPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
              {errors.oldPassword && (
                <span className="input-error-style -mt-1 text-[12px] text-yellow-100">
                  Please enter your Current Password.
                </span>
              )}
            </div>
            <div className="relative flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="newPassword" className="lable-style uppercase tracking-wider mb-1">
                New Password<sup className="text-pink-200" >*</sup>
              </label>
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                id="newPassword"
                placeholder="Enter New Password"
                className="form-style"
                {...register('newPassword', {
                  required: {
                    value: true,
                    message: 'Please enter your New Password'
                  },
                  minLength: {
                    value: 6,
                    message: 'Password length must be atleast 6'
                  }
                })}              
                />
              <span
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute right-3 top-[38px] z-[10] cursor-pointer"
              >
                {showNewPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
              {errors.newPassword && (
                <span className="input-error-style -mt-1 text-[12px] text-yellow-100">
                  Please enter your New Password.
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              navigate("/dashboard/my-profile")
            }}
            className={`rounded-md bg-richblack-700 lg:py-2 py-1 lg:px-5 px-2 font-semibold text-richblack-50 uppercase tracking-wider 
              ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}
              `}          
              >
            Cancel
          </button>
          <IconBtn 
          type="submit" 
          disabled={loading}
          customClasses={`${loading} lg:py-2 lg:px-5`}
          text={loading ? 'Updating...' : 'Update'}         
           />
        </div>
      </form>
    </>
  )
}