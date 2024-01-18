


document.addEventListener('DOMContentLoaded', function () {
    const btnAgregar = document.querySelectorAll('.add-to-cart');
  
    btnAgregar.forEach(button => {
      button.addEventListener('click', function () {
        const productId = this.getAttribute('data-product-id');
        console.log('va por aca')
        agregarACart(productId)
        console.log('pasoooo')
    
      });
    });
  
    function agregarACart(productId) {
      console,log('acaaaa')
      const cartId = '65a87c904eb892f03b1ec913'
      console.log('funcioon agregar',cartId)
      const url = `http://localhost:8080/api/carts/${cartId}/product/${productId}`
  
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
          });

        console.log("producto agrgado carrectamente")

 
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }
  });