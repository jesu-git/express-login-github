import { cartsMongo } from '../dao/class/managerCartsMongo.js'
import { ProductsMongo } from '../dao/class/managerProductsMongo.js'

export class ServiceViews { 

static async getService() {

    return await ProductsMongo.getProduct()

}
static async servicePaginate(category, limit, page, sortValue) {

        return await ProductsMongo.productPaginate(category, limit, page, sortValue)
       
}
static async servicePopulate(id, route) {

        return await cartsMongo.cartIdPopulate(id,route)

}

}