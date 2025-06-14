import React, { useState } from 'react'
import {logout} from "../../../Services/operations/authAPI"
import { useDispatch, useSelector } from 'react-redux'
import SidebarLink from './SidebarLink'
import {sidebarLinks} from "../../../data/dashboard-links"
import { useNavigate } from 'react-router-dom'
import { VscSignOut } from 'react-icons/vsc'
import ConfirmationModal from '../../Common/ConfirmationModal'


const Sidebar = () => {

    const {token} = useSelector((state) => state.auth);
    const {user, loading: profileLoading} = useSelector((state) => state.profile);
    const {loading: authLoading} = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [confirmationModal, setConfirmationModal] = useState(null);

    if(profileLoading || authLoading){
        return (
            <div className='mt-10' >
                Loading...
            </div>
        )
    }

  return (
    <div className='bg-richblack-800 '  >
        <div className='flex flex-col w-fit md:min-w-[220px] min-h-[calc(100vh-3.5rem)] border-r border-richblack-700 py-10' >

            <div className='flex flex-col ' >
                {
                    sidebarLinks.map((link,index) => {
                        if(link.type && user?.accountType !== link.type) return null;
                        return (
                            <SidebarLink key={link.id} link={link} iconName={link.icon} />
                        )
                    })
                }
            </div>

            <div className='mx-auto my-6 h-[1px] w-10/12 bg-richblack-700' ></div>

            <div className='flex flex-col' >
                <SidebarLink
                    link={{name:"Settings", path:"dashboard/settings"}}
                    iconName="VscSettingsGear"
                />

                <button
                    onClick={() => setConfirmationModal({
                        text1:"Are You Sure ?",
                        text2:"You will bw logged out of your Account",
                        btn1Text:"Logout",
                        btn2Text:"Cancel",
                        btn1Handler: () => dispatch(logout(navigate)),
                        btn2Handler: () => setConfirmationModal(null),

                    }) }
                    className='flex gap-x-2 items-center text-sm font-medium px-3 md:px-8 py-2 text-richblack-300'                >

                    <div className='flex items-center gap-x-2 ' >
                        <VscSignOut className ='text-lg'/>
                        <span className='hidden md:block tracking-wider uppercase'>Logout</span>
                    </div>

                </button>

            </div>

        </div>
        {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  )
}

export default Sidebar
