import React from 'react'
import { useSelector } from 'react-redux'
import Iconbtn from '../../../Common/Iconbtn'
import { buyCourse } from '../../../../Services/operations/studentFeaturesAPI'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const RenderTotalAmount = () => {

    const {user} = useSelector((state) => state.profile);
    const {token} = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    

    const {total, cart} = useSelector((state) => state.cart)

    const handleBuyCourse = () => {
        const courses = cart.map((course) => course._id);
        buyCourse(token, courses, user, navigate, dispatch)
    }

  return (
    <div className="min-w-[280px] rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="mb-1 text-sm font-medium text-richblack-300">Total:</p>
      <p className="mb-6 text-3xl font-medium text-yellow-100">Rs {total}</p>
      <Iconbtn
        text="Buy Now"
        onClick={handleBuyCourse}
        customClasses={"w-full justify-center"}
      />
    </div>
  )
}

export default RenderTotalAmount
