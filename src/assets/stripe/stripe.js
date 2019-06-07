const stripe = Stripe('pk_test_yKxWzowzQDtQUVvTldTwHva200dtooZ4CL');

const checkoutButton = document.getElementById('checkout-button-sku_FAynjjBDLhgbTf');

checkoutButton.addEventListener('click', function () {
  stripe.redirectToCheckout({
    items: [{sku: 'sku_FAynjjBDLhgbTf', quantity: 1}],
    successUrl: window.location.protocol + '//localhost:3000/membership/upgrade/success',
    cancelUrl: window.location.protocol + '//localhost:3000/membership/upgrade/cancel',
  })
  .then(function (result) {
    if (result.error) {
      var displayError = document.getElementById('error-message');
      displayError.textContent = result.error.message;
    }
  });
});
