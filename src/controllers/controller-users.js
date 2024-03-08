import { usuarioModelo } from "../dao/models/usuariosModel.js"




export class Manager_users{


    static async changePremium( req, res){

        let userId = req.params.uid
        let exist = usuarioModelo.find({_id:userId})

        if ( exist.length < 0){

          return res.status(400).json("El usuario ingresado no existe o ya no pertenece al servicio")

        }

        if (exist && exist.rol !== "admin"){

            if(exist.rol == "user"){
            
                let userModific = { ...exist, rol:"premium"}
                usuarioModelo.findOneAndUpdate({_id:exist._id},userModific)


            }else{

                let userRol = { ...exist, rol:"user"}
                usuarioModelo.findOneAndUpdate({_id:exist._id},userRol)
            }


        }
    }
}