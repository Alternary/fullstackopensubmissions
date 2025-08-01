const dummy = (blogs) => {
  return 1
}

const totalLikes = blogs => {
  return blogs.reduce((sum,blog) => sum+blog.likes,0)
}

const favoriteBlog = blogs => {
  return blogs.reduce(
    (mostLikedFoundBlog, nextBlog) =>
      mostLikedFoundBlog === null || mostLikedFoundBlog.likes < nextBlog.likes
      ? nextBlog : mostLikedFoundBlog,
    null)
}

const mostBlogs = blogs => {
  let authorInfo = []
  for (blog of blogs) {
    const authorIndex =
      authorInfo.findIndex(ai => ai.author === blog.author)
    if (authorIndex !== -1) {
      authorInfo[authorIndex].blogs += 1
    }
    else {
      authorInfo = authorInfo.concat({ author: blog.author, blogs: 1 })
    }
  }
  if (authorInfo.length === 0) {
    return null
  }
  else {
    return authorInfo.sort(
      (ai1, ai2) => ai2.blogs - ai1.blogs
    )[0]
  }
}

const mostLikes = blogs => {
  let authorInfo = []
  // console.log("in mostLikes")
  for (blog of blogs) {
    // console.log("blog is ", blog)
    const authorIndex =
      authorInfo.findIndex(ai => ai.author === blog.author)
    if (authorIndex !== -1) {
      authorInfo[authorIndex].likes += blog.likes
    }
    else {
      authorInfo = authorInfo.concat({ author: blog.author, likes: blog.likes })
    }
  }
  // console.log("authorInfo is ",authorInfo)
  if (authorInfo.length === 0) {
    return null
  }
  else {
    return authorInfo.sort(
      (ai1, ai2) => ai2.likes - ai1.likes
    )[0]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
