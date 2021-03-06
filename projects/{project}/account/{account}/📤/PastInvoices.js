
import {invoices} from 'stripe.com';
import {account} from '🔗';

let past = invoices.list({
    customer: account.stripeCustomerId
});

let out = {
    has: past.data.length > 0,
    items: []
};

past.data.forEach((invoice)=>{
    out.items.push({
        date: invoice.created,
        amount: invoice.amount_paid / 100,
        currency: invoice.currency
    });
});

export {out as PastInvoices};