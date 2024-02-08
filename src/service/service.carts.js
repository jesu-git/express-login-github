import { cartsMongo as DAO } from "../dao/class/managerCartsMongo.js";

export class ServiceCart {

    static async servicePopulate(id, route) {

        return await DAO.cartIdPopulate(id, route)

    }
    static async serviceCreateCart() {

        return await DAO.createCart()
    }
    static async serviceAddP(id , prodId){

        return await DAO.addProductsCart(id , prodId)
    }    
    static async serviceDeleteP(cartId , prodId){

        return await DAO.productDeleteCart(cartId,prodId)
        
    }
    static async serviceUpdateA(cartId , prodId){

        return await DAO.updateArray(cartId,prodId)
        
    }
    static async serviceIQuality(id, idProduct, quantity){

        return await DAO.insertQuality(id, idProduct, quantity)
        
    }
    static async serviceEmpyCart(id){

        return await DAO.deleteProdcutsCart(id)

    }
}

