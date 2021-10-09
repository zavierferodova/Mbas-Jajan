import 'lazysizes'
import 'lazysizes/plugins/parent-fit/ls.parent-fit'
import CONFIG from '../constant/config'
import UrlParser from '../routes/url-parser'
import RestaurantIDB from '../data/restaurant-idb'
import RestaurantSource from '../data/restaurant-source'
import AppStyling from '../core/app-styling'
import detailCSS from '../../styles/detail.css'

class Detail {
  async render () {
    let renderedElements = ''
    AppStyling.updateStyle(detailCSS)

    try {
      this._restaurantData = await this.fetchRestaurantDetail()
      renderedElements = this.MainContent()
    } catch (error) {
      this._restaurantData = null
      renderedElements = this.ErrorMessage()
    }

    return renderedElements
  }

  MainContent () {
    return `
      <div class="main-page">
        <main class="container">
            <div class="restaurant-head">
              <button class="btn-back" aria-label="Kembali">
                <span class="material-icons">arrow_back_ios_new</span>
              </button>
              <button class="btn-favorite" aria-label="Favorit">
                <span class="material-icons">favorite_border</span>
              </button>
              <img class="lazyload" data-src="${CONFIG.IMAGE_URL_LARG}${this._restaurantData.pictureId}" alt="${this._restaurantData.name}"/>
              <div class="bottom-wrapper">
                <div class="name">${this._restaurantData.name}</div>
                <div class="rating" aria-label="rating ${this._restaurantData.rating.toString().replace('.', ',')}">
                  <div class="rating-star">
                    ${this.RatingElement(this._restaurantData.rating)}
                  </div>
                  <div class="rating-score">${this._restaurantData.rating}</div>
                </div>
              </div>
            </div>
            <div class="resto-content restaurant-location">
              <div class="head">Lokasi</div>
              <div class="content">${this._restaurantData.address}, ${this._restaurantData.city}</div>
            </div>
            <div class="resto-content restaurant-categories">
              <div class="head">Kategori</div>
              <div class="content">
                <div class="category-list">
                  ${this.CategoryItems(this._restaurantData.categories)}
                </div>
              </div>
            </div>
            <div class="resto-content restaurant-description">
              <div class="head">Deskripsi</div>
              <p class="content">
                ${this._restaurantData.description}
              </p>
            </div>
            <div class="resto-content restaurant-menu">
              <div class="head-menu">
                <div class="half-divider"></div>
                <div class="text">Menu</div>
                <div class="half-divider"></div>
              </div>
              <div class="content menu-list">
                ${this.MenuItems(this._restaurantData.menus)}
              </div>
            </div>
            <div class="resto-content restaurant-review">
              <div class="head">Review</div>
              <div class="content">
                <div class="review-form">
                  <label for="input-customer-name">Nama</label>
                  <input id="input-customer-name" name="customer-name" type="text" placeholder="Tulis nama anda"/>
                  <label for="input-customer-review">Review</label>
                  <textarea id="input-customer-review" name="review-content" rows="10" placeholder="Tulis review disini" aria-label="Tulis review disini"></textarea>
                  <button class="btn-send">Kirim Review</button>
                </div>
                <div class="review-list">
                  ${this.CustomerReviewItems(this._restaurantData.customerReviews)}
                </div>
              </div>
            </div>
        </main>
      </div>
    `
  }

  ErrorMessage () {
    return `
      <div class="error-message">
        Masalah telah terjadi, silahkan refresh halaman !
      </div>
    `
  }

  async afterRender () {
    if (this._restaurantData != null) {
      this.btnBackClickListener()
      await this.btnFavoriteClickListener()
      await this.btnReviewClickListener()
    }
  }

  btnBackClickListener () {
    const btnBack = document.querySelector('.restaurant-head .btn-back')
    btnBack.onclick = () => { window.history.back() }
  }

