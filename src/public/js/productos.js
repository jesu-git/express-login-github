
document.addEventListener('DOMContentLoaded', function () {
  const btnAgregar = document.querySelectorAll('.add-to-cart');
  const elemento = document.querySelector('#cart')
  const cart = elemento.getAttribute('cart')
  btnAgregar.forEach(button => {
    button.addEventListener('click', function () {
      const productId = this.getAttribute('data-product-id');

      agregarACart(productId, cart)

    });
  });

  function agregarACart(productId, cart) {


    const url = `http://localhost:8080/api/carts/${cart}/product/${productId}`

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

    })
      .then(response => response.json())
      .then ( data => {
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