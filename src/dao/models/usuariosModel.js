import mongoose, { Schema } from "mongoose"


const userCollecion = new mongoose.Schema({

    nombre: 'String',
    email: {
        type: 'String',
        unique: true
    },
    password: 'String',
    rol: 'String'
}, {
    timestamps: true,
    strict: false
})


export const usuarioModelo = new mongoose.model('usuario', userCollecion)