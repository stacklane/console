
import {customers, subscriptions} from 'stripe.com';
import {stripeToken} from 'form';
import * as Theme from '🎨';
import {Me} from '👤';
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
        /* how? "items[0][metadata][project]": project.id,*/
        customer: customer.id
    });

    let account = new Account()
        .stripeCustomerId(customer.id)
        .stripeSubscriptionId(subscription.id);

    account(() => {
        new AccountUser().user(Me).role('Owner');
    });

    project.get().account = account;

    ({redirect: `/projects/${project.id}/`, success: 'Billing for this Project has been enabled.'});
} catch (e){
    ({error: 'error: ' + e.message});
}


