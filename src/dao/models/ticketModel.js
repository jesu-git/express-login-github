import mongoose, { Schema } from "mongoose";


export const TicketModel = mongoose.model('ticket', new Schema({

       code:String,
      
       amount: Number,
       purchaser:String

},{
    timestamps:true
}))