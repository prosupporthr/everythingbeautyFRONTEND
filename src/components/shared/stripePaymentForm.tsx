"use client";

import { useState, FormEvent } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    PaymentElement,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";
import type { StripeElementsOptions } from "@stripe/stripe-js";
import { CustomButton } from "../custom";
import { addToast } from "@heroui/toast"; 

/* -------------------------------------------------------------------------- */
/*                                   Stripe                                   */
/* -------------------------------------------------------------------------- */

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
);

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

interface StripePaymentFormProps {
    amount: number; // dollars
    intent: string; // client_secret
    id: string; // payment / order id
    linkID?: string;
    type: string
}

interface PaymentFormProps {
    intent: string;
    id: string;
    linkID?: string;
    type: string
}

/* -------------------------------------------------------------------------- */
/*                               Payment Form                                 */
/* -------------------------------------------------------------------------- */

function PaymentForm({ intent, id, linkID, type }: PaymentFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!stripe || !elements) return;

        const { error: submitError } = await elements.submit();

        if (submitError) {
            addToast({
                title: "Payment failed",
                description: submitError.message ?? "Unable to complete payment",
                color: "danger",
            });
            return;
        }

        setIsLoading(true);

        try {
            const { error } = await stripe.confirmPayment({
                elements,
                clientSecret: intent,
                confirmParams: {
                    return_url: `${window.location.origin}/payment-success?id=${id}&linkID=${linkID}&type=${type}`,
                },
            });

            // ❗ Only handle errors here
            if (error) {
                addToast({
                    title: "Payment failed",
                    description: error.message ?? "Unable to complete payment",
                    color: "danger",
                });
                setIsLoading(false);
            }
        } catch {
            addToast({
                title: "Error",
                description: "Something went wrong. Please try again.",
                color: "danger",
            });
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <PaymentElement />

            <CustomButton type="submit" fullWidth isLoading={isLoading}>
                Pay Now
            </CustomButton>
        </form>
    );
}

/* -------------------------------------------------------------------------- */
/*                              Stripe Wrapper                                */
/* -------------------------------------------------------------------------- */

export default function StripePaymentForm({
    amount,
    intent,
    id,
    linkID,
    type
}: StripePaymentFormProps) {
    const amountInCents = Math.round(amount * 100);

    const options: StripeElementsOptions = {
        mode: "payment",
        currency: "usd",
        amount: amountInCents,
        appearance: {
            theme: "stripe",
        },
    };

    return (
        <Elements stripe={stripePromise} options={options}>
            <PaymentForm intent={intent} id={id} linkID={linkID} type={type} />
        </Elements>
    );
}
