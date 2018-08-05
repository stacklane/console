
import {account,project} from '🔗';
import {subscriptions, subscription_items} from 'stripe.com';
import {AccountUser, Project} from '📦';
import {AccountProjectCount} from '📤';

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

subscription_items(account.get().stripeSubItemId).update({
    quantity: AccountProjectCount + 1
});

project.get().account = account;

({redirect: `/projects/${project.id}/`, success: 'Billing for this Project has been enabled.'});


