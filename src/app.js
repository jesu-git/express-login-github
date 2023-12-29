
import express from 'express'
import { router as router_products } from './Routers/routerProducts.js'
import { router as router_cart } from './Routers/routerCart.js'
import { router as router_views } from './Routers/routerViews.js'
import { router as router_session } from './Routers/roueterSessions.js'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'
import __dirname from './utils.js'
import path from 'path'
import mongoose from 'mongoose' 
import { messageModelo } from './dao/models/messageModelo.js'
import sessions from 'express-session'
import MongoStore from 'connect-mongo';
import { initPassport, startPassport } from './config/config.passport.js'
import passport from 'passport'
const app = express()
const PORT = 8080

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessions({  
    secret:"coderceder",
    resave:true,
    saveUninitialized: true ,
    store:MongoStore.create({
        mongoUrl:"mongodb+srv://suarezjesu90:codercoder@eccommer.u1pd7r0.mongodb.net/?retryWrites=true&w=majority",
        mongoOptions:{dbName:'Eccommers'},
        ttl:3600
    })
}))
initPassport()
startPassport()
app.use(passport.initialize())
app.use(passport.session())

app.engine('handlebars',engine());
app.set('view engine','handlebars')
app.set('views', path.join(__dirname,'./views'))

app.use('/public',express.static(__dirname +'/public'))

app.get("/", (req, res) => {

    res.status(200).render('home')

})

app.use('/api/products', router_products)
app.use('/api/carts', router_cart)
app.use('/views', router_views)
app.use('/api/session',router_session)


const server = app.listen(PORT, () => {

    console.log("Server in service")
})


export const io = new Server(server)

let usuarios = []


io.on("connection", socket => {
    console.log(`Se ha conectado ${socket.id}`)

    socket.on("nombre", async(nombre) => {
        usuarios.push({ nombre, id: socket.id })
        socket.broadcast.emit("nuevoConectado", nombre)
        socket.emit("comienzo", await messageModelo.find().lean())
    })

    socket.on("mensaje", async(datos) => {
        await messageModelo.create({'nombre':datos.emisor ,'mensaje':datos.mensaje})
        
        io.emit("nuevoMensaje", datos)
    })
    socket.on("disconnect", () => {
        let name = usuarios.find(x =>  x.id === socket.id )
        if (name) {
            io.emit("desconectado", name.nombre)
        }
    })


})

try {
   await mongoose.connect("mongodb+srv://suarezjesu90:codercoder@eccommer.u1pd7r0.mongodb.net/?retryWrites=true&w=majority",{dbName:'Eccommers'}) 
   console.log("BD conectada!")
} catch (error) {

    console.log(error.message)
    
}