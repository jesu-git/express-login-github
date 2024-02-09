import mongoose, { Schema } from "mongoose";


export const ticketModel = mongoose.model('ticket', new Schema({

       code:String,
      
       amount: Number,
       purchaser:String

},{
    timestamps:true
}))