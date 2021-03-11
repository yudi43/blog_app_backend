import express from "express";
const router = new express.Router();
import { Controller } from "./blogsController";

router.post("/createBlog", Controller.createBlog);
router.get("/getAllBlogs", Controller.getAllBlogs);
router.post("/deleteBlog", Controller.deleteBlog);
router.post("/updateBlog", Controller.updateBlog);

export default router;
