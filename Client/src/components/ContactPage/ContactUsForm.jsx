import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { apiconnector } from '../../Services/apiconnector';
import { contactusEndpoint } from '../../Services/apis';
import CountryCode from "../../data/countrycode.json"

const ContactUsForm = () => {

    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitSuccessful}
    } = useForm();

    const submitContactForm = async(data) => {
        console.log("Logging Data", data);
        try{
            setLoading(true);
            // const response = await apiconnector("POST",contactusEndpoint.CONTACT_US_API,data);
            const response = {status:"OK"};
            console.log("Logging Response  ",response)
            setLoading(false);
        }
        catch(error){
            console.log("Error ",error.message);
            setLoading(false);
        }
    }

    useEffect(() => {
        if(isSubmitSuccessful){
            reset({
                email:"",
                firstName:"",
                lastName:"",
                message:"",
                phoneNo:"",
            })
        }
    },[isSubmitSuccessful,reset]);

  return (
    <form onSubmit={handleSubmit(submitContactForm)} >

        <div className='flex flex-col gap-14' >

            <div className='flex gap-5' >
                {/* firstName */}
                <div className='flex flex-col ' >
                    <label htmlFor='firstName' >First Name</label>
                    <input
                        type='text'
                        name='firstName'
                        id='firstName'
                        placeholder='Enter First Name'
                        className='text-black '
                        {...register("firstName", {required:true})}
                    />
                    {
                        errors.firstName && (
                            <span>
                                Please Enter Your Name
                            </span>
                        )
                    }
                </div>

                {/* lastName */}
                <div className='flex flex-col ' >
                    <label htmlFor='lastName' >Last Name</label>
                    <input
                        type='text'
                        name='lastName'
                        id='lastName'
                        placeholder='Enter Last Name'
                        className='text-black '
                        {...register("lastName")}
                    />
                    
                </div>

            </div>

            {/* Email */}
            <div className='flex flex-col ' >
                <label htmlFor='email' >Email Address</label>
                <input
                    type='email'
                    name='email'
                    id='email'
                    placeholder='Enter Email Address'
                    className='text-black '
                    {...register("email", {required:true})}
                />
                {
                    errors.email && (
                        <span>
                            Please Enter Your Email Address
                        </span>
                    )
                }
            </div>

            {/* Phone Number */}
            <div className='flex flex-col gap-2' >

                <label htmlFor='phonenumber' >Phone Number</label>

                <div className='flex flex-row gap-5 ' >
                    {/* Drop Down */}
                    <div>
                        <select 
                            className='bg-richblack-600 w-[80px] '
                            name='dropdown'
                            id='dropdown'
                            {...register("countrycode",{required:true})}
                        >
                            {
                                CountryCode.map((element, index) => {
                                    return (
                                        <option key={index} value={element.code} >
                                            {element.code} -{element.country}
                                        </option>
                                    )
                                })
                            }
                        </select>
                    </div>

                    <div>
                        <input
                            type='number'
                            name='phonenumber'
                            id='phonenumber'
                            placeholder='12345 67890'
                            className='text-black'
                            {...register("phoneNo", {
                                required:{value:true, messgae:"Please Enter Phone Number"}, 
                                maxLength:{value:10, message:"Invalid Phone Number"},
                                minLength:{value:8, message:"Invalid Phone Number"} })}
                        />
                    </div>

                </div>
                {
                    errors.phoneNo && (
                        <span>
                            {errors.phoneNo.message}
                        </span>
                    )
                }

            </div>

            {/* Message Box */}
            <div className='flex flex-col' >
                <label htmlFor='message' >Message</label>
                <textarea
                    name='message'
                    id='message'
                    cols="30"
                    rows="7"
                    placeholder='Enter Your Message Here'
                    className='text-black '
                    {...register("message", {required:true})}
                />
                {
                    errors.message && (
                        <span>
                            Please Enter Your Message
                        </span>
                    )
                }
            </div>

            <button type='submit'
            className='rounded-md bg-yellow-50 text-center px-6 text-[16px] font-bold text-black '
            >
                    Send Message
            </button>

        </div>

    </form>
  )
}

export default ContactUsForm
