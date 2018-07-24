
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
        date: invoice.date,
        amount: invoice.amount_paid / 100
    });
});

export {out as PastInvoices};