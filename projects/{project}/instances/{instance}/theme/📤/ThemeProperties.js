
import {instance} from '🔗';

let overrides = instance.get().theme;

let props = instance.get().source.theme().properties().map((p)=>{
    let html5 = 'text';

    if (p.type == 'color'){
        html5 = 'text'; // no safari support for 'color'. and regardless, 'color' doesn't support rgb()
    } else if (p.type == 'url'){
        html5 = 'url';
    }

    return ({
        title: p.name,
        name: p.name,
        html5: html5,
        type: p.type,
        placeholder: p.stringValue,
        value: overrides[p.name]
    });
});

export {props as ThemeProperties};