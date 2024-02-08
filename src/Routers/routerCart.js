import __dirname from '../utils.js'
import { Router } from 'express'
export const router = Router()
import { ControllerCart } from '../controllers/controller-cart.js'


router.get('/:id', ControllerCart.cartId)
router.post("/",ControllerCart.create_cart)
router.post('/:id/product/:product', ControllerCart.addProduct)
router.delete("/:cartId/product/:idProduct", ControllerCart.productDeleteCart)
router.put("/:_id",ControllerCart.updateWArray)
router.put('/:id/product/:product',ControllerCart.insertQuality)
router.delete("/:id",ControllerCart.empyCart)
router.post("/:cartId/purchase",ControllerCart.cartPurchase)


