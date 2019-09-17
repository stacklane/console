
import {SelectedProperties, CurrentHome} from '📤';
import {version} from '🔗';
import {Form} from 'form{}';

let overrides = version.get().properties;

SelectedProperties.forEach((p)=>{
    if (p.type == 'boolean'){
        // Checkbox
        if (Form.has(p.name)){
            overrides[p.name] = 'true';
        } else {
            overrides[p.name] = 'false';
        }
    } else {
        let value = Form[p.name];
        if (value) {
            overrides[p.name] = value;
        } else {
            delete overrides[p.name];
        }
    }
});

({redirect: CurrentHome.success('Updates applied at next deployment')});