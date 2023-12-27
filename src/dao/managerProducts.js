//LIBRERIA FILE SYSTEM

import fs from 'fs'



//CLASS PRODUCT

export class ProductsManager {

  constructor(route) {

    this.route = route

  }
  //METODO QUE PERMITE LA DEVOLUCION Y VISTA DE LOS PRODUCTOS EN EL ARREGLO 
  getProduct() {

    if (fs.existsSync(this.route)) {

      return JSON.parse(fs.readFileSync(this.route, "utf-8"))

    }
    else {

      return []
    }


  }
  //METODO QUE INGRESA LOS PRODUCTOS NUEVOS AL ARREGLO Y COMPRUEBA QUE EL CODE NO SE REPITA Y TODOS LOS CAMPOS SE INGRESEN
  addProducts(product) {

    let all_products = this.getProduct()


    let id = Math.max(...all_products.map(x => x.id), 0) + 1


    let productNew = { id, ...product }
    if (Object.keys(productNew).length > 9) return console.log("Has ingresados más campos de los requeridos")
    all_products.push(productNew)

    fs.writeFileSync(this.route, JSON.stringify(all_products, null, 5))
    return productNew

  }
  //METODO QUE NOS DEVUELVE EL PRODUCTO MEDIANTE EL INGRESO DE ID POR PARAMETRO 
  getProductById(id) {

    let products = this.getProduct()

    let index = products.findIndex(X => X.id === id)

    if (index === -1) {

      console.log(`El producto con id ${id} no existe`)
      return
    }
    else {

      return products[index]
    }

  }
  //METODO QUE ELIMINA UN PRODUCTO ATRAVES DE LA INSERCION DE SU ID POR PARAMETRO   
  deleteProduct(id) {

    let all_products1 = this.getProduct()

    let indice = all_products1.findIndex((x) => x.id === id)

    if (indice === -1) {

      console.log(`El id ${id} no se encuentra en la DB`)

    }
    else {

      all_products1.splice(indice, 1)
      console.log(`El producto con id ${id} ha sido borrado con exito`)
      fs.writeFileSync(this.route, JSON.stringify(all_products1, null, 5))
      return all_products1
    }

  }
  //METODO QUE ACTUALIZA MEDIANTE EL INGRESO DE DOS PARAMETROS(PARAMETRO 1 ES UN ID,PARAMETRO 2 ES UN OBJETO CON LAS CLAVE-VALOR A MODIFICAR)
  update(id, obj) {

    let all_products1 = this.getProduct()

    let indice = all_products1.findIndex((x) => x.id === id)

    if (indice === -1) {

      console.log(`El id ${id} no se encuentra en la DB`)

    }
    const checkObj = (obj) => {
      return obj === Object(obj);
    };


    if (!checkObj) {
      console.log("No es un objeto");
      return;
    }

    const keys = Object.keys(obj);
    let checkCode = keys.find(x => x === "code")

    if (checkCode) {
      let codeC = all_products1.find(x => x.code == obj.code)

      if (codeC) return console.log("El code utilizado ya esta en uso")
    }


    const keys_old = ["title", "description", "code", "price", "status", "stock", "category", "thumbnails"]

    try {

      keys.forEach((date) => {

        let dato = keys_old.includes(date)


        if (!dato) {


          throw new error("hubo error")

        }

      })
    } catch (error) {

      console.log("Verifique sus campos, no son correctos")
      return
    }

    all_products1[indice] = { ...all_products1[indice], ...obj, id }
    fs.writeFileSync(this.route, JSON.stringify(all_products1, null, 5))
    return all_products1[indice]
  }
}











