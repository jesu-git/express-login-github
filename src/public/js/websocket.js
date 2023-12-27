console.log("desde el websocket")

const socket = io()
socket.on("newProduct", product=>{

    let ul = document.querySelector('ul')
    let newLi = document.createElement('li')
    newLi.setAttribute("ID",`${product._id}`)
    let print = `${product._id}-${product.title}`
    newLi.innerHTML =  print
    ul.append(newLi)
    

})

socket.on("delete", idOn=>{
    
    let pDelete = document.getElementById(`${idOn}`)
    pDelete.remove()
    console.log("El producto eliminado es el de la posicion:",idOn)
})
