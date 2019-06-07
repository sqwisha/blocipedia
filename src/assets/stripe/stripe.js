const stripe = Stripe('pk_test_yKxWzowzQDtQUVvTldTwHva200dtooZ4CL');

const checkoutButton = document.getElementById('checkout-button-sku_FAynjjBDLhgbTf');

checkoutButton.addEventListener('click', function () {
  stripe.redirectToCheckout({
    items: [{sku: 'sku_FAynjjBDLhgbTf', quantity: 1}],
    successUrl: process.env.stripe_successUrl || window.location.protocol + '//sqwisha-blocipedia.herokuapp.com/membership/upgrade/success',
    cancelUrl: process.env.stripe_cancelUrl || window.location.protocol + '//sqwisha-blocipedia.herokuapp.com/membership/cancel'
  })
  .then(function (result) {
    if (result.error) {
      var displayError = document.getElementById('error-message');
      displayError.textContent = result.error.message;
    }
  });
});
