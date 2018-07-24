
import {account} from '🔗';
import {subscriptions} from 'stripe.com';
import {StripePlanInfo} from "📤";

let subscriptionId = account.stripeSubId;

let subscription = subscriptions(subscriptionId).get({"expand[]": "plan.product"});

let info = {
    quantity: subscription.quantity,
    ended_at: subscription.ended_at,
    canceled_at: subscription.canceled_at,
    plan: StripePlanInfo(subscription.plan)
};

export {info as SubscriptionInfo};