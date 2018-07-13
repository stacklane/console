
import {ThemeProperties} from '📤';
import {instance, project} from '🔗';
import {Form} from 'form{}';

let current = instance.get().theme;

ThemeProperties.forEach((p)=>{
    current[p.name] = Form[p.name];
});

({redirect: `/projects/${project.id}/`, success: `Theme settings updated.`});