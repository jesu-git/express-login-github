import { usuarioModelo } from "../models/usuariosModel.js"


export class UsuarioManager {

    static async userEmailFilter(email) {

     try {

         let usuario = await usuarioModelo.find({ email })
         return usuario
        
     } catch (error) {
        
        console.log("error,no se pude filtrar")
     }

    }
    static async userGitCreate(user) {
        console.log(user)
        let usuario = await usuarioModelo.create(user)
        //console.log(usuario)
        return usuario
    }
    static async idFilter(id) {

        return await usuarioModelo.findById(id)
    }
    static async userCreate(first_name, last_name, email, age, password, cart, rol) {

        let usuario = await usuarioModelo.create({ first_name, last_name, email, age, password, cart, rol })
        return usuario

    }
}