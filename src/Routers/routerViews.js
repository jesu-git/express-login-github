
import __dirname from '../utils.js'
import { Router } from 'express'
export const router = Router()
import { views } from '../controllers/controller-views.js'


const auth = (req, res, next) => {

    if (!req.session.usuario) {

        return res.redirect('/views/login')

    }
    next()
}


router.get('/', views.getViewsProduct)
router.get("/chat",views.chat)
router.get('/realtimeproducts',views.realtimeproducts)
router.get("/products", views.productsV)
router.get("/cart/:cartId", views.getCart)

//SESSIONS

router.get('/home', views.home)
router.get('/registro', views.registro)
router.get('/perfil', auth, views.perfil)
router.get('/login', views.login)

