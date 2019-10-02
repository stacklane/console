let get = (plan)=>{ // expects expanded product
    let out = {
        id: plan.id,
        nickname: plan.nickname,
        amount: plan.amount / 100, // pennies to dollars
        currency: plan.currency,
        tiered: plan.billing_scheme == 'tiered',
        interval: plan.interval, // day, week, month or year
        interval_count: plan.interval_count,
        name: plan.product.name,
        original: plan
    };

    return out;
};

export {get as StripePlanInfo}
