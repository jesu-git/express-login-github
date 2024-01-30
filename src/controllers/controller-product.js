import { ProductsMongo } from '../dao/managerProductsMongo.js'
import { io } from '../app.js'

export class ControllerProduct {


    static async getProductHome(req, res) {

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

            let products = await ProductsMongo.productPaginate(category, limit, page, sortValue)
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

    }
    static async getProductId(req, res) {

        let { id } = req.params

        try {

            let product = await ProductsMongo.filterForId(id)
            res.status(200).json(product)

        } catch (error) {

            res.status(400).json("El id ingresado no se en encuentra en la BD")

        }

    }
    static async createProduct(req, res) {

        let body = req.body
        let exist = await ProductsMongo.filterForCode(body.code)
        console.log(exist)
        if (exist.length > 0) return res.status(400).json("El code esta en uso")

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


        let respuesta = await ProductsMongo.addProducts(product);
        if (!respuesta) return res.status(400).json("No se ha podido agregar el producto")
        else {
            res.status(200).json("Producto ingresado correctamente.")
            io.emit("newProduct", respuesta)
        }

    }
    static async updateProduct(req, res) {

        let modify = req.body
        let { id } = req.params

        let respuesta = await ProductsMongo.update(id, modify)

        if (!respuesta) res.status(400).json("No se ha podido actualizar el producto")
        else {

            res.status(200).json("Actualizado con exito")

        }

    }
    static async deleteProduct(req, res) {

        let { id } = req.params
        let respuesta = await ProductsMongo.deleteProduct(id)

        if (!respuesta) return res.status(400).json("Error al eliminar, vuelva intentar")
        else {

            res.status(200).json(`El producto con id ${id} ha sido eliminado`)
            io.emit("delete", id)

        }

    }

}