
import {coupons, customers, subscriptions, subscription_items} from 'stripe.com';
import {stripeToken, promo} from 'form';
import {Me, Role} from '👤';
import {Account, AccountUser} from '📦';
import {project} from '🔗';
import {StarterPlan} from '📤';

if (!stripeToken || !stripeToken.startsWith('tok_')){
    throw ({error: 'Invalid card token'});
}

let plan = StarterPlan;

if (!plan.projectAmount || !plan.baseAmount || !plan.usageUnitAmount || !plan.baseUnits){
    throw ({error: 'Invalid plan'});
}

if (promo && promo.length > 0){
    let valid = false;
    try {
        valid = coupons(promo).get().valid;
    } catch (e) {
        valid = false;
    }
    if (!valid) throw ({error: 'Invalid promo code'});
}

let customer = customers.create({
    email: Me.email,
    source: stripeToken
});

try {
    let account = new Account();

    let subscription = subscriptions.create({
        "items[0][plan]": plan.projectId,
        "items[1][plan]": plan.baseId,
        "items[2][plan]": plan.usageId,
        customer: customer.id,
        coupon: promo,
        "metadata[account]": account.id
    });

    let projectPlanItem = subscription.items.data[0];
    let basePlanItem = subscription.items.data[1];
    let usagePlanItem = subscription.items.data[2];

    account
        .baseUnits(plan.baseUnits)
        .stripeCustomerId(customer.id)
        .stripeSubId(subscription.id)
        .stripeSubItemId(projectPlanItem.id)
        .stripeSubItemBaseId(basePlanItem.id)
        .stripeSubItemUsageId(usagePlanItem.id);

    new AccountUser(account).role(Role.AccountOwner).user(Me);

    project.get().account = account;

    ({redirect: `/projects/${project.id}/`, success: 'Billing for this Project has been enabled.'});
} catch (e){
    throw ({error: 'error: ' + e.message});
}


