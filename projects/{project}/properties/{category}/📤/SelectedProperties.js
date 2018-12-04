
import {project as instance, category} from '🔗';

let overrides = instance.get().properties;

let props = instance.get().source.properties()
    .all()
    .filter((p)=>category.$value==p.category)
    .map((p)=>{

    return ({
        title: p.title ? p.title : p.name,
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

let hasProps = props.length > 0;

export {props as SelectedProperties, hasProps as HasSelectedProperties};