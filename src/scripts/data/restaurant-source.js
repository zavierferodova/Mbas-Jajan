import API_ENDPOINT from '../constant/api-endpoint'
import CONFIG from '../constant/config'

class RestaurantSource {
  static async restaurantList () {
    const response = await fetch(API_ENDPOINT.LIST)
    const responseJSON = await response.json()
    return responseJSON.restaurants
  }

  static async detailRestaurant (id) {
    const response = await fetch(API_ENDPOINT.DETAIL(id))
    const responseJSON = await response.json()
    return responseJSON.restaurant
  }

  static async postReview (review) {
    const response = await fetch(API_ENDPOINT.REVIEW, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': CONFIG.API_KEY
      },
      body: JSON.stringify(review)
    })
    const responseJSON = await response.json()
    return responseJSON.customerReviews
  }

  static async searchRestaurant (query) {
    const response = await fetch(API_ENDPOINT.SEARCH(query))
    const responseJSON = await response.json()
    return responseJSON.restaurants
  }
}

export default RestaurantSource
