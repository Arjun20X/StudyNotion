import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';
import { addCourseDetails, editCourseDetails, fetchCourseCategories } from '.././../../../../Services/operations/courseDetailsAPI';
import { HiOutlineCurrencyRupee } from 'react-icons/hi';
import { MdNavigateNext } from "react-icons/md"
import RequirementField from './RequirementField';
import { setCourse, setStep } from '../../../../../slice/courseSlice';
import Iconbtn from '../../../../Common/Iconbtn';
import { COURSE_STATUS } from '../../../../../utils/constants';
import toast from 'react-hot-toast';
import Upload from '../Upload';
import ChipInput from './ChipInput';

const CourseInformationForm = () => {

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState:{errors},
    } = useForm();

    const dispatch = useDispatch();
    const {token} = useSelector((state)=>state.auth);
    const {course, editCourse} = useSelector((state)=>state.course);
    const [loading, setLoading] = useState(false);
    const [courseCategories, setCourseCategories] = useState([]);

    useEffect(()=> {
        const getCategories = async() => {
            setLoading(true);
            const categories = await fetchCourseCategories();
            if(categories.length > 0) {
                setCourseCategories(categories);
            }
            setLoading(false);
        }


        if(editCourse) {
            setValue("courseTitle", course.courseName);
            setValue("courseShortDesc", course.courseDescription);
            setValue("coursePrice", course.price);
            setValue("courseTags", course.tag);
            setValue("courseBenefits", course.whatYouWillLearn);
            setValue("courseCategory", course.category);
            setValue("courseRequirements", course.instructions);
            setValue("courseImage", course.thumbnail);
        }

        getCategories();
    },[])


    const isFormUpdated = () => {
        const currentValues = getValues();
        if(currentValues.courseTitle !== course.courseName ||
            currentValues.courseShortDesc !== course.courseDescription ||
            currentValues.coursePrice !== course.price ||
            currentValues.courseTags !== course.tag.toString() ||
            currentValues.courseBenefits !== course.whatYouWillLearn ||
            currentValues.courseCategory._id !== course.category._id ||
            currentValues.courseImage !== course.thumbnail ||
            currentValues.courseRequirements.toString() !== course.instructions.toString()) {
            return true;
        }
        else{
            return false ;
        }
    }


    // Handle Next button click
    const onSubmit = async(data) => {

        if(editCourse){
            if(isFormUpdated()){
                const currentValues = getValues();
                const formData = new FormData();

                formData.append("courseId", course._id);
                if(currentValues.courseTitle !== course.courseName){
                    formData.append('courseName', data.courseTitle);
                }

                if(currentValues.coursePrice !== course.price){
                    formData.append('price', data.coursePrice);
                }

                if(currentValues.courseShortDesc !== course.courseDescription){
                    formData.append('courseDescription', data.courseShortDesc);
                }

                if(currentValues.courseBenefits !== course.whatYouWillLearn ){
                    formData.append('whatYouWillLearn', data.courseBenefits);
                }

                if(currentValues.courseCategory._id !== course.category._id){
                    formData.append('category', data.courseCategory);
                }

                if(currentValues.courseRequirements.toString() !== course.insructions.toString()){
                    formData.append('instructions', JSON.stringify(data.courseRequirements));
                }
                if (currentValues.courseImage !== course.thumbnail) {
                    formData.append("thumbnailImage", data.courseImage)
                }

                setLoading(true);
                const result = await editCourseDetails(formData, token);
                setLoading(false);
                if(result){
                    dispatch(setStep(2));
                    dispatch(setCourse(result));
                }

        }
        else{
            toast.error("No chnges made to the form");
        }
        return;

        }


        // Create a new course 
        const formData = new FormData();
        formData.append("courseName", data.courseTitle);
        formData.append("courseDescription", data.courseShortDesc);
        formData.append("price", data.coursePrice);
        formData.append("tag", JSON.stringify(data.courseTags))
        formData.append("whatYouWillLearn", data.courseBenefits);
        formData.append("category", data.courseCategory);
        formData.append("instructions", JSON.stringify(data.courseRequirements));
        formData.append("status", COURSE_STATUS.DRAFT);
        formData.append("thumbnailImage", data.courseImage)

        setLoading(true);
        console.log("Before add course API call: ", formData);
        const result = await addCourseDetails(formData, token);
        if(result){
            dispatch(setStep(2));
            dispatch(setCourse(result));
        }
        setLoading(false);
        console.log("Printing FormData: ", formData);
        console.log("Printing Result: ",result);

    }



  return (
    <form
    onSubmit={handleSubmit(onSubmit)}
    className='space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6'
    >
        {/* Course Title */}
        <div className='flex flex-col space-y-2'>
            <label className='text-sm text-richblack-5 uppercase tracking-wider'  htmlFor='courseTitle'>Course Title<sup className='text-pink-200'>*</sup></label>
            <input
                id='courseTitle'
                placeholder='Enter Course Title'
                {...register("courseTitle", {required:true})}
                className='form-style w-full placeholder:uppercase placeholder:tracking-wider placeholder:text-sm'
            />
            {
                errors.courseTitle && (
                    <span className='ml-2 text-xs tracking-wide text-pink-200'>Course Title is Required**</span>
                )
            }
        </div>

            {/* Course Short Description */}
        <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5 uppercase tracking-wider" htmlFor='courseShortDesc' >Course Short Description<sup className="text-pink-200">*</sup></label>
            <textarea
                id='courseShortDesc'
                placeholder='Enter Description'
                {...register("courseShortDesc",{required:true})}
                className="form-style resize-x-none min-h-[130px] w-full placeholder:uppercase placeholder:tracking-wider placeholder:text-sm"
            />

            {
                errors.courseShortDesc && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">
                        Course Description is required<sup className="text-pink-200">**</sup>
                    </span>
                )
            }

        </div>

        {/* Course Price */}
        <div className='flex flex-col space-y-2 relative'>
            <label htmlFor='coursePrice' className='text-sm text-richblack-5 uppercase tracking-wider'  >Course Price<sup className='text-pink-200'>*</sup></label>
            <input
                id='coursePrice'
                placeholder='Enter Course Title'
                {...register("coursePrice", {required:true,valueAsNumber:true,pattern:{value: /^(0|{1-9]\d*)(\.\d+)?$/,},})}
                className="form-style w-full !pl-12 placeholder:uppercase placeholder:tracking-wider placeholder:text-sm"            />
            <HiOutlineCurrencyRupee className='absolute top-1/2 text-richblack-400' />
            {
                errors.coursePrice && (
                    <span className='ml-2 text-xs tracking-wide text-pink-200'>Course Price is Required**</span>
                )
            }
        </div>

        {/* Course Category */}
        <div className="flex flex-col space-y-2">
            <label htmlFor='courseCategory className="text-sm text-richblack-5 uppercase tracking-wider"' >Course Category<sup className='text-pink-200'>*</sup></label>
            <select
            id='courseCategory'
            defaultValue=""
            {...register("CourseCategory", {required:true})}
            className="form-style w-full uppercase tracking-wider"
            >
                <option value="" disabled >Choose a Category</option>

                {
                    !loading && courseCategories?.map((category,index) => (
                        <option key={index} value={category?._id} >
                            {category?.name}
                        </option>
                    ))
                }

                <option value="webdev" >Web dev</option>

            </select>
            {errors.courseCategory && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                    Course Category is Required
                </span>
            )}
        </div> 

        {/* Create a custom component for handeling tags input */}
        <ChipInput
            label="Tags"
            name="courseTags"
            placeholder="Enter tags and press enter"
            register={register}
            errors={errors}
            setValue={setValue}
            getValues={getValues}
        />

        {/* Create a component for uploading and showing preview of media */}
        <Upload
            name="courseImage"
            label="Course Thumbnail"
            register={register}
            errors={errors}
            setValue={setValue}
            editData={editCourse ? course?.thumbnail : null}
        />


        {/* Benefits of the course */}
        <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5 uppercase tracking-wider" htmlFor='courseBenefits' >Benefits of the Course<sup className='text-pink-200'>*</sup></label>
            <textarea
            id='courseBenefits'
            placeholder='Enter Benefits of the Course'
            {...register("courseBenefits", {required:true})}
            className="form-style resize-x-none min-h-[130px] w-full placeholder:uppercase placeholder:tracking-wider placeholder:text-sm"
            />
            {errors.courseBenefits && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                    Benefits of the Course is Required**
                </span>
            )}
        </div>

        {/* REquiremnets/Instructions */}
        <RequirementField
            name='courseRequirements'
            label="Requirements/Instructions"
            id='Requirements/Instructions'
            register={register}
            errors={errors}
            setValue={setValue}
            getValues={getValues}
        />

        {/* Next Butoon */}
        <div className="flex justify-end gap-x-2">
            {
                editCourse && (
                    <button
                    onClick={() => dispatch(setStep(2))}
                    disabled={loading}
                    className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
                    >
                        Continue Without Saving
                    </button>
                )
            }

            <Iconbtn  
                disabled={loading}
                text={!editCourse ? "Next" : "Save Changes"}
            >
                <MdNavigateNext />  
                
            </Iconbtn>

        </div>

    </form>
  )
}

export default CourseInformationForm