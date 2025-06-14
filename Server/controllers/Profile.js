const Profile = require("../models/Profile");
const User = require("../models/User");
const Course = require("../models/Course");
const {uploadImageToCloudinary} = require("../utils/imageUploader");
const {convertSecondsToDuration} = require("../utils/secToDuration")
const CourseProgress = require("../models/CourseProgress")
const mongoose = require("mongoose");


require("dotenv").config();




// Method for updating a profile
exports.updateProfile = async (req, res) => {
  try {

    // fetch data
    const {
      firstName="",
      lastName="",
      dateOfBirth = "",
      about = "",
      contactNumber,
      gender,
    } = req.body;

    // get user id
    const id = req.user.id;

    // Validation
    if(!contactNumber || !gender || !id){
      return res.status(400).json({
        success:false,
        message:"All fields are requiired",
      });
    }

    // Find the profile by id
    const userDetails = await User.findById(id);
    // const profileId = userDetails.additionalDetails;
    const profile = await Profile.findById(userDetails.additionalDetails);

    const user = await User.findByIdAndUpdate(id,{
      firstName,
      lastName,
    });
    await user.save();

    // / Find the user and populate their profile details
    // const user = await User.findById(id).populate('additionalDetails');
    // const profileId = user.additionalDetails;

    // update profile
    // profileDetails.dateOfBirth = dateOfBirth;
    // profileDetails.about = about;
    // profileDetails.gender = gender;
    // profileDetails.contactNumber = contactNumber;
    // await profileDetails.save();

    // Update profile
    // const profile = await Profile.findById(profileId);
    profile.dateOfBirth = dateOfBirth;
    profile.about = about;
    profile.gender = gender;
    profile.contactNumber = contactNumber;

    // Save the updated profile
    await profile.save();

    const updatedUserDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();

      console.log("UPDATED USER DETAILS....", updatedUserDetails);

    // return response
    // return res.json({
    //   success: true,
    //   message: "Profile updated successfully",
    //   profileDetails,
    // })

    return res.json({
      success: true,
      message: "Profile updated successfully",
      updatedUserDetails,
    });

    

  } 
  catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

// delete account
exports.deleteAccount = async (req, res) => {
  try {
    // get id
    const id = req.user.id
    console.log(id)
     
    // validation
    const userDetails = await User.findById({_id:id}); // or only id in braket
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete Assosiated Profile with the User
    await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});

    // unenroll user from all enrolled courses
        
        const coursesEnrolled = userDetails.courses;

        // Unenroll the user from all courses
        await Promise.all(coursesEnrolled.map(async (courseId) => {
          await Course.updateOne({ _id: courseId }, { $pull: { studentsEnrolled: id } }, {new:true});
        }));
      
    // Now Delete User
    await User.findByIdAndDelete({ _id: id });

    // return response
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    })
  } 
  catch (error) {
    console.log(error)
    return res.status(500).json({ 
      success: false, 
      message: "User Cannot be deleted successfully", 
    })
  }

}

exports.getAllUserDetails = async (req, res) => {
  try {
    // get id
    const id = req.user.id

    // validate
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();

      console.log("USER DEATILS...",userDetails);

    return res.status(200).json({
      success: true,
      message: "User Data fetched successfully",
      data: userDetails,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture;
    const userId = req.user.id;

    function isFileTypeSupported(type,supportedTypes){
      return supportedTypes.includes(type); 
   }
  

    // validation //
    const supportedTypes = ["jpg","jpeg","png"];
    const fileType = displayPicture.name.split('.')[1].toLowerCase();
    console.log("File Type: ",fileType);

     // file format not supported //
     if(!isFileTypeSupported(fileType, supportedTypes)){
      return res.status(400).json({
          success:false,
          message:"File format not supported",
      })
   }
   // File format supported
   console.log("Uploading to StudyNotion");
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    );
    console.log(image)
    
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    )
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id
    let userDetails = await User.findOne({
      _id: userId,
    })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec()
    userDetails = userDetails.toObject()
    var SubsectionLength = 0
    for (var i = 0; i < userDetails.courses.length; i++) {
      let totalDurationInSeconds = 0
      SubsectionLength = 0
      for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
        totalDurationInSeconds += userDetails.courses[i].courseContent[
          j
        ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0);
        userDetails.courses[i].totalDuration = convertSecondsToDuration(
          totalDurationInSeconds
        )
        SubsectionLength +=
          userDetails.courses[i].courseContent[j].subSection.length
      }
      let courseProgressCount = await CourseProgress.findOne({
        courseID: userDetails.courses[i]._id,
        userId: userId,
      })
      courseProgressCount = courseProgressCount?.completedVideos.length
      if (SubsectionLength === 0) {
        userDetails.courses[i].progressPercentage = 100
      } else {
        // To make it up to 2 decimal point
        const multiplier = Math.pow(10, 2)
        userDetails.courses[i].progressPercentage =
          Math.round(
            (courseProgressCount / SubsectionLength) * 100 * multiplier
          ) / multiplier
      }
    }

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      })
    }
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.instructorDashboard = async (req, res) => {
  try {
    const courseDetails = await Course.find({ instructor: req.user.id })

    console.log("COURSE DEATILS.....",courseDetails);

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentsEnrolled.length;
      const totalAmountGenerated = totalStudentsEnrolled * course.price;

      // Create a new object with the additional fields
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        // Include other course properties as needed
        totalStudentsEnrolled,
        totalAmountGenerated,
      }

      return courseDataWithStats;
    })

    res.status(200).json({ courses: courseData })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
}