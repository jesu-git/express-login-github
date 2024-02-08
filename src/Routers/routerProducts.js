import __dirname from '../utils.js'
import { Router } from 'express'
export const router = Router()
import { ControllerProduct } from '../controllers/controller-product.js'
import { authRol } from '../controllers/controller-sessions.js'


router.get('/', ControllerProduct.getProductHome)
router.get('/:id',ControllerProduct.getProductId)
router.post('/',authRol(["admin"]), ControllerProduct.createProduct)
router.put('/:id',authRol(["admin"]),ControllerProduct.updateProduct)
router.delete("/:id",authRol(["admin"]), ControllerProduct.deleteProduct)