import { usuarioModelo } from "../dao/models/usuariosModel.js"
import { ServiceUser } from "../service/serviceUser.js"


export class Manager_users {


    static async changePremium(req, res) {

        let userId = req.params.uid
        let exist = await usuarioModelo.find({ _id: userId }).lean()
        let usuario = exist[0]
        if (usuario.length < 0 || usuario == undefined) {

            return res.status(400).json("El usuario ingresado no existe o ya no pertenece al servicio")

        }

        if (usuario && usuario.rol !== "admin") {

            if (usuario.rol == "user") {

                let userModific = { ...usuario, rol: "premium" }
                console.log(userModific)
                await ServiceUser.UpdateU(userModific)
                res.setHeader('Content-Type', 'application/json')
                res.status(200).json("El rol del usuario ingresado ha sido modificado a Premium ")

            } else {

                let userRol = { ...usuario, rol: "user" }
                await ServiceUser.UpdateU(userRol)
                res.setHeader('Content-Type', 'application/json')
                res.status(200).json("El rol del usuario ingresado ha sido modificado a user ")
            }


        }


    }
}
