const { Router, request } = require('express')
const Blog = require('../../models/part4/blog')
const User = require('../../models/part4/user')
const Comment = require('../../models/part7/comment')
const jwt = require('jsonwebtoken')
const config = require('../../config/config')
const { findById } = require('../../models/part4/blog')

const blogRouter = new Router()

const getAll = async (req, res, next) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1 })
    .populate('comments')
  res.json(blogs.map((blog) => blog.toJSON()))
}

const getById = async (req, res, next) => {
  const blog = await Blog.findOne({ _id: req.params.id })
  if (!blog) {
    return res.status(404).end()
  }
  return res.json(blog).end()
}

const addNew = async (req, res, next) => {
  const body = req.body
  const decodedToken = jwt.verify(req.token, config.SECRET)
  if (!req.token || !decodedToken.id) {
    return res.status(401).json({ Error: 'token missing on invalid' })
  } else {
    const user = await User.findById(decodedToken.id)
    if (!body.title || !body.url || !body.author) {
      res.status(400).json({ error: 'cannot send empty fields' }).end()
    } else {
      if (!body.likes) body.likes = 0

      const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user.id,
      })

      const addBlog = await blog.save()
      user.blogs = user.blogs.concat(addBlog._id)
      await user.save()

      await addBlog.populate('user', { username: 1, name: 1 }).execPopulate()
      res.json(addBlog.toJSON()).end()
    }
  }
}

const deleteById = async (req, res, next) => {
  if (!req.token) {
    return res.status(401).json({ Error: 'token missing or invalid' })
  }
  const decodedToken = jwt.verify(req.token, config.SECRET)

  const blog = await Blog.findById({ _id: req.params.id })

  if (blog.user.toString() !== decodedToken.id.toString()) {
    return res.status(401).json({ Error: 'premission denied' })
  }

  await Blog.findByIdAndRemove(req.params.id)
  res.status(204).end()
}

const updateById = async (req, res, next) => {
  const body = req.body
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }

  const updateBlog = await Blog.findByIdAndUpdate(
    { _id: req.params.id, new: true },
    blog
  )
  res.json(updateBlog.toJSON()).end()
}

const updateBlogComment = async (req, res, next) => {
  if (!req.token) {
    return res.status(401).json({ Error: 'token missing or invalid' })
  }
  const decodedToken = jwt.verify(req.token, config.SECRET)

  if (!decodedToken || !decodedToken.id) {
    return res.status(401).json({ Error: 'premission denied' })
  }

  const body = req.body
  const { id } = req.params

  console.log('this is body: ', body.comment)

  const blog = await Blog.findById(id)
  console.log('this is id: ', id)
  console.log('this is blog: ', blog)

  const comment = new Comment({
    comment: body.comment,
  })

  const saveComment = await comment.save()
  blog.comments = blog.comments.concat(saveComment._id)
  await blog.save()

  res.status(200).json(saveComment.toJSON()).end()
}

blogRouter.get('/blogs', getAll)
blogRouter.get('/blogs/:id', getById)
blogRouter.post('/blogs', addNew)
blogRouter.delete('/blogs/:id', deleteById)
blogRouter.put('/blogs/:id', updateById)
blogRouter.put('/blogs/:id/comments', updateBlogComment)

module.exports = blogRouter
