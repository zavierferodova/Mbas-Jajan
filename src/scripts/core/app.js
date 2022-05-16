import UrlParser from '../routes/url-parser'
import routes from '../routes/routes'
import Loading from '../views/loading'
import registerServiceWorker from '../worker/register-sw'

class App {
  start () {
    this._appInit()
  }

  _appInit () {
    window.addEventListener('DOMContentLoaded', () => {
      if (process.env.NODE_ENV === 'production') {
        registerServiceWorker()
      }
    })

    window.addEventListener('hashchange', () => {
      this._shellProcess()
    })

    window.addEventListener('load', () => {
      this._shellProcess()
    })
  }

  _shellProcess () {
    this._renderLoading()
    this._renderPage()
  }

  async _renderLoading () {
    const root = document.querySelector('#root')
    const loadingView = new Loading()

    root.innerHTML = await loadingView.render()
    await loadingView.afterRender()
  }

  async _renderPage () {
    const root = document.querySelector('#root')
    const url = UrlParser.parseActiveUrlWithCombiner()
    const page = routes[url]

    root.innerHTML = await page.render()
    await page.afterRender()
  }
}

export default App
