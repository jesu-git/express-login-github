console.log("ready")

const btnComprar = document.querySelector('#comprar')



btnComprar.addEventListener('click', (e)=>{

    const cart = btnComprar.getAttribute('data-product-id')
    let url = `http://localhost:8080/api/carts/${cart}/purchase`
    
    fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
  
      })
    })