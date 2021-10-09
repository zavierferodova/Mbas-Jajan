/* eslint-disable no-useless-escape */
/* eslint-disable prefer-regex-literals */
import 'regenerator-runtime'
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { StaleWhileRevalidate, CacheFirst } from 'workbox-strategies'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { ExpirationPlugin } from 'workbox-expiration'
import { skipWaiting, clientsClaim, setCacheNameDetails } from 'workbox-core'

skipWaiting()
clientsClaim()
setCacheNameDetails({
  prefix: 'mbas-jajan-v1.0',
  precache: 'precache',
  runtime: 'runtime'
})

precacheAndRoute([...self.__WB_MANIFEST], { ignoreURLParametersMatching: [/.*/] })

// Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
registerRoute(
  ({ url }) => url.origin === 'https://fonts.googleapis.com',
  new StaleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets'
  })
)

// Cache the underlying font files with a cache-first strategy for 30 days.
registerRoute(
  ({ url }) => url.origin === 'https://fonts.gstatic.com',
  new CacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 30 * 60 * 60 * 24, // 30 Days
        maxEntries: 30
      })
    ]
  })
)

registerRoute(
  new RegExp('https:\/\/restaurant-api\.dicoding\.dev\/(?:(list|detail))\/'),
  new StaleWhileRevalidate({
    cacheName: 'api-resources',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 3 * 24 * 60 * 60 // 3 Days
      })
    ]
  })
)

registerRoute(
  new RegExp('https:\/\/restaurant-api\.dicoding\.dev\/images\/'),
  new CacheFirst({
    cacheName: 'image-resources',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 14 * 24 * 60 * 60 // 3 Days
      })
    ]
  })
)

cleanupOutdatedCaches()
