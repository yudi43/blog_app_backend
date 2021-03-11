import express from "express";
import Joi from "joi";
import User from "../models/user";
import { signIn } from "../validations/user";
import { SESS_NAME } from "../config";
import { parseError, sessionizeUser } from "../util/helpers";
import JWT from 'jsonwebtoken';
const sessionRouter = express.Router();

sessionRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    await Joi.validate({ email, password }, signIn);

    const user = await User.findOne({ email });
    if (user && user.comparePasswords(password)) {
      const sessionUser = sessionizeUser(user);
      req.session['user'] = {...sessionUser, _id: user._id};
      req.session.save();
      const token = JWT.sign(sessionUser, 'thisisaverylongsecret', { expiresIn: '5h' });
      console.log('Init New Session -> ', token);
      return res.status(200).json({token, ...sessionUser});
    } else {
      throw new Error('Invalid login credentials');
    }
  } catch (err) {
    return res.status(401).json(parseError(err));
  }
});

sessionRouter.delete("/logout", ({ session }, res) => {
  try {
    const user = session.user;
    if (user) {
      session.destroy(err => {
        if (err) throw (err);
        res.clearCookie(SESS_NAME);
        return res.json(user);
      });
    } else {
      throw new Error('Something went wrong');
    }
  } catch (err) {
    res.status(422).send(parseError(err));
  }
});

sessionRouter.get("/checkSession", (req, res) => {
  const { session } = req;
  const { user } = session;
  console.log('Validating User Session -> ', req.session);
  res.status(200).json({ user });
});

export default sessionRouter;
