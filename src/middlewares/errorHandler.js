import { ManejoErrores } from "../utils/customError.js"

export const errorHandler = (error, req, res, next) => {


    if (error) {

        if (error instanceof ManejoErrores ) {
            req.logger.error(`Error:${error.name}-code:${error.code} Detalle:${error.descripcion}`)
            res.setHeader('Content-Type', 'application/json')
            res.status(error.code).json({ error: `${error.name},${error.message}` })
        } else {
            console.log(error.message)
            res.setHeader('Content-Type', 'application/json')
            res.status(500).json({ ERROR: 'Error inesperado, intente mas tarde' })
        }
    }

    next()
}