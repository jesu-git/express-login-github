
import { ServiceCart } from '../service/service.carts.js'

export class ControllerCart {

    static async cartId(req, res) {

        let { id } = req.params
        let respuesta = await ServiceCart.servicePopulate(id, 'productCarts.productId')

        if (!respuesta || respuesta == null) return res.status(400).json("El carrito no fue encontrado")
        else { res.status(200).json(respuesta) }

    }
    static async create_cart(req, res) {

        let create = await ServiceCart.serviceCreateCart()
        if (!create) return res.status(400).json("Error de creacion de carrito")
        console.log(create)
        return res.status(200).json(`Creacion exitosa!! El id de su carrito es: ${create}`)

    }
    static async addProduct(req, res) {

        let { id } = req.params
        let { product } = req.params

        let respuesta = await ServiceCart.serviceAddP(id, product)
        console.log(respuesta)

        if (!respuesta || respuesta == null) return res.status(400).json("Error a cargar el producto, error en valores id")
        else {

            return res.status(200).json("Tu producto ha sido agregado con exito")

        }

    }
    static async productDeleteCart(req, res) {//ELIMINA UN PRODUCTO ESPECIFICO DEL CARRITO

        let { cartId } = req.params
        let { idProduct } = req.params

        try {

            ServiceCart.serviceDeleteP(cartId, idProduct)
            res.status(200).json("Producto eliminado con exito")

        } catch (error) {

            res.status(400).json("No existe el carrito ingresado")

        }

    }
    static async updateWArray(req, res) {//ACTUALIZA EL CARRITO POR UN ARRAY INGRESADO

        try {
            let { _id } = req.params
            let data = req.body

            await ServiceCart.serviceUpdateA(_id, data)
            res.status(200).json("Se ha actualizado su carrito")

        } catch (error) {

            res.status(400).json("Error al intentar actualizar carrito con array")

        }

    }
    static async insertQuality(req, res) {//MODIFICA LA QUANTITY POR UN VALOR INGRESADO

        let id = req.params.id
        let idProduct = req.params.product
        let quantity = req.body

        try {

            await ServiceCart.serviceIQuality(id, idProduct, quantity)
            res.status(200).json("Se a colocado la cantidad ingresada")

        } catch (error) {

            res.status(400).json("Error al cambiar la cantidad del producto")

        }

    }
    static async empyCart(req, res) {//VACIA EL CARRITO<

        try {

            let { id } = req.params
            let vaciarCart = await ServiceCart.serviceEmpyCart(id)
            res.status(200).json("Se a vaciado su carrito")

        } catch (error) {

            res.status(400).json("Fallo al intentar vaciar su carrito")

        }


    }
    static async cartPurchase(req, res) {

        console.log("apretaste el boton")

        let { cartId } = req.params
        try {

            let venta = []
            let total = 0
            let sinStock = []
            let code = Date.now()
            let { email } = req.session.usuario
            let cart = await ServiceCart.servicePopulate(cartId, 'productCarts')
            let products = cart.productCarts



            if (email && products.length > 0) {


                products.forEach(async (x) => {

                    let producto = await ServiceCart.productById(x.productId)

                    if (producto.stock >= x.quantity) {

                        let resta = producto.stock - x.quantity
                        let subTotal = producto.price * x.quantity
                        let obj = { "stock": resta }
                        ServiceCart.updateProducts(producto._id, obj)
                        let vendido = {
                            producto,
                            subTotal
                        }
                        venta.push(vendido)
                        total += subTotal

                    } else {

                        sinStock.push(producto)
                        ServiceCart.serviceUpdateA(sinStock)
                    }
                })
                setTimeout(async () => {


                    cart = await ServiceCart.serviceDeleteP(cartId)

                    if (sinStock.length < 0) {

                        await ServiceCart.serviceUpdateA(cartId, sinStock)
                    }
                    let ticketM = {

                        code: code,
                        amount: total,
                        purchaser: email
                    }

                    try {
        

                        let ticket = await ServiceCart.ticket(ticketM)
                        console.log("Se ha creado tu ticket correctamente")

                    } catch (error) {

                        console.log("no se ha podido realizar el ticket")

                    }



                }, 1000)


            }


            if (products.length <= 0) {
                console.log("No hay productos en el carrito")
            }
        } catch (error) {
            console.log("No se ha podido generar ticket")
        }
        return res.status(200).json('creado con exito')


    }

}

