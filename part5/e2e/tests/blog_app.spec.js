const { test, describe, expect, beforeEach } = require('@playwright/test')

//need to run the start:test scripts of frontend and backend when running these tests
describe('Blog app, initializing with one user', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'root',
        username: 'root',
        password: 'root'
      }
    })

    await page.goto('http://localhost:5173')
  })

  describe('log in tests when there is one user', () => {
    test('login form is shown when opened', async ({ page }) => {
      await page.getByRole('button', { name: 'log in' }).click()
      expect(page.getByTestId('username')).toBeVisible()
      expect(page.getByTestId('password')).toBeVisible()
    })

    test('invalid credentials don\'t login', async ({ page }) => {
      await page.getByRole('button', { name: 'log in' }).click()

      await page.getByTestId('username').fill('nonexistingusername')
      await page.getByTestId('password').fill('nonexistingpassword')

      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('logged in', { exact: false })).not.toBeVisible()
    })

    test('valid credentials log in', async ({ page }) => {
      await page.getByRole('button', { name: 'log in' }).click()
      // await page.getByTestId('username').first().fill('newuser')
      // await page.getByTestId('password').last().fill('test123')
      await page.getByTestId('username').fill('root')
      await page.getByTestId('password').fill('root')

      await page.getByRole('button', { name: 'login' }).click()
      // await page.getByRole('button', { name: 'cancel' }).click()

      await expect(page.getByText('root logged in')).toBeVisible()
    })
  })

  describe('blog managing tests when a user is logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'log in' }).click()
      await page.getByTestId('username').first().fill('root')
      await page.getByTestId('password').last().fill('root')

      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('root logged in')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByTestId('title').fill('title1')
      await page.getByTestId('author').fill('author1')
      await page.getByTestId('url').fill('url1')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.getByText('title1 author1')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      //add blog before liking it
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByTestId('title').fill('title1')
      await page.getByTestId('author').fill('author1')
      await page.getByTestId('url').fill('url1')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.getByText('title1 author1')).toBeVisible()

      //like blog
      await page.getByRole('button', { name: 'view' }).first().click()
      await expect(page.getByText('likes 0')).toBeVisible()
      await page.getByRole('button', { name: 'like' }).first().click()
      await expect(page.getByText('likes 1')).toBeVisible()
    })
  })
})
