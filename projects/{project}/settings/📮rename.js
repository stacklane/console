
import {newName} from 'form';
import {project} from '🔗';

if (project.get().name == newName){

    Messages.warning('Project name unchanged');
    ({redirect: '.', messages: Messages.now()});

} else {

    project.get().name = newName;
    Messages.success('Project renamed');
    ({redirect: '.', messages: Messages.now()});

}