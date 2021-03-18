/* eslint-disable no-prototype-builtins */
import { openDB } from 'idb'
import CONFIG from '../constant/config'

const { DB_NAME, DB_VERSION, OBJECT_STORE_NAME } = CONFIG

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade (database) {
    database.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'id' })
  }
})

const RestaurantIDB = {
  async getRestaurantById (id) {
    if (!id) {
      throw new Error('Value id is null !')
    }

    return (await dbPromise).get(OBJECT_STORE_NAME, id)
  },
  async getAllRestaurant () {
    return (await dbPromise).getAll(OBJECT_STORE_NAME)
  },
  async putRestaurant (restaurant) {
    if (!restaurant.hasOwnProperty('id')) {
      throw new Error("'Id' property does not exists !")
    } else if (!restaurant.id) {
      throw new Error("Property id shouldn't be null !")
    }

    return (await dbPromise).put(OBJECT_STORE_NAME, restaurant)
  },
  async deleteRestaurant (id) {
    if (!id) {
      throw new Error('Value id is null !')
    }

    return (await dbPromise).delete(OBJECT_STORE_NAME, id)
  }
}

export default RestaurantIDB
