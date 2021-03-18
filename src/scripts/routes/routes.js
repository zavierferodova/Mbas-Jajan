import Home from '../views/home'
import Detail from '../views/detail'
import Favorites from '../views/favorites'

const routes = {
  '/': new Home(),
  '/favorites': new Favorites(),
  '/detail/:id': new Detail()
}

export default routes
