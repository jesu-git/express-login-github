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

      .then(response => response.json())
      .then(data => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: data,
          showConfirmButton: false,
          timer: 1000
        })})
   
    })