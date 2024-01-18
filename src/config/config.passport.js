import passport from "passport"
import github from 'passport-github2'
import local from 'passport-local'
import { usuarioModelo } from "../dao/models/usuariosModel.js"
import { createHash, verificar } from "../utils.js"
import {cartsMongo } from "../dao/managerCartsMongo.js"


export const initPassport = () => {

    passport.use('registro', new local.Strategy(
        {
            passReqToCallback: true,
            usernameField: 'email'
        },

        async (req, username, password, done) => {

            let { nombre, apellido, email, edad } = req.body

            if (!nombre || !apellido || !email || !edad || !password) {

                //return res.redirect('/views/registro?error="ERROR, introduzca todos los campos"')
                return done(null, false)
            }

            let exist = await usuarioModelo.findOne({ email })

            if (exist) {

                //return res.redirect('/views/registro?error= ERROR, El email ingresado ya esta en uso, ingrese uno nuevo')
                return done(null, false, {mensaje:''})
            }

            //password = crypto.createHmac("sha256","codercoder").update(password).digest("hex")
            password = createHash(password)
            let rol

            if (email == 'adminCoder@coder.com') {

                rol = "admin"
            }
            let Mongo = new cartsMongo()

            try {
                let  newCart = await Mongo.createCart()
                let cartId = newCart._id.valueOf()
                let usuario = await usuarioModelo.create({ nombre, apellido, email, edad, password,cartId, rol })
                // res.redirect(`/views/login?mensaje=El cliente ${email} ha sido creado correctamente`)
                return done(null, usuario)

            } catch (error) {

                return done(null,false,{mensaje:'Error, usuario no creado'})
                //console.log(error.message)
                //res.redirect('/views/registro?error= Error inesperado')
            }



        }
    ))
    passport.use('login', new local.Strategy(
        {
            usernameField: 'email'
        },
        async (username, password, done) => {


            // let { email } = req.body

            if (!username || !password) {

                //return res.redirect('/views/login?error="ERROR, introduzca todos los campos"')

                return done(null, false)
            }
            try {
                //password = crypto.createHmac("sha256","codercoder").update(password).digest("hex")
                let usuario = await usuarioModelo.findOne({ email: username }).lean()
                console.log(usuario)
                if (!usuario) {
                    //return res.redirect('/views/login?error= ERROR, Datos ingresados incorrectos')
                    return done(null, false)
                }
                if (!verificar(usuario, password)) {
                    //return res.redirect('/views/login?error= ERROR, Datos ingresados incorrectos')
                    return done(null, false)
                }


                return done(null, usuario)

            } catch (error) {

                return done(error, false)
            }

        }
    ))
    passport.serializeUser((usuario, done) => {
        return done(null, usuario._id)
    })
    passport.deserializeUser(async (id, done) => {
        let usuario = await usuarioModelo.findById(id)
        return done(null, usuario)
    })
}
export const startPassport = () => {

    passport.use('github', new github.Strategy(
        {
            clientID: 'Iv1.62d04d9f378c7d16',
            clientSecret: 'bfc09e9cb188dce3d626579abe0f30b757aeb525',
            callbackURL: 'http://localhost:8080/api/session/callbackgithub'

        },
        async (accesToken, refreshToken, profile, done) => {

            try {

                let usuario = await usuarioModelo.findOne({ email: profile._json.email })
                let rol = "user"
                if (!usuario) {

                    let userNew = {
                        nombre: profile._json.name,
                        email: profile._json.email,
                        rol: rol,
                        profile

                    }

                    usuario = await usuarioModelo.create(userNew)
                }

                return done(null, usuario)


            } catch (error) {
                return done(error)
            }

        }

    ))

    passport.serializeUser((usuario, done) => {
        //console.log(await usuario)
        //console.log(usuario._id)
        return done(null, usuario._id)
    })
    passport.deserializeUser(async (id, done) => {
        let usuario = await usuarioModelo.findById(id)
        return done(null, usuario)
    })
}