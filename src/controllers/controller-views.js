
import { ServiceViews } from '../service/service.views.js'


export class views { 

static async getViewsProduct(req, res) {
    let usuario = req.session.usuario
    let products = await ServiceViews.getService()
    res.setHeader('content-type', 'text/html')
    res.status(200).render("home", { titulo: "home page", products ,usuario})

}
static async chat(req, res)  {

    res.status(200).render('chat')

}
static async realtimeproducts (req, res){

    let products = ServiceViews.getService
    res.status(200).render('websocket', { products, titulo: "Web socket" })

}
static async productsV(req, res) {

    try {
        
        let { usuario } = req.session
        let { limit = 10, sort = {}, page = 1 } = req.query
        let sortValue = {}
        if (sort === "asc") {
            sortValue = { price: 1 };
        } else if (sort === "desc") {
            sortValue = { price: -1 }
        }
        let { category } = req.query

        if (category == undefined || null) {
            category = {}
        } else {

            category = { category: category }
        }


        let products = await ServiceViews.servicePaginate(category, limit, page, sortValue)
        let { totalPages, hasNextPage, hasPrevPage, prevPage, nextPage } = products
        let onlyPruducts = products.docs
        let ruta = true
        res.status(200).render('product', { data: onlyPruducts,ruta,usuario, totalPages, hasNextPage, hasPrevPage, prevPage, nextPage,limit})

    } catch (error) {

        res.status(400).json("Error, no se pudo renderizar la pagina")

    }

}
static async getCart(req, res) {

    try {
        let {usuario} = req.session
        let cartId = req.session.usuario.cart
        let cart = await ServiceViews.servicePopulate(cartId,'productCarts.productId')
        let ruta = true
        
        if(cartId == null || cartId == undefined){

            cartId = 'El carrito esta vacio'
        }
        res.status(200).render('cart', { products: cart.productCarts, cart: cartId, ruta ,usuario})
    } catch (error) {

        return console.log(error.message)

    }

}

//SESSIONS

static async home(req, res) {

    let products = ServiceViews.getService
    res.setHeader('content-type', 'text/html')
    res.status(200).render("home", { titulo: "home page", products })

}
static async registro(req, res) {

    let { error } = req.query

    res.setHeader('content-type', 'text/html')
    res.status(200).render('registro', { error})
}
static async perfil (req, res)  {

    let {usuario} = req.session
    res.setHeader('content-type', 'text/html')
    res.status(200).render('perfil', {usuario})

}
static async login (req, res) {

    let { mensaje } = req.query
    let { error } = req.query

    res.setHeader('content-type', 'text/html')
    res.status(200).render('login', { mensaje, error })

}

}   