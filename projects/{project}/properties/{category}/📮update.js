
import {SelectedProperties} from '📤';
import {project} from '🔗';
import {Form} from 'form{}';

let current = project.get().properties;

SelectedProperties.forEach((p)=>{
    if (p.type == 'boolean'){
        let currentValue = p.checked;
        let submittedValue = (Form[p.name] == 'on');
        if (currentValue != submittedValue){
            current[p.name] = submittedValue;
        }
    } else {
        let value = Form[p.name];
        if (value) {
            current[p.name] = value;
        } else {
            delete current[p.name];
        }
    }
});

({redirect: `/projects/${project.id}/`, success: `Properties updated.`});