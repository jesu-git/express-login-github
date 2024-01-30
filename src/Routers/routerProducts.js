import __dirname from '../utils.js'
import { Router } from 'express'
export const router = Router()
import { ControllerProduct} from '../controllers/controller-product.js'


router.get('/', ControllerProduct.getProductHome)
router.get('/:id',ControllerProduct.getProductId)
router.post('/', ControllerProduct.createProduct)
router.put('/:id',ControllerProduct.updateProduct)
router.delete("/:id", ControllerProduct.deleteProduct)