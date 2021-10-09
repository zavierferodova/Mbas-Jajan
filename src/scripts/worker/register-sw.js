import { Workbox } from 'workbox-window'

function registerServiceWorker () {
  if ('serviceWorker' in navigator) {
    const appServiceWorker = new Workbox('/service-worker.js')
    appServiceWorker.addEventListener('installed', event => {
      if (event.isUpdate) {
        alert('New update is available. Click OK to apply !')
        window.location.reload()
      }
    })

    appServiceWorker.register()
  } else { console.log("This browser doesn't support service worker") }
}

export default registerServiceWorker
