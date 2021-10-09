import CONFIG from '../constant/config'
import AppStyling from '../core/app-styling'
import RestaurantIDB from '../data/restaurant-idb'
import homeCSS from '../../styles/home.css'
import favoritesCSS from '../../styles/favorites.css'

class Favorites {
  async render () {
    AppStyling.updateStyle(homeCSS)
    AppStyling.appendStyle(favoritesCSS)

    return `
        <a href="#first-content" class="skip-content">Menuju ke konten</a>
        <mobile-sidenav></mobile-sidenav>
        <div class="main-page">
            <app-navbar title="MbasJajan" url="/"></app-navbar>
            <main class="container">
                <div class="jumbotron">
                    <div class="jumbotron-wrapper" id="first-content">
                        <div class="content">
                            <div class="welcome">Selamat Datang.</div>
                            <div class="short-desc">Ayo.. mulai pengalaman mencari cafe atau restoran pilihan dengan cepat dan nyaman</div>
                        </div>
                    </div>
                </div>
                <div class="content-container">
                    <h1>Restoran Favorit !</h1>
                    <div class="list-restaurant">
                        ${this.renderRestaurant(await RestaurantIDB.getAllRestaurant())}
                    </div>
                    <div class="empty-message">Daftar restoran favorit kosong</div>
                    <footer>
                        <span>MbasJajan</span> - Copyright &copy; 2020
                        <br>
                        by Zavier Ferodova A F 
                    </footer>
                </div>
            </main>
        </div>
    `
  }

  async afterRender () {
    const favoriteRestaurants = await RestaurantIDB.getAllRestaurant()
    if (favoriteRestaurants.length === 0) { this.showEmptyMessage() }
  }

  renderRestaurant (data) {
    let listElement = ''

    data.forEach(restaurant => {
      listElement += this.restaurantCard(restaurant)
    })

    return listElement
  }

  restaurantCard (restaurant) {
    return `
        <a href="/#/detail/${restaurant.id}" class="card">
            <div class="image">
                <img data-src="${CONFIG.IMAGE_URL_MED}${restaurant.pictureId}" alt="Resto atau Cafe ${restaurant.name} yang terletak di ${restaurant.city} dengan rating ${restaurant.rating.toString().replace('.', ',')}.">
            </div>
            <div aria-hidden="true" class="name">${restaurant.name}</div>
            <div aria-hidden="true" class="city-rating">
                <div class="rating">
                    <span class="material-icons">star_rate</span>
                    ${restaurant.rating}
                </div>
                <div class="city">
                    <span class="material-icons">location_on</span>
                    ${restaurant.city}
                </div>
            </div>
            <div class="description"><span aria-label="Deskripsi."></span>${restaurant.description}</div>
        </a>
    `
  }

  showEmptyMessage () {
    const headingOne = document.querySelector('.content-container h1')
    const listRestaurant = document.querySelector('.content-container .list-restaurant')
    const emptyMessage = document.querySelector('.content-container .empty-message')
    headingOne.style.display = 'none'
    listRestaurant.style.display = 'none'
    emptyMessage.classList.add('show')
  }
}

export default Favorites
