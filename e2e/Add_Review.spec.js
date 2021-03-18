/* eslint-disable promise/param-names */
/* eslint-disable no-undef */
const assert = require('assert')

Feature('Give a review for restaurant')

Scenario('Customer give a review', async ({ I }) => {
  // Go to home page
  I.amOnPage('/')

  // See list restaurant card element and click first of it
  const restaurantCard = '.list-restaurant .card'
  I.seeElement(restaurantCard)
  I.click(locate(restaurantCard).first())

  // Fill customer name and review
  const customerName = 'Bot'
  const customerReview = 'Nice...'
  I.seeElement('.restaurant-review .review-form')
  I.fillField('#input-customer-name', customerName)
  I.fillField('#input-customer-review', customerReview)
  I.click(locate('.review-form .btn-send'))

  // Waiting for response from POST review request
  I.waitForResponse(response => response.url() === 'https://restaurant-api.dicoding.dev/review/' && response.request().method() === 'POST')

  // See review item then grab first value of reviewer name and review content
  I.seeElement('.restaurant-review .review-item')
  const firstReviewItem = locate('.restaurant-review .review-item').first()
  const reviewerName = await I.grabTextFrom(firstReviewItem.find('.name'))
  const reviewerContent = await I.grabTextFrom(firstReviewItem.find('.review'))

  // Check equality typed value from keyboard with value from displayed element
  assert.strictEqual(customerName, reviewerName)
  assert.strictEqual(customerReview, reviewerContent)
})
