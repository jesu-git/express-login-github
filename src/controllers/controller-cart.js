
import { cartsMongo } from '../dao/managerCartsMongo.js'

export class ControllerCart {

    static async carId(req, res) {

        let { id } = req.params
        let respuesta = cartsMongo.cartIdPopulate(id, 'productCarts.productId')

        if (!respuesta || respuesta == null) return res.status(400).json("El carrito no fue encontrado")
        else { res.status(200).json(respuesta) }

    }
    static async create_cart(req, res) {

        let create = await cartsMongo.createCart()
        if (!create) return res.status(400).json("Error de creacion de carrito")
        console.log(create)
        return res.status(200).json(`Creacion exitosa!! El id de su carrito es: ${create}`)
          
    }
    static async addProduct(req, res) {

        let { id } = req.params
        let { product } = req.params

        let respuesta = await cartsMongo.addProductsCart(id, product)
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

            cartsMongo.deleteOneProduct(cartId, idProduct)
            res.status(200).json("Producto eliminado con exito")

        } catch (error) {

            res.status(400).json("No existe el carrito ingresado")

        }

    }
    static async updateWArray(req, res) {//ACTUALIZA EL CARRITO POR UN ARRAY INGRESADO

        try {
            let { _id } = req.params
            let data = req.body

            await cartsMongo.updateArray(_id, data)
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

            await cartsMongo.updateQuantity(id, idProduct, quantity)
            res.status(200).json("Se a colocado la cantidad ingresada")

        } catch (error) {

            res.status(400).json("Error al cambiar la cantidad del producto")

        }

    }
    static async empyCart(req, res) {//VACIA EL CARRITO

        try {

            let { id } = req.params
            let vaciarCart = await cartsMongo.deleteProdcutsCart(id)
            res.status(200).json("Se a vaciado su carrito")

        } catch (error) {

            res.status(400).json("Fallo al intentar vaciar su carrito")

        }


    }

}
