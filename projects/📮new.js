
import {NewProjectForm} from '📤';

try {

    ({redirect: Redirect.dir('projects').name('new-step').form(NewProjectForm.App.validate())});

} catch ($ModelInvalid){

    ({redirect: Redirect.dir('projects').name('new').error("Invalid project source")});

}

