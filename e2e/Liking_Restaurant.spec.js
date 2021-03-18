/* eslint-disable no-undef */
const assert = require('assert')

Feature('Liking Restaurant')

Before(({ I }) => {
  I.amOnPage('/#/favorites')
})

Scenario('Show empty message on favorite page', ({ I }) => {
  const emptyMessageElement = '.content-container .empty-message.show'
  I.seeElement(emptyMessageElement)
  I.see('Daftar restoran favorit kosong', emptyMessageElement)
})

Scenario('Like and unlike a restaurant', async ({ I }) => {
  // Go to homepage and see list restaurant card
  I.amOnPage('/')
  I.seeElement('.list-restaurant .card')

  // Grab first card attribute and click it
  const listRestaurantCard = locate('.list-restaurant .card')
  const firstCard = listRestaurantCard.first()
  const firstCardAttr = await I.grabAttributeFrom(firstCard)
  I.click(firstCard)

  // Click favorite button to add favorite restaurant
  const favoriteBtn = '.restaurant-head .btn-favorite'
  I.seeElement(favoriteBtn)
  I.click(locate(favoriteBtn))

  // Go to favorite page and grab first card attribute
  I.amOnPage('/#/favorites')
  I.seeElement('.list-restaurant .card')
  const listFavoriteRestaurantCard = locate('.list-restaurant .card')
  const firstFavoriteCard = listFavoriteRestaurantCard.first()
  const firstFavoriteCardAttr = await I.grabAttributeFrom(firstFavoriteCard)

  // Check equality attribute from restaurant card
  assert.strictEqual(firstCardAttr, firstFavoriteCardAttr)

  // Click first favorite restaurant card and
  I.click(firstFavoriteCard)

  // Click favorite button to remove item from favorite db
  I.seeElement(locate(favoriteBtn))
  I.click(locate(favoriteBtn))

  // Click back button to back on list favorite restaurant page
  const backButton = '.restaurant-head .btn-back'
  I.seeElement(backButton)
  I.click(locate(backButton))

  // Check empty message to ensure favorite restaurant removed from favorite
  const emptyMessageElement = '.content-container .empty-message.show'
  I.seeElement(emptyMessageElement)
  I.see('Daftar restoran favorit kosong', emptyMessageElement)
})
