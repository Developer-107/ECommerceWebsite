 const stripe = Stripe('YOUR_STRIPE_PUBLISHABLE_KEY');
        const elements = stripe.elements();
        const cardElement = elements.create('card');
        cardElement.mount('#card-element');
        document.getElementById('payment-method').addEventListener('change', function() {
            const method = this.value;
            if (method === 'stripe') {
                document.getElementById('stripe-form').style.display = 'block';
                document.getElementById('paypal-form').style.display = 'none';
            } else {
                document.getElementById('stripe-form').style.display = 'none';
                document.getElementById('paypal-form').style.display = 'block';
            }
        });
        document.getElementById('submit-button').addEventListener('click', function(event) {
            event.preventDefault();
            stripe.createToken(cardElement).then(function(result) {
                if (result.error) {
                    // Display error.message in your UI
                    console.error(result.error.message);
                } else {
                    // Send token to your server
                    fetch('/pay/stripe', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({amount: document.getElementById('amount').value, token: result.token.id})
                    }).then(response => response.json())
                      .then(data => console.log(data));
                }
            });
        });
        document.getElementById('paypal-button').addEventListener('click', function(event) {
            event.preventDefault();
            fetch('/pay/paypal', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({amount: document.getElementById('amount').value})
            }).then(response => response.json())
              .then(data => window.location.href = `https://www.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=${data.payment_id}`);
        });