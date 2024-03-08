


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
router.get("/products", views.productsV)
router.get("/cart/:cartId", views.getCart)
router.get("/recupero",views.recupero)
router.post("/recuperoTk", views.recuperotk)
router.get("/change", views.change)
router.post("/update", views.updatepass)

//SESSIONS

router.get('/home', views.home)
router.get('/registro', views.registro)
router.get('/perfil', auth, views.perfil)
router.get('/login', views.login)
router.get('/createProduct',views.addProd,)
