import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { GrCaretNext } from "react-icons/gr";
import Iconbtn from '../../../../Common/Iconbtn';
import { setCourse, setEditCourse, setStep } from '../../../../../slice/courseSlice';
import { updateSection, createSection } from '../../../../../Services/operations/courseDetailsAPI';
import NestedView from './NestedView';
import toast from 'react-hot-toast';



const CourseBuilderForm = () => {

  const {register, handleSubmit, setValue, formState:{errors}} = useForm();
  const [editSectionName, setEditSectionName] = useState(null);
  const {course} = useSelector((state) => state.course);
  const dispatch = useDispatch();
  const {token} = useSelector((state) => state.auth)
  const [loading,setLoading] = useState(false);

  useEffect(() => {
    console.log("EditSectionFlag...", editSectionName);
  },[course]);

  const onSubmit = async (data) => {
    setLoading(true);
    let result;

    if(editSectionName){
      // We are editing the section name
      result = await updateSection(
        {
          sectionName: data.sectionName,
          sectionId: editSectionName,
          courseId: course._id,
        },token
      )
    }
    else{
      result = await createSection({
        sectionName: data.sectionName,
        courseId: course._id,
      },token)
    }

    // update value
    if(result){
      dispatch(setCourse(result));
      setEditSectionName(null);
      setValue("sectionName", "");
    }

    // loading false
    setLoading(false);

  }

  const cancelEdit = () => {
    setEditSectionName(null);
    setValue("sectionName" , "");
  }

  const goBack = () => {
    dispatch(setStep(1));
    dispatch(setEditCourse(true));
  }

  const goToNext = () => {
    if(course?.courseContent?.length === 0) {
      toast.error("Please add atleast one section");
      return;
    }
    if(course.courseContent.some((section) => section.subSection.length === 0)){
      toast.error("Please add atleast one lecture in each section");
      return;
    }

    // if everything is good 
    dispatch(setStep(3));
  }

  const handleChangeEditSectionName = (sectionId, sectionName) => {

    if(editSectionName === sectionId){
      cancelEdit();
      return;
    }

    setEditSectionName(sectionId);
    setValue("sectionName", sectionName);
  }

  return (
    <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6" >
      <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor='sectionName' >Section Name<sup>*</sup></label>
          <input 
          id='sectionName'
          disabled={loading}
          placeholder='Add Section Name'
          {...register("sectionName", {required:true})}
          className='w-full form-style'
          />
          {errors.sectionName && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">Section Name is Required</span>
          )}
        </div>

        <div className="flex items-end gap-x-4">
          <Iconbtn
            type='Submit'
            disabled={loading}
            text={editSectionName ? "Edit Section Name" : "Create Section"}
            outline={true}
          >
            <MdOutlineAddCircleOutline className='text-yellow-50  ' size={20}  />
          </Iconbtn>
          {editSectionName && (
            <button
            type='button'
            onClick={cancelEdit}
            className='text-sm text-richblack-300 underline'
            >
              Cancel Edit
            </button>
          )}
        </div>

      </form>

      {course?.courseContent?.length > 0 && (
        <NestedView handleChangeEditSectionName={handleChangeEditSectionName} editSectionName={editSectionName} />
      )}

      <div className='flex justify-end gap-x-3 ' >
        <button
        onClick={goBack}
        className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
        >
          Back
        </button>
        <Iconbtn disabled={loading} text="Next" onClick={goToNext} >
          <GrCaretNext />
        </Iconbtn>
      </div>

    </div>
  )
}

export default CourseBuilderForm
