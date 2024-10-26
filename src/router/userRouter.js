import express from 'express'
import { findEmail, insertUser } from '../model/user/userModel.js';
import { compairPassword, hasPassword } from '../utilis/bcrypts.js';
import { signAccessToken, signRefreshJWT } from '../utilis/jwt.js';
import { auth } from '../middleware/auth.js';


const router = express.Router()

//user registration

router.post('/register',async(req,res)=>{
    try {
        const {email} = req.body
        const message = await findEmail({email});
        if (message?.email === email) {
            res.json({
              status: "error",
              message: "Email already exist. Please use another email",
            });
        }else{
            req.body.password = hasPassword(req.body.password);
            const result = await insertUser(req.body);
            result?._id
              ? res.json({
                  status: "success",
                  message: "Your new account has been created, You may login now",
                })
              : res.json({
                  status: "error",
                  message: "Unabel to process your request try again later",
                });
        }
        
    } catch (error) {
        console.log(error);
        
        
    }
})


//user login
router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      //get the user email and get user from db
      const user = await findEmail({email});
      console.log(user);
  
      if (user?._id) {
        //compare password
        const isMatched = compairPassword(password, user.password);
        user.password = undefined;
        if (isMatched) {
          //authorized
          return res.json({
            status: "success",
            message: "Logged in successfully",
            tokens: {
                accessJWT: signAccessToken({ email }),
                refreshJWT: signRefreshJWT(email),
              },
          });
        }
      }
  
      return res.json({
        status: "error",
        message: "Invalid login credentials",
      });
    } catch (error) {
      console.log(error);
      let code = 500;
  
      res.status(code).json({
        status: "error",
        message: error.message,
      });
    }
})


//get user profile
router.get("/profile", auth, async (req, res) => {
    try {
      req.userInfo.refreshJWT = undefined;
      req.userInfo._v = undefined;
      res.json({
        status: "success",
        message: "user profile",
        user: req.userInfo,
      });
    } catch (error) {
      console.log(error);
    }
  });


export default router