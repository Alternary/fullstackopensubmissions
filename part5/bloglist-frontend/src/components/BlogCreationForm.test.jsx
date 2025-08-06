import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import BlogCreationForm from './BlogCreationForm'
import userEvent from '@testing-library/user-event'

test('<BlogCreationForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const setBlogs = vi.fn()
  const setNotification = vi.fn()
  const handleBlogCreation = vi.fn()

  render(<BlogCreationForm setBlogs={setBlogs} setNotification={setNotification} />)

  const titleInput = screen.getByTestId('title')
  const authorInput = screen.getByTestId('author')
  const urlInput = screen.getByTestId('url')
  const sendButton = screen.getByText('create')

  await user.type(titleInput, 'typing input')
  await user.type(authorInput, 'typing author')
  await user.type(urlInput, 'typing url')
  await user.click(sendButton)
  console.log('here is calls ', handleBlogCreation.mock.calls)
  console.log('here is calls ', setBlogs.mock.calls)
  console.log('here is calls ', setNotification.mock.calls)

  expect(setBlogs.mock.calls).toHaveLength(1)
  console.log('here is content ', setBlogs.mock.calls[0][0].content)
  // expect(setBlogs.mock.calls[0][0].content).toBe('testing a form...')
})
