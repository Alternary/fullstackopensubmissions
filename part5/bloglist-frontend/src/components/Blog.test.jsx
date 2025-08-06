import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    title: 'title100',
    author: 'author100',
    url: 'url100',
    likes: 100
  }

  render(
    <Blog blog={blog} />
  )

  // screen.debug()
  const authorAndTitleElement = screen.getByText('title100 author100')
  const urlElement = screen.queryByText('url100')
  const likesElement = screen.queryByText('likes 100')
  // screen.debug(authorAndTitleElement)
  expect(authorAndTitleElement).toBeDefined()
  expect(urlElement).toBeNull()
  expect(likesElement).toBeNull()
})

test('clicking the view button shows whole blog', async () => {
  const blog = {
    title: 'title100',
    author: 'author100',
    url: 'url100',
    likes: 100,
    user: 'root'
  }

  render(
    <Blog blog={blog} />
  )

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const authorAndTitleElement = screen.findByText('title100 author100')
  expect(authorAndTitleElement).toBeDefined()
  const urlElement = await screen.queryByText('url100')
  expect(urlElement).toBeDefined()
  const likesElement = await screen.queryByText('likes 100')
  expect(likesElement).toBeDefined()
  const userElement = await screen.queryByText('root')
  expect(userElement).toBeDefined()
})

// test('clicking the like button twice calls event handler twice', async () => {
//   const blog = {
//     title: 'title100',
//     author: 'author100',
//     url: 'url100',
//     likes: 100,
//     user: 'root'
//   }
//
//   const mockHandler = vi.fn()
//
//   render(
//     <Blog blog={blog} likeBlog={mockHandler} />
//   )
//
//   const user = userEvent.setup()
//   const viewButton = screen.getByText('view')
//   await user.click(viewButton)
//   const likeButton = screen.getByText('like')
//   await user.click(likeButton)
//   await user.click(likeButton)
//
//   expect(mockHandler.mock.calls).toHaveLength(2)
// })
