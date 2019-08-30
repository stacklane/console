
import {Source} from '🔌';
import {Me, Role} from '👤';
import {Project, ProjectUser, ProjectInstance} from '📦';
import {NewProjectForm, NewProjectGetInfo} from '📤';

try {

    let end = NewProjectForm.End.validate();

    let project = new Project().icon(NewProjectGetInfo(end.source.value.value).icon);

    end.submit(project);

    new ProjectUser(project).role(Role.ProjectOwner).user(Me).star(true);

    ({redirect: Redirect.dir('projects').dir(project.id).success('New Project created')});

} catch ($ModelInvalid){

    ({redirect: Redirect.dir('projects').name('new-step').invalid($ModelInvalid)});

}
