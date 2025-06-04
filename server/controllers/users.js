import mongoose from "mongoose";
import User from "../models/user_model.js";
import bcrypt from "bcrypt"
import passport from "passport";
import initializePassport from "../passport-config.js"


initializePassport(
    passport,
    async email => User.findOne({email}),
    async id => User.findById({id})
)


const login = (req, res, next) => {
  // 1) Tell Passport to run its "local" strategy on this request,
  //    but give us a custom callback to handle the outcome:
  passport.authenticate('local', (err, user, info) => {
    
    // 2) Did something go wrong inside Passport itself?
    if (err) return next(err);              
    
    // 3) Did the credentials fail (wrong email/password)?
    //    In that case, `user` will be falsey, and `info.message`
    //    holds the "why" (e.g. "Password incorrect").
    if (!user) return res.status(401).json({ error: info.message });

    // 4) Credentials were valid! Now we ask Passport to
    //    "log in" this user—i.e. establish a session cookie.
    req.logIn(user, err => {
      if (err) return next(err);

      // 5) Finally, send back JSON with the user's basic info.
      //    This signals to the React front end "you're now logged in."
      return res.json({
        user: { id: user.id, name: user.name, email: user.email }
      });
    });

  // 6) Notice the extra `(req, res, next)` here—that actually
  //    invokes the middleware we just configured.
  })(req, res, next);
};


const signup = async (req, res) => {
    try {
        const existingUser = await User.findOne({email: req.body.email})
        if (existingUser) {
            return res.status(409).json({error: "A user with this email already exists."})
        }
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        const newUser = new User({ email: req.body.email, name: req.body.name, password: hashedPassword})
        await newUser.save()
        req.login(newUser, err => {
            if(err) return next(err);
            res.status(200).json({ user: { id: newUser.id, name: newUser.name, email: newUser.email } });
        });
    //     return res.json({
    //     user: { name: newUser.name, email: newUser.email }
    //   });
    } catch (err) {
        console.error(err)
    }
}

const updateProfilePicture = async (req, res) => {
    try {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const { profilePicture } = req.body;
        if (!profilePicture) {
            return res.status(400).json({ error: 'Profile picture URL is required' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { profilePicture },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating profile picture:', error);
        res.status(500).json({ error: 'Failed to update profile picture' });
    }
};

const updateDescription = async (req, res) => {
    try {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const { description } = req.body;
        
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { description },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating description:', error);
        res.status(500).json({ error: 'Failed to update description' });
    }
};

export {
    login,
    signup,
    updateProfilePicture,
    updateDescription
}

