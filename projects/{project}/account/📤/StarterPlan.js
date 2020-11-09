
import {StripePlanInfo, CurrencyParam} from '📤';
import {plans} from 'stripe.com';

let currency = CurrencyParam;
let interval = 'month';
let planId = 'starter';

let planListRaw = plans.list({active:'true', limit: '100' /*, "expand[]": "data.product"*/});

let planList = planListRaw.data.filter(
    plan=>plan.metadata.plan == planId && plan.currency == currency && plan.interval == interval
);

let fullPlan = {
    name: 'Launch Plan',
    eur: currency == 'eur',
    usd: currency == 'usd',
    currency: currency,
    interval: interval,
    amount: 0,

    baseLocations: 0,
    baseUnits: 0,
    baseAmount: 0,
    baseId: '',

    usageUnitGroup: 0,
    usageUnitAmount: 0,
    usageId: '',

    projectId: '',
    projectAmount: 0,

    firstMonthFree: true
};

planList.forEach(plan=>{

    if (plan.usage_type == 'metered') {

        fullPlan.usageUnitAmount = plan.amount / 100;
        fullPlan.usageUnitGroup = plan.transform_usage.divide_by;
        fullPlan.usageId = plan.id;

    } else if (plan.metadata.type == 'projects'){

        fullPlan.projectAmount = plan.amount / 100;
        fullPlan.projectId = plan.id;

    } else if (plan.metadata.included_units > 0){

        fullPlan.baseLocations = plan.metadata.locations;
        fullPlan.baseUnits = plan.metadata.included_units;
        fullPlan.baseAmount = plan.amount / 100;
        fullPlan.baseId = plan.id;

    }

});

fullPlan.amount = fullPlan.baseAmount + fullPlan.projectAmount;

export {fullPlan as StarterPlan};