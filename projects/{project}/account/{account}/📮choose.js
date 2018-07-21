
import {account,project} from '🔗';
import {subscriptions, subscription_items} from 'stripe.com';
import {AccountUser} from '📦';
import * as Theme from '🎨';

if (project.get().account.linked()){
   throw ({error: 'This Project is already linked to a billing account.'});
}

account(()=>{
    /**
     * Verify there is actually an AccountUser for this Account,
     * otherwise a ModelNotFound error will be thrown.
     */
    AccountUser.me().get();
});

project.get().account = account;

let subscriptionId = account.get().stripeSubscriptionId;

subscription_items.create({
    subscription: subscriptionId,
    plan: Theme.stripe_plan_id()
});

({redirect: `/projects/${project.id}/`, success: 'Billing for this Project has been enabled.'});


