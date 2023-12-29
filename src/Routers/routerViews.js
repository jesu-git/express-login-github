import path from 'path'
import __dirname from '../utils.js'
import { Router } from 'express'
import { productModelo } from '../dao/models/productModelo.js'
import { ProductsMongo } from '../dao/managerProductsMongo.js'
export const router = Router()
import { io } from '../app.js'
import mongoose from 'mongoose'
import { CartModelo } from '../dao/models/cartsModelo.js'

const auth = (req, res, next) => {

    if (!req.session.usuario) {

        return res.redirect('/views/login')

    }
    next()
}
let mongo = new ProductsMongo()
let ruta = true


router.get('/', async (req, res) => {

    let products = await productModelo.find().lean()
    res.setHeader('content-type', 'text/html')
    res.status(200).render("home", { titulo: "home page", products })

})
router.get("/chat", (req, res) => {

    res.status(200).render('chat')

})
router.get('/realtimeproducts', async (req, res) => {

    let products = await mongo.getProduct()
    res.status(200).render('websocket', { products, titulo: "Web socket" })

})
router.get("/products", async (req, res) => {

    try {
        let { usuario } = req.session
       
        let { limit = 10, sort = {}, page = 1 } = req.query
        let sortValue = {}
        if (sort === "asc") {
            sortValue = { price: 1 };
        } else if (sort === "desc") {
            sortValue = { price: -1 }
        }


        let products = await productModelo.paginate({}, { limit: limit, page: page, sort: sortValue, lean: true })
        let { totalPages, hasNextPage, hasPrevPage, prevPage, nextPage } = products

        res.status(200).render('product', { data: products.docs, totalPages, hasNextPage, hasPrevPage, prevPage, nextPage, limit, page, sort, ruta, usuario })

    } catch (error) {

        res.status(400).json("Error, no se pudo renderizar la pagina")

    }

})
router.get("/cart/:cartId", async (req, res) => {
    try {
        let cartId = req.params.cartId
        let cart = await CartModelo.findById(cartId).populate('productCarts.productId').lean()

        res.status(200).render('cart', { products: cart.productCarts, cartId: '657901d1973ef35614b9b24f', ruta })
    } catch (error) {

    }




})

//SESSIONS

router.get('/home', async (req, res) => {

    let products = await productModelo.find().lean()
    res.setHeader('content-type', 'text/html')
    res.status(200).render("home", { titulo: "home page", products })

})
router.get('/registro', (req, res) => {

    let { error } = req.query

    res.setHeader('content-type', 'text/html')
    res.status(200).render('registro', { error})
})
router.get('/perfil', auth, (req, res) => {

    let usuario = req.session.usuario
    res.setHeader('content-type', 'text/html')
    res.status(200).render('perfil', { usuario})

})
router.get('/login', (req, res) => {

    let { mensaje } = req.query
    let { error } = req.query

    res.setHeader('content-type', 'text/html')
    res.status(200).render('login', { mensaje, error })

})

