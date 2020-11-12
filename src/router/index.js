import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  // { path: '/', redirect: '/Page' },
  {
    path: '*',
    component: () => import('../views/404.vue'),
  },
]

var context = require.context('../views', true, /.vue$/)
var paths = context.keys()
paths.forEach(item => {
  // ../views/{./item} => item: ./dir?/File.vue
  var route = item.match(/^\.(\/[^.]+)|$/)[1] // /File | /dir/File
  var dir = item.match(/^\.(\/[^/.]+)|$/)[1] // /dir

  var getComponent = async route => {
    return (
      (await import(`../views${route}.vue`).catch(e => {})) ||
      (await import(`../views${route}${route}.vue`).catch(e => {})) ||
      (await import(`../views${route}/App.vue`).catch(e => {})) ||
      (await import(`../views${route}/Index.vue`).catch(e => {})) ||
      (await import('../views/404.vue'))
    )
  }

  routes.unshift({
    path: route,
    component: () => getComponent(route),
  })
  if (dir !== route) {
    routes.unshift({
      path: dir,
      component: () => getComponent(dir),
    })
  }
})

const router = new VueRouter({
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { x: 0, y: 0 }
  },
})

export default router

// console
window.router = router
window.routes = routes