  async btnFavoriteClickListener () {
    const url = UrlParser.parseActiveUrlWithoutCombiner()
    const restaurantId = url.id
    const btnFavorite = document.querySelector('.restaurant-head .btn-favorite')
    const favoriteIcon = btnFavorite.querySelector('.material-icons')
    const detailRestaurant = this._restaurantData

    const setFirstState = async () => {
      const favoriteRestaurant = await RestaurantIDB.getRestaurantById(restaurantId)

      if (favoriteRestaurant != null) {
        favoriteIcon.innerText = 'favorite'
        favoriteIcon.classList.add('active')
      }
    }
    await setFirstState()

    btnFavorite.onclick = async () => {
      const favoriteRestaurant = await RestaurantIDB.getRestaurantById(restaurantId)

      if (favoriteRestaurant != null) {
        favoriteIcon.innerText = 'favorite_border'
        favoriteIcon.classList.remove('active')
        await RestaurantIDB.deleteRestaurant(restaurantId)
      } else {
        favoriteIcon.innerText = 'favorite'
        favoriteIcon.classList.add('active')
        await RestaurantIDB.putRestaurant(detailRestaurant)
      }
    }
  }

  async btnReviewClickListener () {
    const url = UrlParser.parseActiveUrlWithoutCombiner()
    const restaurantId = url.id
    const btnSend = document.querySelector('.restaurant-review .review-form .btn-send')
    const inputName = document.querySelector('.restaurant-review .review-form input[name="customer-name"]')
    const inputReview = document.querySelector('.restaurant-review .review-form textarea[name="review-content"]')

    const checkNullInput = () => {
      let isNull = false
      if (inputName.value === '' || inputReview.value === '') isNull = true
      return isNull
    }

    const resetInputValue = () => {
      inputName.value = ''
      inputReview.value = ''
    }

    const sendReview = async () => {
      const reviewData = {
        id: restaurantId,
        name: inputName.value,
        review: inputReview.value
      }
      return await RestaurantSource.postReview(reviewData)
    }

    btnSend.onclick = async () => {
      if (checkNullInput()) {
        alert('Maaf input tidak boleh kosong !')
        return
      }

      this.renderCustomerReview(await sendReview())
      resetInputValue()
    }
  }

  async fetchRestaurantDetail () {
    const url = UrlParser.parseActiveUrlWithoutCombiner()
    const restaurantId = url.id
    const detailRestaurant = await RestaurantSource.detailRestaurant(restaurantId)
    return detailRestaurant
  }

  RatingElement (rating) {
    let ratingCeil = Math.ceil(rating)
    let ratingModulusRound = Math.round(rating % 1)
    let starElements = ''

    ratingCeil = (rating % 1 === 0.0) ? ratingCeil += 1.0 : ratingCeil

    for (let i = 0; i < 5; i++) {
      if (ratingCeil > 1.0) {
        starElements += '<span class="material-icons">star</span>'
        ratingCeil -= 1.0
      } else if (ratingModulusRound === 1.0) {
        starElements += '<span class="material-icons">star_half</span>'
        ratingModulusRound -= 1.0
      } else {
        starElements += '<span class="material-icons">star_outline</span>'
      }
    }

    return starElements
  }

  CategoryItems (categories) {
    let categoryElements = ''

    categories.forEach(category => {
      categoryElements += `
        <div class="category-item">
          ${category.name}
        </div>
      `
    })

    return categoryElements.trim()
  }

  MenuItems (menus) {
    const getItem = (items) => {
      let itemElement = ''

      items.forEach(item => {
        itemElement += `
          <li>
            ${item.name}
          </li>`
      })

      return itemElement
    }

    const elements = `
      <div>Makanan :</div>
      <ol>
        ${getItem(menus.foods)}
      </ol>
      <div>Minuman :</div>
      <ol>
        ${getItem(menus.drinks)}
      </ol>
    `

    return elements
  }

  CustomerReviewItems (reviews) {
    let elements = ''

    // Reverse array to get latest review message
    reviews.slice().reverse().forEach(reviewData => {
      elements += `
        <div class="review-item">
          <div class="name">
            <div style="display: hidden;" aria-label="Nama Pelanggan."></div>
            ${reviewData.name}
          </div>
          <div class="date">
            <div style="display: hidden;" aria-label="Waktu Review."></div>
            ${reviewData.date}
          </div>
          <div class="review">
            <div style="display: hidden;" aria-label="Isi Review."></div>
            ${reviewData.review}
          </div>
        </div>
      `
    })

    return elements
  }

  renderCustomerReview (reviews) {
    const reviewListContainer = document.querySelector('.restaurant-review .review-list')
    if (reviews != null) {
      reviewListContainer.innerHTML = this.CustomerReviewItems(reviews)
    }
  }
}

export default Detail
