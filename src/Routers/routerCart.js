import __dirname from '../utils.js'
import path from 'path'
import { Router } from 'express'
export const router = Router()
import { cartsMongo } from '../dao/managerCartsMongo.js'
import { CartModelo } from '../dao/models/cartsModelo.js'
import { error } from 'console'
import { productModelo } from '../dao/models/productModelo.js'




const cm = new cartsMongo()

router.get('/:id', async (req, res) => {
    let id = req.params.id
    let respuesta = await CartModelo.findById(id).populate('productCarts.productId').lean()
    console.log(respuesta)

    if (!respuesta || respuesta == null) return res.status(400).json("El carrito no fue encontrado")
    else { res.status(200).json(respuesta) }

})
router.post("/", async (req, res) => {
    let create = await cm.createCart()
    if (!create) return res.status(400).json("Error de creacion de carrito")
    console.log(create)
    return res.status(200).json(`Creacion exitosa!! El id de su carrito es: ${create}`)

})
router.post('/:id/product/:product', async (req, res) => {

    let id = req.params.id
    let prodId = req.params.product

    let respuesta = await cm.addProductsCart(id, prodId)
    console.log(respuesta)

    if (!respuesta || respuesta == null) return res.status(400).json("Error a cargar el producto, error en valores id")
    else {
        return res.status(200).json("Tu producto ha sido agregado con exito")
    }

})
router.delete("/:cartId/product/:idProduct", async (req, res) => {//ELIMINA UN PRODUCTO ESPECIFICO DEL CARRITO

    let cartId = req.params.cartId
    let idProduct = req.params.idProduct

    try {
        let cart = await CartModelo.findOne({ _id: cartId })
        let product = cart.productCarts.filter(x => x.productId != idProduct)
        await CartModelo.updateOne({ _id: cartId }, { 'productCarts': product })
        res.status(200).json("Producto eliminado con exito")
    } catch (error) {
        res.status(400).json("No existe el carrito ingresado")
    }


})
router.put("/:_id", async (req, res) => {//ACTUALIZA EL CARRITO POR UN ARRAY INGRESADO

    try {
        let { _id } = req.params
        console.log(_id)
        let data = req.body
        console.log(data)
        await cm.updateArray(_id, data)
        res.status(200).json("Se ha actualizado su carrito")

    } catch (error) {
        res.status(400).json("Error al intentar actualizar carrito con array")
    }

})
router.put('/:id/product/:product', async (req, res) => {//MODIFICA LA QUANTITY POR UN VALOR INGRESADO

    let id = req.params.id
    let idProduct = req.params.product
    let quantity = req.body
    
    try {
        await cm.updateQuantity(id, idProduct, quantity)
        res.status(200).json("Se a colocado la cantidad ingresada")
    } catch (error) {
        res.status(400).json("Error al cambiar la cantidad del producto")
    }

})
router.delete("/:id", async (req, res) => {//VACIA EL CARRITO


    try {
        let id = req.params.id
        console.log(id)
        let vaciarCart = await cm.deleteProdcutsCart(id)
        res.status(200).json("Se a vaciado su carrito")
    } catch (error) {
        res.status(400).json("Fallo al intentar vaciar su carrito")
    }


})


