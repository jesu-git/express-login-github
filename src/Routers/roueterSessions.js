import { Router } from "express"
import { usuarioModelo } from "../dao/models/usuariosModel.js"
import crypto from 'crypto'
import { createHash, verificar } from "../utils.js"
import passport from "passport"
export const router = Router()


router.post('/registro',passport.authenticate('registro',{failureRedirect:'/api/session/errorRegistro'}), async (req, res) => {
        let {email} = req.body
        res.redirect(`/views/login?mensaje=El cliente ${email} ha sido creado correctamente`)

})
router.get('/errorRegistro',(req,res)=>{
    res.redirect('/views/registro?error=Error en proceso de registro del usuario')
})
router.get('/errorLogin',(req,res)=>{
    res.redirect('/views/login?error= Error en la autenticacion')
})
router.post('/login', passport.authenticate('login', { failureRedirect: '/api/session/errorLogin' }), async (req, res) => {


    req.session.usuario = { nombre: req.user.nombre, email: req.user.email, rol: req.user.rol,cartId:req.user.cartId }

    return res.redirect('/views/products')


})
router.get('/logout', async (req, res) => {

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

})
router.get('/github', passport.authenticate('github', {}), (req, res) => {
})
router.get('/callbackgithub', passport.authenticate('github', { failureRedirect: '/api/session/errorGithub' }), (req, res) => {
    req.session.usuario = req.user

    return res.redirect('/views/products')
    

})
router.get('/errorGithub', (req, res) => {

    res.status(200).json({ error: 'Error al autenticar con Github' })

})
router.get('/current', (req, res) => {

let session = req.session.usuario
    res.status(200).json({session})
}) 