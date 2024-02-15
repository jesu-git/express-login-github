


import { Router } from 'express'
export const router = Router()
import { views } from '../controllers/controller-views.js'
import { authRol } from '../middlewares/checkRol.js'



const auth = (req, res, next) => {

    if (!req.session.usuario) {

        return res.redirect('/views/login')

    }
    next()
}

router.get('/', views.getViewsProduct)
router.get("/chat",authRol(['user']),views.chat)
router.get('/realtimeproducts',views.realtimeproducts)
router.get("/products",authRol(['user']), views.productsV)
router.get("/cart/:cartId", views.getCart)

//SESSIONS

router.get('/home', views.home)
router.get('/registro', views.registro)
router.get('/perfil', auth, views.perfil)
router.get('/login', views.login)

