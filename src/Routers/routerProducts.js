import __dirname from '../utils.js'
import { Router } from 'express'
export const router = Router()
import { ProductsMongo } from '../dao/managerProductsMongo.js'
import { productModelo } from '../dao/models/productModelo.js'
import { io } from '../app.js'


const mongo = new ProductsMongo()

router.get('/', async (req, res) => {

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

    try {

        let products = await productModelo.paginate(category, { limit: limit, page: page, sort: sortValue })
        let { totalPages, hasNextPage, hasPrevPage, prevPage, nextPage } = products
        let prevLink = '', nextLink = '';
        if (hasPrevPage) {
            prevLink = `localhost:8080/api/products?limit=${limit}&page=${prevPage}`
        } else { prevLink = null }
        if (hasNextPage) {
            nextLink = `localhost:8080/api/products?limit=${limit}&page=${nextPage}`
        } else { nextLink = null }
        if (!products) {
            res.status(400).json({ error: 'El producto no se encuentra en la DB' })
        };
        res.status(200).send(
            {
                status: 'sucess',
                payload: products.docs,
                totalPages, hasNextPage, hasPrevPage, prevPage, nextPage, prevLink, nextLink
            })

    } catch (error) {

        res.status(400).send("Error en la  peticion")

    }

})

router.get('/:id', async (req, res) => {

    let id = req.params.id

    try {

        let product = await productModelo.findById(id)
        res.status(200).json(product)

    } catch (error) {
        res.status(400).json("El id ingresado no se en encuentra en la BD")
    }

})

router.post('/', async (req, res) => {

    let body = req.body
    let productsM = await mongo.getProduct()
    let exist = productsM.find(x => x.code === body.code)
    if (exist) return res.status(400).json("El code esta en uso")

    const date = ['title', 'description', 'price', 'code', 'stock', 'category']

    let filter = date.filter(x => !(x in body));

    if (filter.length > 0) {

        return res.status(400).json("No has ingresado todos los campos");

    }

    const typeDate = {

        title: 'string',
        description: 'string',
        code: 'string',
        price: 'number',
        status: 'boolean',
        stock: 'number',
        category: 'string'

    }

    let incorrectDate = Object.entries(typeDate).reduce((acc, [date, type]) => {
        if (body[date] !== undefined) {
            if (typeof body[date] !== type) acc.push(date)
        } return acc
    }, [])

    if (incorrectDate.length > 0) return res.status(400).json("Los datos ingresados en un tipo de dato invalido")

    const thumbnails = body.thumbnails || []


    body.status = body.status || true
    if (!Array.isArray(thumbnails)) return res.status(400).json("El campo thumbnails es  inválido ")

    let product = body


    let respuesta = await mongo.addProducts(product);
    if (!respuesta) return res.status(400).json("No se ha podido agregar el producto")
    else {
        res.status(200).json("Producto ingresado correctamente:")
        io.emit("newProduct", respuesta)
    }

})

router.put('/:id', async (req, res) => {
    let modify = req.body
    let id = req.params.id

    let respuesta = await mongo.update(id, modify)

    if (!respuesta) res.status(400).json("No se ha podido actualizar el producto")
    else {

        res.status(200).json("Actualizado con exito")

    }

})

router.delete("/:id", async (req, res) => {
    let id = req.params.id
    let respuesta = await mongo.deleteProduct(id)

    if (!respuesta) return res.status(400).json("Error al eliminar, vuelva intentar")
    else {
        res.status(200).json(`El producto con id ${id} ha sido eliminado`)
        io.emit("delete", id)
    }
    console.log(id)
})