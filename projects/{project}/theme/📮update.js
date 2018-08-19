
import {ThemeProperties} from '📤';
import {project} from '🔗';
import {Form} from 'form{}';

let current = project.get().theme;

ThemeProperties.forEach((p)=>{
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
            current[p.name] = null;
        }
    }
});

({redirect: `/projects/${project.id}/`, success: `Theme settings updated.`});