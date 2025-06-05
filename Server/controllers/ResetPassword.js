const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");


// resetPasswordToken // 
exports.resetPasswordToken = async(req,res) => {
 
    try{
            // get email from req body //
        const email = req.body.email;

        // check user for this email , email validation //
        const user = await User.findOne({email:email});
        if(!user){
            return res.json({
                success:false,
                message:'Your Email is not registered with us'
            });
        }

        // generate token 
        const token = crypto.randomUUID();

        // update user by adding token and expirartion time 
        const updatedDetails = await User.findOneAndUpdate(
            {email:email},
            {
                token:token,
                resetPasswordExpires:Date.now() + 5*60*1000,
            },
        {new:true});

        console.log("Deatils....", updatedDetails);

        // Create url 
        const url = `https://localhost:3000/update-password/${token}`;

        // send mail containing the url 
        await mailSender(email, "Password Reset Link",`Your Password Reset Link: ${url}`);

        // return response
        return res.json({
            success:true,
            message:'Email sent successfully. please check email and change password',
        });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'Something went wrong while sending reset password mail',
        })
    }
}

// Reset Password 

exports.resetPassword = async (req,res) => {

    try{
        // Data fetch
        const {password, confirmPassword, token} = req.body;

        // Validation
        if(password !== confirmPassword){
            return res.json({
                success:false,
                message:'Password not matched',
            });
        }

        // get user details from db using token
        const userDetails = await User.findOne({token:token});

        // if no entry - invalid token 
        if(!userDetails){
            return res.json({
                success:false,
                message:'Token Invalid',
            })
        }

        // token time check
        if(userDetails.resetPasswordExpires < Date.now() ){
            return res.status(403).json({
                success:false,
                message:'Token is expired, please regenerate your token',
        });
        }
        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // update password
        await User.findOneAndUpdate(
            {token:token},
            {password:hashedPassword},
            {new:true},
        );

        // return response
        return res.status(200).json({
            success:true,
            message:'Password Reset Successfully',
        });
    }
    catch(error){
        return res.status(500 ).json({
            success:false,
            message:'Password cannot be reset',
        })
    }

}