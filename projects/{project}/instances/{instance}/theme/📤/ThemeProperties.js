
import {instance} from '🔗';

let overrides = instance.get().theme;

let props = instance.get().source.theme().properties().map((p)=>{
    return ({
        title: p.name,
        name: p.name,
        type: p.type,
        placeholder: p.stringValue,
        value: overrides[p.name],
        color: p.type == 'color',
        string: p.type == 'string',
        boolean: p.type == 'boolean',
        checked: (p.type == 'boolean' && (overrides[p.name] == 'true' || p.stringValue == 'true'))
    });
});

export {props as ThemeProperties};