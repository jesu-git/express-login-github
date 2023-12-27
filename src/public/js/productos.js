


document.addEventListener('DOMContentLoaded', function () {
    const btnAgregar = document.querySelectorAll('.add-to-cart');
  
    btnAgregar.forEach(button => {
      button.addEventListener('click', function () {
        const productId = this.getAttribute('data-product-id');
        agregarACart(productId)
        
    
      });
    });
  
    function agregarACart(productId) {
      const cartId = '657901d1973ef35614b9b24f'
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