
import {invoices} from 'stripe.com';
import {account} from '🔗';

let upcoming = invoices.upcoming.get({
    customer: account.stripeCustomerId
});

let lines = [];

upcoming.lines.data.forEach((l)=>{
    lines.push(l.description);
});

let out = {
    nextPaymentAttempt: upcoming.next_payment_attempt,
    currency: upcoming.currency,
    amountDue: upcoming.amount_due / 100
};

export {out as UpcomingInvoice, lines as UpcomingInvoiceLines};