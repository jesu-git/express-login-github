import { Router } from "express"
import { usuarioModelo } from "../dao/models/usuariosModel.js"
import crypto from 'crypto'
export const router = Router()


router.post('/registro', async(req, res) => {

    let { nombre, email, password } = req.body

    if (!nombre || !email || !password) {

        return res.redirect('/views/registro?error="ERROR, introduzca todos los campos"')
    }

    let exist = await usuarioModelo.findOne({email})
    
    if(exist){

       return res.redirect('/views/registro?error= ERROR, El email ingresado ya esta en uso, ingrese uno nuevo')
    }

     password = crypto.createHmac("sha256","codercoder").update(password).digest("hex")

     let rol = "user"

     if ( email == 'adminCoder@coder.com'){

        rol = "admin"
     }

     try {
     
        let usuario = await usuarioModelo.create({nombre,email,password,rol})
        res.redirect(`/views/login?mensaje=El cliente ${email} ha sido creado correctamente`)

     } catch (error) {
        console.log(error.message)
        res.redirect('/views/registro?error= Error inesperado')
     }

     
})

router.post('/login', async(req, res) => {

    let { email, password } = req.body
     console.log(req.body)
    if (!email || !password) {

        return res.redirect('/views/login?error="ERROR, introduzca todos los campos"')
    }
    try {
        password = crypto.createHmac("sha256","codercoder").update(password).digest("hex")
        let usuario = await usuarioModelo.findOne({email, password}).lean()
        console.log("login",usuario)
        if(!usuario){
    
           return res.redirect('/views/login?error= ERROR, Datos ingresados incorrectos')
        }
      
    
req.session.usuario = {nombre: usuario.nombre , email: usuario.email , rol: usuario.rol}
      console.log(req.session.usuario)
     res.redirect('/views/products')
        
    } catch (error) {
        
        res.status(400).json("Error inesperado")
    }
     
})
router.get('/logout', async(req, res) => {

try { 
req.session.destroy((error)=>{
    if(error){
       return res.redirect('/views/login?error= ERROR inesperado!, intente mas tarde')
    }

    res.redirect('/views/login')
})  
         
    } catch (error) {
        
        res.status(400).json("Error inesperado")
    }
     
})