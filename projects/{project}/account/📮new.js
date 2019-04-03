
import {customers, subscriptions} from 'stripe.com';
import {stripeToken, promo} from 'form';
import * as Theme from '🎨';
import {Me, Role} from '👤';
import {Account, AccountUser} from '📦';
import {project} from '🔗';

if (!stripeToken || !stripeToken.startsWith('tok_')){
    throw ({error: 'Invalid card token'});
}

let customer = customers.create({
    email: Me.email,
    source: stripeToken
});

try {
    let subscription = subscriptions.create({
        "items[0][plan]": Theme.stripe_plan_id(),
        customer: customer.id,
        coupon: promo
    });

    let subscriptionItem = subscription.items.data[0];

    let account = new Account()
        .stripeCustomerId(customer.id)
        .stripeSubId(subscription.id)
        .stripeSubItemId(subscriptionItem.id);

    account(() => {
        new AccountUser().role(Role.AccountOwner).user(Me);
    });

    project.get().account = account;

    ({redirect: `/projects/${project.id}/`, success: 'Billing for this Project has been enabled.'});
} catch (e){
    ({error: 'error: ' + e.message});
}


