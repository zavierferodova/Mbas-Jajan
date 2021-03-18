import '../components/navbar'
import '../components/mobile-sidenav'
import 'lazysizes'
import 'lazysizes/plugins/parent-fit/ls.parent-fit'
import homeCSS from '../../styles/home.css'
import AppStyling from '../core/app-styling'
import CONFIG from '../constant/config'
import RestaurantSource from '../data/restaurant-source'

class Home {
  async render () {
    AppStyling.updateStyle(homeCSS)

    try {
      this._restaurantList = await RestaurantSource.restaurantList()
    } catch (error) {
      this._restaurantList = []
    }

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
                    <h1>Mari mencari !</h1>
                    <div class="list-restaurant">
                        ${this.renderRestaurant(this._restaurantList)}
                    </div>
                    <div class="error-message">
                        Masalah telah terjadi, silahkan refresh halaman !
                    </div>
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
    this.setActiveSidenavItem(1)
    if (this._restaurantList.length === 0) { this.showErrorMessage() }
  }

  setActiveSidenavItem (childPosition) {
    document.addEventListener('DOMContentLoaded', () => {
      const item = document.querySelector(`.sidenav .mobile-sidenav ul li:nth-child(${childPosition})`)
      item.classList.add('active')
    })
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
                <img class="lazyload" src="${CONFIG.IMAGE_URL_MED}${restaurant.pictureId}" alt="Resto atau Cafe ${restaurant.name} yang terletak di ${restaurant.city} dengan rating ${restaurant.rating.toString().replace('.', ',')}.">
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

  showErrorMessage () {
    const headingOne = document.querySelector('.content-container h1')
    const listRestaurant = document.querySelector('.content-container .list-restaurant')
    const errorMessage = document.querySelector('.content-container .error-message')
    headingOne.style.display = 'none'
    listRestaurant.style.display = 'none'
    errorMessage.classList.add('show')
  }
}

export default Home
