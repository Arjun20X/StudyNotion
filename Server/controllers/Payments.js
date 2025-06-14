const { instance } = require("../config/razorpay")
const Course = require("../models/Course")
const crypto = require("crypto")
const User = require("../models/User")
const mailSender = require("../utils/mailSender")
const mongoose = require("mongoose")
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail")
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail")
const CourseProgress = require("../models/CourseProgress")



exports.capturePayment = async(req,res) => {

  const {courses} = req.body;
  const userId = req.user.id;

  if(courses.length === 0){
    return res.json({success:false, message:"Please provide Course Id"});
  }

  let totalAmount = 0;
  
  for(const course_id of courses) {
    let course;
    try{
      course = await Course.findById(course_id);

      if(!course) {
        return res.status(200).json({success:false, message:"Could not find the course"});
      }

      const uid = mongoose.Types.ObjectId(userId);
      if(course.studentsEnrolled.includes(uid)){
        return res.status(200).json({success:false, message:"Student is already enrollled"})
      }

      totalAmount += course.price;

    }
    catch(error){
      console.log(error);
      return res.status(500).json({success:false, message:error.message})
    }
  }

  const options = {
    amount: totalAmount * 100,
    currency:"INR",
    receipt:Math.random(Date.now()).toString(),
  }

  try{
    const paymentResponse = await instance.orders.create(options);
    console.log("PAYMENT RESPONSE...",paymentResponse);
    res.json({
      success:true,
      data:paymentResponse,
    });
  }
  catch(error){
    console.log(error);
    return res.status(500).json({
      success:false,
      message:"Could not Initiate Order",
    })
  }

}


// Verify the paymemnt
exports.verifyPayment = async(req,res) => {

  const razorpay_order_id = req.body?.razorpay_order_id;
  const razorpay_payment_id = req.body?.razorpay_payment_id;
  const razorpay_signature = req.body?.razorpay_signature;
  const courses = req.body?.courses;
  const userId = req.user.id;

  if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId){
    return res.status(200).json({
      success:false,
      message:"Payment Failed",
    });
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
  .createHmac("sha256", process.env.RAZORPAY_SECRET)
  .update(body.toString())
  .digest("hex");

  if(expectedSignature === razorpay_signature){
    // enroll krwao user ko
    await enrollStudents(courses, userId, res);

    // return response
    return res.status(200).json({success:true, message:"Payment Verified"});
  }

  return res.status(200).json({success:false, message:"Payment Failed"});

};


// // Send Payment Success Email
exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body

  const userId = req.user.id

  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the details" })
  }

  try {
    // student ko dhundo
    const enrolledStudent = await User.findById(userId)

    await mailSender(
      enrolledStudent.email,
      `Payment Received`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        amount / 100,
        orderId,
        paymentId
      )
    );
  } 
  catch (error) {
    console.log("error in sending mail", error)
    return res
      .status(400)
      .json({ success: false, message: "Could not send email" })
  }
}


const enrollStudents = async(courses, userId, res) => {

  if(!courses || !userId){
    return res.status(400).json({
      success:false,
      message:"Please provide data for courses or userId"
    });
  }

  for(const courseId of courses) {
    try{
      // find the course and enroll the students in it
      const enrolledCourse = await Course.findOneAndUpdate(
        {_id:courseId},
        {$push:{studentsEnrolled:userId}},
        {new:true},
      )

      if(!enrolledCourse) {
        return res.status(500).json({
          success:false,
          message:"Course not found", 
        })
      }

      const courseProgress = await CourseProgress.create({
        courseId:courseId,
        userId:userId,
        completedVideos:[],
      })

      // find the students and ada the course to their list of enrolled Courses
      const enrolledStudent = await User.findByIdAndUpdate(userId,
        {$push:{
          courses: courseId,
          courseProgress:courseProgress._id,
        }},
        {new:true},
      );

      console.log("EROLLED STUDENT...", enrollStudent);

      // bache ko mail send krdo
      const emailResponse = await mailSender(
        enrollStudents.email,
        `Successfully Enrolled into ${enrolledCourse.courseName} `,
        courseEnrollmentEmail(enrolledCourse.courseName, `${enrolledStudent.firstName} ${enrolledStudent.lastName} `)
      )
      // console.log("Email sent successfully...",emailResponse.response);
    }
    catch(error){
      console.log(error);
      return res.status(500).json({
        success:false,
        message:error.message,
      });
    }
  }

};



// Capture the payment and initiate the Razorpay order
// exports.capturePayment = async (req, res) => {

//   // courseId and userId
//   const { course_id } = req.body;
//   const userId = req.user.id;

//   // VALIDATION
//   // valid courseID
//   if (!course_id) {
//     return res.json({ 
//       success: false, 
//       message: "Please Provide valid Course ID" ,
//     })
//   };

//   // let total_amount = 0

//   // for (const course_id of courses) {

//   // Valid Course Details
//     let course
//     try {
//       // Find the course by its ID
//       course = await Course.findById(course_id)

//       // If the course is not found, return an error
//       if (!course) {
//         return res.status(200).json({ 
//           success: false, 
//           message: "Could not find the Course" ,
//         });
//       }

//       // Check if the user is already enrolled in the course
//       const uid = mongoose.Types.ObjectId(userId);
//       if (course.studentsEnrolled.includes(uid)) {
//         return res.status(200).json({ 
//           success: false, 
//           message: "Student is already Enrolled" ,
//         });
//       }

//       // Add the price of the course to the total amount
//       // total_amount += course.price

