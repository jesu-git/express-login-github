import mongoose, { Schema } from "mongoose"


const userCollecion = new mongoose.Schema({

    nombre: 'String',
    apellido: 'String',
    email: {
        type: 'String',
        unique: true
    },
    edad: 'Number',
    password: 'String',
    cartId:'String',
    rol: {
        type: 'String',
        default: 'user'
    }
}, {
    timestamps: true,
    strict: false
})


export const usuarioModelo = new mongoose.model('usuario', userCollecion)