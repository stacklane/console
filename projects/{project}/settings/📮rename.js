
import {newName} from 'form';
import {project} from '🔗';

if (project.get().name == newName){

    ({redirect: Redirect.index().warning('Project name unchanged')});

} else {

    project.get().name = newName;

    ({redirect: Redirect.index().success('Project renamed')});

}