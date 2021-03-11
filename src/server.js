import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import connectStore from "connect-mongo";
import cors from 'cors'
import shortid from 'shortid';
import cookieParser from 'cookie-parser';
import JWT from 'jsonwebtoken';
import User from './models/user';
import { userRoutes, sessionRoutes } from "./routes/index";
const blogRoutes = require("./routes/blogs/index");

import {
  PORT,
  NODE_ENV,
  MONGO_URI,
  SESS_NAME,
  SESS_SECRET,
  SESS_LIFETIME,
} from "./config";

(async () => {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true });
    console.log("MongoDB connected");

    const app = express();
    app.use(cors({
      origin: 'http://localhost:3000',
      credentials: true
    }));
    app.use(cookieParser());
    // app.disable("x-powered-by");

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    const MongoStore = connectStore(session);

    function genuuid(){
      return shortid.generate();
    }
    app.use(
      session({
        genid: function(req) {
          return genuuid() // use UUIDs for session IDs
        },
        name: SESS_NAME,
        secret: SESS_SECRET,
        store: new MongoStore({
          mongooseConnection: mongoose.connection,
          collection: "session",
          ttl: parseInt(SESS_LIFETIME),
        }),
        saveUninitialized: false,
        resave: true,
        cookie: {
          expires: new Date(Date.now() + 30*60*60*24*1000),
          sameSite: true,
          httpOnly: true,
          secure: false
        },
      })
    );
    
    const authMiddleware = (req, res, next) => {
      console.log('Headers -> ', req.headers);
      let token = req.headers['authorization'].split(' ')[1]; // Bearer token
      console.log('FoundToken -> ', token);
      JWT.verify(token, 'thisisaverylongsecret', function(err, decoded) {
        const {_id} = decoded;
        User.findById(_id).then(foundUser => {
          req['user'] = foundUser;
          next();
        }).catch(err => res.status(500).json({message: 'Internal Server Error', err}));
      });
    }

    const apiRouter = express.Router();
    app.use("/api", apiRouter);
    app.use("/uploadImage", express.static("uploads"));
    apiRouter.use("/users", userRoutes);
    apiRouter.use("/session", sessionRoutes);
    app.use("/blogs", authMiddleware, blogRoutes);

    app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
  } catch (err) {
    console.log(err);
  }
})();
