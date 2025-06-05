import React from 'react'
import CTAButton from "../HomePage/Button"
import HighlightText from './HighlightText'
import { FaArrowRight } from 'react-icons/fa'
import { TypeAnimation } from 'react-type-animation'

const CodeBlocks = ({position,heading,subheading,ctabtn1,ctabtn2,codeblock,backgroundGradient, codeColor}) => {
  return (
    <div className={`flex ${position} my-20 justify-between flex-col lg:gap-10 gap-10`} >
      {/*Section 1 */}
      <div className='w-[100%] lg:w-[50%] flex flex-col gap-8 ' >
        {heading}
        {/* Sub Heading */}
        <div className='text-richblack-300 text-base font-bold w-[85%] -mt-3 ' >
          {subheading}
        </div>

        {/* Button Group */}
        <div className='flex gap-7 mt-7 ' >
            <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto} >
                <div className='flex gap-2 items-center' >
                    {ctabtn1.btnText}
                    <FaArrowRight/>
                </div>
            </CTAButton>


            <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto} >
                    {ctabtn2.btnText}
            </CTAButton>

        </div>

      </div>


    {/* Section-2 */}
    <div className='h-fit flex flex-row w-[100%] text-[15px]  py-2 lg:w-[500px] bg-opacity-50 backdrop-blur-sm bg-richblack-800 border-[2px] border-pure-greys-500 border-opacity-50' >
      {/* HW: Bg-Gradient */}

      <div className='text-center flex flex-col w-[10%] text-richblack-400 font-inter font-bold ' >
        <p>1</p>
        <p>2</p>
        <p>3</p>
        <p>4</p>
        <p>5</p>
        <p>6</p>
        <p>7</p>
        <p>8</p>
        <p>9</p>
        <p>10</p>
        <p>11</p>
        <p>12</p>
      </div>

      {/* Code */}
      <div className={` w-[90%] flex flex-col leading-[10.5px] gap-2 font-bold font-mono ${codeColor} pr-2 py-1 `} >
          <TypeAnimation
          sequence={[codeblock, 5000, ""]}
          repeat={Infinity}
          cursor={true}
          
          style={
            {
              whiteSpace:"pre-line",
              display:"block",
            }
          }
          omitDeletionAnimation={true}
          />
      </div>

    </div>


    </div>
  )
}

export default CodeBlocks
