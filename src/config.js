export const {
  PORT = process.env.PORT || 5000,
  NODE_ENV = "development",
  MONGO_URI = process.env.MONGODB_URI ||
    "mongodb+srv://test:admin_pass@cluster0.xal6e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  SESS_NAME = "sid",
  SESS_SECRET = "secret!session",
  SESS_LIFETIME = 1000 * 60 * 60 * 2,
} = process.env;
