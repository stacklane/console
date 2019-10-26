
import {account,project} from '🔗';
import {subscriptions, subscription_items} from 'stripe.com';
import {AccountUser, Project} from '📦';
import {AccountProjectCount} from '📤';
import {Me} from '👤';

if (project.get().account.linked()){
   throw ({error: 'This Project is already linked to a billing account.'});
}

/**
 * Verify there is actually an AccountUser for this Account,
 * otherwise a ModelNotFound error will be thrown.
 */
AccountUser.account(account).user(Me).get();

subscription_items(account.get().stripeSubItemId).update({
    quantity: AccountProjectCount + 1,
    prorate: false
});

project.get().account = account;

({redirect: `/projects/${project.id}/`, success: 'Billing for this Project has been enabled.'});


