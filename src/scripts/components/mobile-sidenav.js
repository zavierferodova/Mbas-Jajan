import sidenavCss from '../../styles/components/mobile-sidenav.css'
import AppStyling from '../core/app-styling'

class Sidenav extends HTMLElement {
  connectedCallback () {
    this.init()
    this.render()
    setTimeout(this.sidenavListener, 100)
  }

  init () {
    this.classList.add('sidenav')
    this._sidenavItem = [
      {
        icon: 'home',
        title: 'Home',
        url: '/'
      },
      {
        icon: 'favorite',
        title: 'Favorites',
        url: '/#/favorites'
      },
      {
        icon: 'info',
        title: 'About',
        url: 'https://zavierferodova.github.io/'
      }
    ]
  }

  sidenavListener () {
    const mainPage = document.querySelector('.main-page')
    const toggleMobileSidenav = document.querySelector('.navbar .toggle-mobile-sidenav')
    const mobileSidenav = document.querySelector('.sidenav .mobile-sidenav')
    let isOpened = false

    const defaultState = () => {
      const mobileSidenavWidth = mobileSidenav.clientWidth
      const sidenavItems = document.querySelectorAll('li a')

      if (window.screen.width < 1280) { // State if screen size < 1280px
        isOpened = false
        mainPage.style.width = '100%'
        mainPage.style.marginLeft = '0'
        mainPage.style.transition = '0s'

        mobileSidenav.style.left = `-${mobileSidenavWidth}px`
        mobileSidenav.style.transition = '0s'

        sidenavItems.forEach((item) => {
          if (item.hasAttribute('tabindex')) { item.removeAttribute('tabindex') }
        })
      } else {
        isOpened = false
        mobileSidenav.style.left = `-${mobileSidenavWidth}px`
        mobileSidenav.style.transition = '0s'

        mainPage.style.width = '100%'
        mainPage.style.marginLeft = '0'
        mainPage.style.transition = '0s'

        sidenavItems.forEach((item) => {
          item.setAttribute('tabindex', '-1')
        })
      }
    }

    const toggleModal = () => {
      const mobileSidenavWidth = mobileSidenav.clientWidth

      /* Modal Closed */
      if (isOpened) {
        mainPage.style.marginLeft = '0'
        mainPage.style.transition = '0.8s'
        mobileSidenav.style.left = `-${mobileSidenavWidth}px`
        mobileSidenav.style.transition = '0.8s'
        isOpened = false
      } else {
        mainPage.style.marginLeft = `${mobileSidenavWidth}px`
        mainPage.style.transition = '0.8s'
        mobileSidenav.style.left = '0'
        mobileSidenav.style.transition = '0.8s'
        isOpened = true
      }
    }

    defaultState()

    window.addEventListener('resize', () => {
      defaultState()
    })

    toggleMobileSidenav.addEventListener('click', (event) => {
      toggleModal()
      event.stopPropagation()
    })
  }

  render () {
    AppStyling.appendStyle(sidenavCss)
    const renderItem = () => {
      let elements = ''
      this._sidenavItem.forEach((item) => {
        elements += `
          <li>
            <a href="${item.url}" aria-label="${item.title}">
              <i class="material-icons">${item.icon}</i>
              <span>${item.title}</span>
            </a>
          </li>`.trim()
      })

      return elements
    }

    this.innerHTML = `
      <div class="mobile-sidenav" aria-label="side navigation">
        <ul>
          ${renderItem()}
        </ul>
      </div>`
  }
}

customElements.define('mobile-sidenav', Sidenav)
