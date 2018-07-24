
import {plans} from 'stripe.com';
import * as Theme from '🎨';
import {StripePlanInfo} from "📤";

let planId = Theme.stripe_plan_id();
let plan = plans(planId).get({"expand[]": "product"});
let planInfo = StripePlanInfo(plan);

export {planInfo as PlanInfo};
