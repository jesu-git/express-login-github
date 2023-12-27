
import { CartModelo } from "./models/cartsModelo.js"
import { ProductsMongo } from "./managerProductsMongo.js"
import { productModelo } from "./models/productModelo.js"

const mongo = new ProductsMongo()

export class cartsMongo {

    async getCart() {

        try {

            return await CartModelo.find().lean()

        } catch (error) {

            console.log("No hay carritos en BD..")
        }


    }
    async createCart() {
        try {
            //let carts = await this.getCart()
            //let id = Math.max(...carts.map(x => x.id), 0) + 1
            let productCarts = []


            let cart = {

                productCarts

            }


            let cartsMongo = await CartModelo.create(cart)
            console.log(cartsMongo)
            return cartsMongo._id


        } catch (error) {

            console.log("No se pudo crear el carrito", error.message)
        }




    }
    async addProductsCart(_id, prodId) {

        try {
            let existProduct = await productModelo.findOne({ _id: prodId })
            if (existProduct == null) return null

        } catch (error) {

            console.log("No se encontro su producto")

        }

        try {

            let cart = await CartModelo.findOne({ _id: _id })
            let product = cart.productCarts.find(x => x.productId == prodId)
            console.log(product)
            if (product !== undefined) {

                product.quantity++
                let modificado = cart.productCarts
                await CartModelo.findOneAndUpdate({ _id }, { 'productCarts': modificado })

                return cart
            }

            if (product == undefined) {

                await CartModelo.findByIdAndUpdate({ _id }, { $push: { 'productCarts': { productId: prodId, quantity: 1 } } })
                return _id
            }
        } catch (error) {

            console.log("Error al agregar producto", error.message)

            return

        }
    }
    async getProductId(id) {

        try {

            let carts = await CartModelo.findById({ id }).lean()
            return carts

        } catch (error) {

            console.log("NO existe el carrito indicado", error.menssage)
        }




    }
    async deleteProdcutsCart(id) {

        try {
            let cart = await CartModelo.findOne({_id:id})
            cart.productCarts = []
            console.log(cart)
            let vaciar = await CartModelo.findByIdAndUpdate({_id : id},{'productCarts':cart.productCarts})
        } catch (error) {
            console.log("fallo al vaciar")
        }


    }
    async updateArray(id, data) {

        try {
            await CartModelo.updateOne({ _id: id }, { $set: { 'productCarts': data } })
        } catch (error) {
            console.log("Error a intentar actualizar carrito", error.menssage)
        }

    }
    async updateQuantity(_id, idProduct, cantidad) {

        try {
            let cart = await CartModelo.findById(_id)
            let existProduct = await productModelo.findById(idProduct)
            let product = cart.productCarts.find(x => x.productId == idProduct)


            if (product !== undefined) {
                product.quantity = cantidad.quantity
                let modificado = cart.productCarts
                await CartModelo.findOneAndUpdate({ _id }, { 'productCarts': modificado })

            }
        } catch (error) {

            console.log("fallo inesperado")

        }



    }
}
