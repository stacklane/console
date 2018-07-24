let get = (plan)=>{ // expects expanded product
    return ({
        id: plan.id,
        amount: plan.amount / 100, // pennies to dollars
        currency: plan.currency,
        tiered: plan.billing_scheme == 'tiered',
        interval: plan.interval, // day, week, month or year
        interval_count: plan.interval_count,
        name: plan.product.name
    });
};

export {get as StripePlanInfo}
