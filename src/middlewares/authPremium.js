


export function premiumAuth() {

    return function (req, res, next) {


        let { id } = req.params
        let producto = productModelo.findOne({ _id: id }).lean()

        if (producto.owner !== req.session.usuario.email) {
            res.setHeader('Content-Type', 'application/json')
            res.status(403).json("No tiene permisos necesarios para acceder a este sector")
        } else {

            next()
        }


    }
}
