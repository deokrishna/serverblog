import mongoose, { mongo } from 'mongoose';
import Blog from '../model/Blog';
import User from '../model/User';
export const getAllBlogs = async (req, res, next) => {
  let blogs;
  try {
    blogs = await Blog.find().populate('user');
  } catch (error) {
    console.log(err);
  }
  if (!blogs) {
    return res.status(404).json({ message: "No Blogs Found" });
  }
  return res.status(200).json({ blogs });
};
export const addBlog = async (req, res, next) => {
  const { title, description, image, user } = req.body;
  let existingUser;
  try {
    existingUser = await User.findById(user);
  } catch (err) {
    return console.log(err);
  }
  if (!existingUser) return res.status(400).json({ message: 'Unable to find user by the given id' })
  const blog = new Blog({
    title, 
    description, 
    image,
    user
  });
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await blog.save({ session });
    existingUser.blogs.push(blog);
    await existingUser.save({ session })
    await session.commitTransaction();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err });
  }
  return res.status(200).json({ blog });
}

export const updateBlog = async (req, res, next) => {
  const { title, description } = req.body;
  const blogId = req.params.id;
  let blog;
  try {
    blog = await Blog.findByIdAndUpdate(blogId, {
      title, description
    },
      { new: true })
  } catch (err) {
    return console.log(err);
  }
  if (!blog) {
    return res.status(500).json({ message: 'Unable to update the blog' })
  }
  return res.status(200).json({ blog });
}

export const getById = async (req, res, next) => {
  const blogId = req.params.id;
  let blog;
  try {
    blog = await Blog.findById(blogId);
  } catch (err) {
    return console.log(err);
  }
  if (!blog) return res.status(404).json({ message: 'Blog not found' });
  return res.status(200).json({ blog });
}
export const deleteBlog = async (req, res, next) => {
  const blogId = req.params.id;
  let blog;
  try {
    blog = await Blog.findByIdAndRemove(blogId).populate('user');
    await blog.user.blogs.pull(blog);
    await blog.user.save();
  } catch (err) {
    return console.log(err);
  }
  if (!blog) {
    return res.status(404).json({ message: 'Blog not found' });
  }
  return res.status(200).json({ message: 'Blog deleted successfully' });
}

export const getByUserId = async (req, res, next) => {
  const userId  = req.params.id;
  let userBlogs;
  try {
    userBlogs = await User.findById(userId).populate('blogs');
    if(!userBlogs) return res.status(404).json({message:'Blogs are empty'});
    return res.status(200).json({user:userBlogs} );
  } catch (error) {
    return console.log(err);
  }
};
