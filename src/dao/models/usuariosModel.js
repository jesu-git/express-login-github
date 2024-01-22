import mongoose, { Schema } from "mongoose"


const userCollecion = new mongoose.Schema({

    first_name: 'String',
    last_name: 'String',
    email: {
        type: 'String',
        unique: true
    },
    age: 'Number',
    password: 'String',
    cart:'String',
    rol: {
        type: 'String',
        default: 'user'
    }
}, {
    timestamps: true,
    strict: false
})


export const usuarioModelo = new mongoose.model('usuario', userCollecion)