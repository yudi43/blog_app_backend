const BlogModel = require("../../models/blogs");
const shortid = require("shortid");

const callbacks = {
  createBlog: async (req, res) => {
    const { title, content, pictureid, username } = req.body;
    const blogid = shortid.generate();
    const timestamp = new Date();
    console.log(req.body);
    try {
      const newblog = await BlogModel.create({
        blogid,
        title,
        content,
        pictureid,
        username,
        timestamp,
      });
    } catch (error) {
      console.log(error);
    }
    return res.json({
      message: "New blog created.",
    });
  },

  updateBlog: async (req, res) => {
    const { blogid, title, content, pictureid, username } = req.body;
    const timestamp = new Date();
    try {
      let doc = await BlogModel.findOneAndUpdate(
        { blogid: blogid },
        {
          blogid: blogid,
          title: title,
          content: content,
          pictureid: pictureid,
          username: username,
        }
      );
    } catch (error) {
      console.log(error);
    }
    return res.json({
      message: "Blog Updated.",
    });
  },

  getAllBlogs: async (req, res) => {
    const cursor = BlogModel.find().cursor();
    let result = [];
    for (
      let doc = await cursor.next();
      doc != null;
      doc = await cursor.next()
    ) {
      result.push(doc);
    }
    return res.json({
      result,
    });
  },

  deleteBlog: async (req, res) => {
    const { blogid } = req.body;
    try {
      let doc = await BlogModel.findOneAndDelete({ blogid: blogid });
    } catch (error) {
      console.log(error);
    }
    return res.json({
      message: "Blog deleted.",
    });
  },
};

export const Controller = callbacks;
