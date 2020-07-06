const dummy = (blogs) => 1;

const totalLikes = (blogs) => {
  return blogs.reduce((likes, blog) => (likes += blog.likes), 0);
};

const favoriteBlog = (blogs) => {
  if (!blogs.length) return null;

  let favorite = { ...blogs[0] };

  blogs.forEach((blog) => {
    if (favorite.likes < blog.likes) favorite = { ...blog };
  });

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  };
};

const mostBlogs = (blogs) => {
  if (!blogs.length) return null;

  let authors = [];
  let count = [];

  blogs.forEach((blog) => {
    if (authors.includes(blog.author)) {
      count[authors.indexOf(blog.author)] += 1;
    } else {
      authors.push(blog.author);
      count.push(1);
    }
  });

  let maxBlogs = Math.max(...count);
  let maxAuthor = authors[count.indexOf(maxBlogs)];

  return {
    author: maxAuthor,
    blogs: maxBlogs,
  };
};

const mostLikes = (blogs) => {
  if (!blogs.length) return 0;

  let authors = [];
  let count = [];

  blogs.forEach((blog) => {
    if (authors.includes(blog.author)) {
      count[authors.indexOf(blog.author)] += blog.likes;
    } else {
      authors.push(blog.author);
      count.push(blog.likes);
    }
  });

  const maxLikes = Math.max(...count);
  const maxAuthor = authors[count.indexOf(maxLikes)];

  return {
    author: maxAuthor,
    likes: maxLikes,
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
