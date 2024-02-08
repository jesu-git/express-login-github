import passport from "passport"
import github from 'passport-github2'
import local from 'passport-local'
import { usuarioModelo } from "../dao/models/usuariosModel.js"
import { createHash, verificar } from "../utils.js"
import { cartsMongo } from "../dao/class/managerCartsMongo.js"
import { UsuarioManager } from "../dao/class/managerUsuario.js"
import { config } from "./config.js"


export const initPassport = () => {

    passport.use('registro', new local.Strategy(
        {
            passReqToCallback: true,
            usernameField: 'email'
        },

        async (req, username, password, done) => {

            let { first_name, last_name, email, age } = req.body

            if (!first_name || !last_name || !email || !age || !password) {

                //return res.redirect('/views/registro?error="ERROR, introduzca todos los campos"')
                return done(null, false)
            }

            let exist = await UsuarioManager.userEmailFilter(email)

            if (exist.length > 0) {

                //return res.redirect('/views/registro?error= ERROR, El email ingresado ya esta en uso, ingrese uno nuevo')
                return done(null, false, { mensaje: 'ERROR, El email ingresado ya esta en uso, ingrese uno nuevo' })
            }

            //password = crypto.createHmac("sha256","codercoder").update(password).digest("hex")
            password = createHash(password)

            let rol

            if (email == 'adminCoder@coder.com') {

                rol = "admin"
            }


            try {

                let newCart = await cartsMongo.createCart()
                let cart = newCart._id.valueOf()
                let usuario = await UsuarioManager.userCreate(first_name, last_name, email, age, password, cart, rol)
                console.log(usuario)
                // res.redirect(`/views/login?mensaje=El cliente ${email} ha sido creado correctamente`)
                return done(null, usuario)

            } catch (error) {

                return done(null, false, { mensaje: 'Error, usuario no creado' })
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
                let usuario = await UsuarioManager.userEmailFilter(username)
                console.log(usuario)
                if (usuario == []) {
                    //return res.redirect('/views/login?error= ERROR, Datos ingresados incorrectos')
                    return done(null, false, { message: 'No concuerdan sus datos' })
                }
                usuario = usuario[0]
                if (!verificar(usuario, password)) {
                    //return res.redirect('/views/login?error= ERROR, Datos ingresados incorrectos')
                    return done(null, false, { message: 'Datos invalidos' })
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
        let usuario = await UsuarioManager.idFilter(id)
        return done(null, usuario)
    })
}
export const startPassport = () => {

    passport.use('github', new github.Strategy(
        {
            clientID: 'Iv1.62d04d9f378c7d16',
            clientSecret: config.passClient,
            callbackURL: 'http://localhost:8080/api/session/callbackgithub'

        },
        async (accesToken, refreshToken, profile, done) => {

            try {
                console.log('aca', profile)
                let usuarioBd = await UsuarioManager.userEmailFilter(profile._json.email)
                let usuario = usuarioBd[0]
                console.log(usuario)
                let rol = "user"

                
                if(usuarioBd.length == 0){ 

                let newCart = await cartsMongo.createCart()
                let cart = newCart._id.valueOf()
                console.log(cart)
                let userNew = {
                    first_name: profile._json.name,
                    email: profile._json.email,
                    age: "",
                    cart: cart,
                    rol: rol,
                    profile
                }

                usuario = await UsuarioManager.userGitCreate(userNew)
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
        let usuario = await UsuarioManager.idFilter(id)
        return done(null, usuario)
    })
}