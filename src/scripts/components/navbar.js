import navbarCss from '../../styles/components/navbar.css'
import AppStyling from '../core/app-styling'

class Navbar extends HTMLElement {
  constructor () {
    super()
    this.initAttributes()
    document.addEventListener('DOMContentLoaded', this.simpleNavStateListener)
  }

  connectedCallback () {
    this.classList.add('navbar')
    this.render()
  }

  initAttributes () {
    this.props = {}
    this.props.title = this.getAttribute('title') || null
  }

  attributeChangedCallback (name, oldValue, newValue) {
    this.props[name] = newValue
    this.render()
  }

  simpleNavStateListener () {
    const defaultState = () => {
      const navItems = this.querySelectorAll('.simple-nav a')

      if (window.screen.width < 1280) { // State if screen size < 1280px
        navItems.forEach(item => {
          item.setAttribute('tabindex', '-1')
        })
      } else {
        navItems.forEach(item => {
          if (item.hasAttribute('tabindex')) { item.removeAttribute('tabindex') }
        })
      }
    }

    defaultState()

    window.addEventListener('resize', () => {
      defaultState()
    })
  }

  render () {
    AppStyling.appendStyle(navbarCss)
    this.innerHTML = `
            <button class="toggle-mobile-sidenav">
                <i class="material-icons">menu</i>
            </button>
            <div class="app-name">
                <a href="${this.props.url}">${this.props.title}</a>
            </div>
            <div class="simple-nav"> 
                <a href="/">Home</a>
                <a href="/#/favorites">Favorite</a>
                <a href="https://zavierferodova.github.io/">About</a>
            </div>
        `
  }

  static get observedAttributes () {
    return ['title', 'url']
  }
}

customElements.define('app-navbar', Navbar)
