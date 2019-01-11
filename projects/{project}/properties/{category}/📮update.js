
import {SelectedProperties} from '📤';
import {project} from '🔗';
import {Form} from 'form{}';

let overrides = project.get().properties;

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

({redirect: `/projects/${project.id}/`, success: `Properties updated.`});