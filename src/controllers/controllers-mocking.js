import { mockingCreate } from "../utils.js"


export class ControllerMocking{ 
    
    
static async mocking(req, res) {

    let products = []

    for (let i = 0; i <= 100; i++) {

        let product = mockingCreate()

        products.push(product)


    }
    res.setHeader('Content-Type','application/json')
    res.status(200).send(products) 
}
}