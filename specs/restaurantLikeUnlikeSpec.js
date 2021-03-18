/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import RestaurantIDB from '../src/scripts/data/restaurant-idb'
import restaurantSource from './utils/restaurantSource'

describe('Favorite restaurant test', () => {
  const dummyRestaurant = restaurantSource

  it("should fail if property id doesn't exists when adding data", async () => {
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

  it("should fail if property 'id' has empty when adding data", async () => {
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

  it('should return added restaurant data when get by id', async () => {
    await RestaurantIDB.putRestaurant(dummyRestaurant[0])
    const favoriteRestaurant = await RestaurantIDB.getRestaurantById(dummyRestaurant[0].id)
    expect(favoriteRestaurant).toEqual(dummyRestaurant[0])
  })

  it('should failed if get restaurant with null id value', async () => {
    const errorMessage = new Error('Value id is null !')
    let error

    try {
      const favoriteRestaurant = await RestaurantIDB.getRestaurantById('')
    } catch (e) {
      error = e
    }

    expect(error).toEqual(errorMessage)
  })

  it('should failed if delete data with empty id', async () => {
    const errorMessage = new Error('Value id is null !')
    let error

    try {
      await RestaurantIDB.deleteRestaurant('')
    } catch (e) {
      error = e
    }

    expect(error).toEqual(errorMessage)
  })

  it("should return undefined if restaurant id doesn't exists in idb", async () => {
    await RestaurantIDB.putRestaurant(dummyRestaurant[0])
    await RestaurantIDB.deleteRestaurant(dummyRestaurant[0].id)
    const favoriteRestaurant = await RestaurantIDB.getRestaurantById(dummyRestaurant[0].id)
    expect(favoriteRestaurant).toBeUndefined()
  })

  it('should return same data with added data', async () => {
    await RestaurantIDB.putRestaurant(dummyRestaurant[0])
    await RestaurantIDB.putRestaurant(dummyRestaurant[1])
    expect(await RestaurantIDB.getAllRestaurant()).toEqual([dummyRestaurant[1], dummyRestaurant[0]])
  })

  it('should return empty array if idb data is empty', async () => {
    await RestaurantIDB.putRestaurant(dummyRestaurant[0])
    await RestaurantIDB.putRestaurant(dummyRestaurant[1])
    await RestaurantIDB.deleteRestaurant(dummyRestaurant[0].id)
    await RestaurantIDB.deleteRestaurant(dummyRestaurant[1].id)
    expect(await RestaurantIDB.getAllRestaurant()).toEqual([])
  })
})
