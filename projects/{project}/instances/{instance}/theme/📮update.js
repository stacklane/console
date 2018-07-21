
import {ThemeProperties} from '📤';
import {instance, project} from '🔗';
import {Form} from 'form{}';

let current = instance.get().theme;

ThemeProperties.forEach((p)=>{
    if (p.type == 'boolean'){
        let currentValue = p.checked;
        let submittedValue = (Form[p.name] == 'on');
        if (currentValue != submittedValue){
            current[p.name] = submittedValue;
        }
    } else {
        current[p.name] = Form[p.name];
    }
});

({redirect: `/projects/${project.id}/`, success: `Theme settings updated.`});