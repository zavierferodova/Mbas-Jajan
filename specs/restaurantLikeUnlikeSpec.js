/* eslint-disable no-undef */
import RestaurantIDB from '../src/scripts/data/restaurant-idb'
import restaurantSource from './utils/restaurantSource'

describe('Favorite restaurant like unlike test', () => {
  const dummyRestaurant = restaurantSource

  afterEach(async () => {
    const restaurants = await RestaurantIDB.getAllRestaurant()
    const promises = restaurants.map(restaurant => RestaurantIDB.deleteRestaurant(restaurant.id))
    await Promise.all(promises)
  })

  it("should throw error if property id doesn't exists when adding restaurant data", async () => {
    const testData = Object.assign({}, dummyRestaurant[0])
    const errorMessage = new Error("'Id' property does not exists !")
    let error
    delete testData.id

    try {
      await RestaurantIDB.putRestaurant(testData)
    } catch (e) {
      error = e
    }

    expect(error).toEqual(errorMessage)
  })

  it("should throw error if value of property 'id' is empty when adding restaurant data", async () => {
    const testData = Object.assign({}, dummyRestaurant[0])
    const errorMessage = new Error("Property id shouldn't be null !")
    let error
    testData.id = ''

    try {
      await RestaurantIDB.putRestaurant(testData)
    } catch (e) {
      error = e
    }

    expect(error).toEqual(errorMessage)
  })

  it('should return value of added restaurant data when getting it by the id', async () => {
    await RestaurantIDB.putRestaurant(dummyRestaurant[0])
    const favoriteRestaurant = await RestaurantIDB.getRestaurantById(dummyRestaurant[0].id)
    expect(favoriteRestaurant).toEqual(dummyRestaurant[0])
  })

  it('should throw error if getting restaurant data with empty id value', async () => {
    const errorMessage = new Error('Value id is null !')
    let error

    try {
      await RestaurantIDB.getRestaurantById(null)
    } catch (e) {
      error = e
    }

    expect(error).toEqual(errorMessage)
  })

  it('should throw error if delete data with empty id value', async () => {
    const errorMessage = new Error('Value id is null !')
    let error

    try {
      await RestaurantIDB.deleteRestaurant('')
    } catch (e) {
      error = e
    }

    expect(error).toEqual(errorMessage)
  })

  it("should return undefined if restaurant data with the id doesn't exists in idb", async () => {
    await RestaurantIDB.putRestaurant(dummyRestaurant[0])
    await RestaurantIDB.deleteRestaurant(dummyRestaurant[0].id)
    const favoriteRestaurant = await RestaurantIDB.getRestaurantById(dummyRestaurant[0].id)
    expect(favoriteRestaurant).toBeUndefined()
  })

  it('should return same restaurants data with added data', async () => {
    await RestaurantIDB.putRestaurant(dummyRestaurant[0])
    await RestaurantIDB.putRestaurant(dummyRestaurant[1])
    expect(await RestaurantIDB.getAllRestaurant()).toEqual([dummyRestaurant[1], dummyRestaurant[0]])
  })

  it('should return empty array if restaurants data is empty', async () => {
    await RestaurantIDB.putRestaurant(dummyRestaurant[0])
    await RestaurantIDB.putRestaurant(dummyRestaurant[1])
    await RestaurantIDB.deleteRestaurant(dummyRestaurant[0].id)
    await RestaurantIDB.deleteRestaurant(dummyRestaurant[1].id)
    expect(await RestaurantIDB.getAllRestaurant()).toEqual([])
  })
})
