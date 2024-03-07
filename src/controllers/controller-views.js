
import { ServiceViews } from '../service/service.views.js'
import jwt from 'jsonwebtoken'
import { sendEmail } from '../utils/mails.js'
import { createHash, verificar } from '../utils.js'

export class views {

    static async getViewsProduct(req, res) {
        let { usuario } = req.session
        let products = await ServiceViews.getService()
        let acceso

        if (usuario) {

            if (usuario.rol == "user") {
                acceso = true
            } else {
                acceso = false
            }

        }
        res.setHeader('content-type', 'text/html')
        res.status(200).render("home", { titulo: "home page", products, usuario, acceso })

    }
    static async chat(req, res) {
        let { usuario } = req.session
        let { rol } = req.session.usuario
        let acceso
        if (rol == "user") {
            acceso = true
        } else {
            acceso = false
        }

        console.log(acceso)
        res.status(200).render('chat', { acceso, usuario })

    }
    static async realtimeproducts(req, res) {

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


            let acceso
            if (usuario.rol == "user") {
                acceso = true
            } else {
                acceso = false
            }

            let products = await ServiceViews.servicePaginate(category, limit, page, sortValue)
            let { totalPages, hasNextPage, hasPrevPage, prevPage, nextPage } = products
            let onlyPruducts = products.docs
            let ruta = true
            res.status(200).render('product', { data: onlyPruducts, ruta, usuario, totalPages, hasNextPage, hasPrevPage, prevPage, nextPage, limit, acceso })

        } catch (error) {

            res.status(400).json("Error, no se pudo renderizar la pagina")

        }

    }
    static async getCart(req, res) {

        try {
            let { usuario } = req.session
            let cartId = req.session.usuario.cart
            let cart = await ServiceViews.servicePopulate(cartId, 'productCarts.productId')
            let ruta = true

            if (cartId == null || cartId == undefined) {

                cartId = 'El carrito esta vacio'
            }
            res.status(200).render('cart', { products: cart.productCarts, cart: cartId, ruta, usuario })
        } catch (error) {

            return console.log(error.message)

        }

    }

    //SESSIONS

    static async home(req, res) {

        let { usuario } = req.session
        let acceso
        if (usuario.rol == "user") {
            acceso = true
        } else {
            acceso = false
        }

        let products = ServiceViews.getService
        res.setHeader('content-type', 'text/html')
        res.status(200).render("home", { titulo: "home page", products, acceso })

    }
    static async registro(req, res) {

        let { error } = req.query

        res.setHeader('content-type', 'text/html')
        res.status(200).render('registro', { error })
    }
    static async perfil(req, res) {

        let { usuario } = req.session
        let acceso
        if (usuario.rol == "user") {
            acceso = true
        } else {
            acceso = false
        }
        res.setHeader('content-type', 'text/html')
        res.status(200).render('perfil', { usuario, acceso })

    }
    static async login(req, res) {

        let { mensaje } = req.query
        let { error } = req.query

        res.setHeader('content-type', 'text/html')
        res.status(200).render('login', { mensaje, error })

    }
    static async addProd(req, res) {

        let { error, mensaje } = req.query
        let { usuario } = req.session
        if (error) {
            req.logger.info(error.message)
        }
        res.setHeader('content-type', 'text/html')
        res.status(200).render('addProduct', { error, usuario, mensaje })

    }
    static async recupero(req, res) {

        res.status(200).render("recupero")
    }
    static async recuperotk(req, res) {

        let { email } = req.body
        let user = await ServiceViews.filterUser(email)
        let onlyUser = user[0]
        delete onlyUser.password
        let tk = jwt.sign({ ...onlyUser }, "coder24coder", { expiresIn: "1h" })

        let message = `Has solicitado restablecer tu contraseña, ingresa a el link <a href="http://localhost:8080/views/change?tk=${tk}">restablecer contraseña</a> para poder realizar la operacion.`

        let ask = await sendEmail(email, "Restablecer contraseña", message)

        if (ask.accepted.length > 0) {

            res.redirect("/views/login?mensaje=Se enviara un mail a su correo para restablecer su contraseña")

        } else {

            res.redirect("/views/login?error= No se ha podido realizar el restablecimiento de su contraseña, verifique email o intente mas tarde")
        }
    }
    static async change(req, res) {

        let { tk, error, mensaje } = req.query

        try {

            let dateTk = jwt.verify(tk, "coder24coder")

            res.render("reseteo", { tk: tk, error: error })

        } catch (error) {

            res.redirect("/views/login?error=Credenciales expiradas o invalidas")

        }
    }
    static async updatepass(req, res) {

        let { password, password2, token } = req.body

        let datos = jwt.verify(token, "coder24coder")
        let user = await ServiceViews.filterUser(datos.email)
        let objUser = user[0]

        if (password != password2) {

            let mensaje = "Las contraseñas no concuerdan , coloque contraseñas igual"
            return res.redirect(`/views/change?error=${mensaje}&tk=${token}`)

        }

        if (verificar(objUser, password)) {

            let mError ="Password ya utilizado en el pasado, elija uno nuevo"
            return res.redirect(`/views/change?error=${mError}&tk=${token}`)

        }

        password = createHash(password)
        let newPass = { ...objUser, password }
        
        try {
            await ServiceViews.passUpdate(newPass)
            res.redirect("/views/login?mensaje=Tu password fue restablecida con exito")
        } catch (error) {
            res.redirect("/views/login?error= Error inesperado, intente mas tarde")
        }
    }
} 
