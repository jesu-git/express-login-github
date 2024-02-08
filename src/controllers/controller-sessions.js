import { DTO } from "../DTO/DTO.js"


export class ControllerSession {

    static async sessionRegistro(req, res) {

        let { email } = req.body
        res.redirect(`/views/login?mensaje=El cliente ${email} ha sido creado correctamente`)

    }
    static async errorRegistro(req, res) {

        res.redirect('/views/registro?error=Error en proceso de registro del usuario')

    }
    static async errorLogin(req, res) {

        res.redirect('/views/login?error= Error en la autenticacion')

    }
    static async login(req, res) {

        req.session.usuario = { first_name: req.user.first_name, email: req.user.email, rol: req.user.rol, cart: req.user.cart }
        return res.redirect('/views/products')

    }
    static async logout(req, res) {

        try {
            req.session.destroy((error) => {
                if (error) {
                    return res.redirect('/views/login?error= ERROR inesperado!, intente mas tarde')
                }

                res.redirect('/views/login')
            })

        } catch (error) {

            res.status(400).json("Error inesperado")
        }

    }
    static async github(req, res) {
    }
    static async callbackgithub(req, res) {

        req.session.usuario = { first_name: req.user.first_name, email: req.user.email, rol: req.user.rol, cart: req.user.cart }
        return res.redirect('/views/products')

    }
    static async errorGithub(req, res) {

        res.status(200).json({ error: 'Error al autenticar con Github' })

    }
    static async current(req, res) {

        let session = req.session.usuario

        if (session) {

            let mostrar = new DTO(session)
            res.status(200).json({ mostrar })

        } else {

            res.redirect('/views/login?error= Error, necesita loguearse')
        }

    }

}

export function authRol(permisos = []) {

    return function (req, res, next) {

    

        if(!req.user || req.user == undefined){

             //res.setHeader('Content-Type','application/json')
             //res.redirect("/views/login?error=ERROR, no estas logueado.")
             return console.log("ERROR, no estas logueado")
        }
        if (req.user.rol == permisos[0]) {

            return next()
        }else{
            res.setHeader('Content-Type','application/json')
            res.status(403).json("No tiene permisos necesarios para acceder a este sector") 
        }

    }

}