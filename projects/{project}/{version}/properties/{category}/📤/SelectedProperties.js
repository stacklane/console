
import {category, version} from '🔗';
import {VersionSource} from '📤';

let overrides = version.get().properties;

let props = VersionSource.properties()
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
        checked: (p.type == 'boolean' && (overrides[p.name] == 'true' || (overrides[p.name] == null && p.stringValue == 'true')))
    });
});

let hasProps = props.length > 0;

export {props as SelectedProperties, hasProps as HasSelectedProperties};