//     } 
//     catch (error) {
//       console.error(error);
//       return res.status(500).json({ 
//         success: false, 
//         message: error.message ,
//       })
//     }
//   // }

//   // Order Create
//   const amount = course.price;
//   const currency = "INR";

//   const options = {
//     amount: amount * 100,
//     currency,
//     receipt: Math.random(Date.now()).toString(),
//     notes:{
//       courseId:course_id,
//       userId,
//     }
//   };

//   try {

//     // Initiate the payment using Razorpay
//     const paymentResponse = await instance.orders.create(options);
//     console.log(paymentResponse);
//     return res.json({
//       success: true,
//       courseName:course.courseName,
//       courseDescription:course.courseDescription,
//       thumbnail:course.thumbnail,
//       orderId:paymentResponse.id,
//       currency:paymentResponse.currency,
//       amount:paymentResponse.amount,
//     })
//   } 
//   catch (error) {
//     console.log(error)
//     res.status(500).json({ 
//       success: false, 
//       message: "Could not initiate order." ,
//     });
//   }
// }

// // verify the signature of razorpay and server
// exports.verifySignature = async (req, res) => {
  
//   // const razorpay_order_id = req.body?.razorpay_order_id
//   // const razorpay_payment_id = req.body?.razorpay_payment_id
//   // const razorpay_signature = req.body?.razorpay_signature
//   // const courses = req.body?.courses

//   // const userId = req.user.id

//   // if (
//   //   !razorpay_order_id ||
//   //   !razorpay_payment_id ||
//   //   !razorpay_signature ||
//   //   !courses ||
//   //   !userId
//   // ) {
//   //   return res.status(200).json({ success: false, message: "Payment Failed" })
//   // }

//   // let body = razorpay_order_id + "|" + razorpay_payment_id


//   const webhookSecret = "12345678";

//   const signature = req.headers["x-razorpay-signature"];

//   const shasum = crypto.createHmac("sha256", webhookSecret);
//   shasum.update(JSON.stringify(req.body));
//   const digest = shasum.digest("hex");

//   if(signature === digest){
//     console.log("Payement is authorized");

//     const {courseId, userId} = req.body.payload.payment.entity.notes;

//     try{
//       // fulfil the action

//       // find the course and enroll the student in it
//       const enrolledCourse = await Course.findByIdAndUpdate(
//                                        {_id: courseId},
//                                        {$push:{studentsEnrolled:userId}},
//                                        {new:true},
//       );

//       if(!enrolledCourse){
//         return res.statsu(500).json({
//           success:false,
//           message:'Course not found',
//         });
//       }

//       console.log(enrolledCourse);

//       // find the student and add the course to their list enrolled courses 
//       const enrolledStudent = await User.findByIdAndUpdate(
//                                       {_id:userId},
//                                       {$push:{courses:courseId}},
//                                       {new:true},
//       );

//       console.log(enrollStudents);

//       // mail send krdo confirmation wala
//       const emailResponse = await mailSender(
//                                 enrollStudents.email,
//                                 "Congratulation from CodeHelp",
//                                 "Congratulation, you are onboarded into new CodeHelp Course",
//       );

//       console.log(emailResponse);
//       return res.status(200).json({
//         success:true,
//         message:"Signature Verified and Course Added",
//       });

//     }
//     catch(error){
//       console.log(error);
//       return res.status(500).json({
//         success:true,
//         message:error.message,
//       });
//     }
//   }
//   else{
//     return res.status(400).json({
//       success:false,
//       message:'Invalid request',
//     });
//   }



//   // const expectedSignature = crypto
//   //   .createHmac("sha256", process.env.RAZORPAY_SECRET)
//   //   .update(body.toString())
//   //   .digest("hex")

//   // if (expectedSignature === razorpay_signature) {
//   //   await enrollStudents(courses, userId, res)
//   //   return res.status(200).json({ success: true, message: "Payment Verified" })
//   // }  

//   // return res.status(200).json({ success: false, message: "Payment Failed" })
// }



// enroll the student in the courses
// const enrollStudents = async (courses, userId, res) => {
//   if (!courses || !userId) {
//     return res
//       .status(400)
//       .json({ success: false, message: "Please Provide Course ID and User ID" })
//   }

//   for (const courseId of courses) {
//     try {
//       // Find the course and enroll the student in it
//       const enrolledCourse = await Course.findOneAndUpdate(
//         { _id: courseId },
//         { $push: { studentsEnroled: userId } },
//         { new: true }
//       )

//       if (!enrolledCourse) {
//         return res
//           .status(500)
//           .json({ success: false, error: "Course not found" })
//       }
//       console.log("Updated course: ", enrolledCourse)

//       const courseProgress = await CourseProgress.create({
//         courseID: courseId,
//         userId: userId,
//         completedVideos: [],
//       })
//       // Find the student and add the course to their list of enrolled courses
//       const enrolledStudent = await User.findByIdAndUpdate(
//         userId,
//         {
//           $push: {
//             courses: courseId,
//             courseProgress: courseProgress._id,
//           },
//         },
//         { new: true }
//       )

//       console.log("Enrolled student: ", enrolledStudent)
//       // Send an email notification to the enrolled student
//       const emailResponse = await mailSender(
//         enrolledStudent.email,
//         `Successfully Enrolled into ${enrolledCourse.courseName}`,
//         courseEnrollmentEmail(
//           enrolledCourse.courseName,
//           `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
//         )
//       )

//       console.log("Email sent successfully: ", emailResponse.response)
//     } catch (error) {
//       console.log(error)
//       return res.status(400).json({ success: false, error: error.message })
//     }
//   }
// }