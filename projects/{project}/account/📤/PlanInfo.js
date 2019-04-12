
import {plans} from 'stripe.com';
import * as Properties from '🎨';
import {StripePlanInfo} from "📤";

let planId = Properties['stripe-plan-id'];
let plan = plans(planId()).get({"expand[]": "product"});
let planInfo = StripePlanInfo(plan);

export {planInfo as PlanInfo};
