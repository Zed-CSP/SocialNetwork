import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CARD_OPTIONS = {
    iconStyle: 'solid',
    style: {
        base: {
            iconColor: '#c4f0ff',
            color: '#fff',
            fontWeight: '500',
            fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
            fontSize: '16px',
            fontSmoothing: 'antialiased',
            ':-webkit-autofill': {
                color: '#fce883',
            },
            '::placeholder': {
                color: '#87bbfd',
            },
        },
        invalid: {
            iconColor: '#ffc7ee',
            color: '#ffc7ee',
        },
    },
};

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const {error, paymentMethod} = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement),
        });

        if (!error) {
            console.log(paymentMethod)
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <fieldset className='FormGroup'>
                <div className='FormRow'>
                    <CardElement options={CARD_OPTIONS} />
                </div>
            </fieldset>
            <button>Pay</button>
        </form>
    );
};

export default CheckoutForm;
