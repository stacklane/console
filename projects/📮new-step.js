
import {Source} from '🔌';
import {Me, Role} from '👤';
import {Project, ProjectUser, ProjectVersion, App, AppVersion, AppUser} from '📦';
import {NewProjectForm, NewProjectGetInfo} from '📤';

try {

    let appForm = NewProjectForm.App.validate();
    let projectForm = NewProjectForm.Project.validate();
    let icon = NewProjectGetInfo(appForm.source.value.value).icon;

    // Overkill:
    //let app = new App();
    //let appUser = new AppUser(app).role(Role.AppOwner).user(Me);
    //let appVersion = new AppVersion(app);
    //appForm.submit(appVersion);

    let project = new Project().icon(icon);
    projectForm.submit(project);
    let projectUser = new ProjectUser(project).role(Role.ProjectOwner).user(Me).star(true);
    //let projectVersion = new ProjectVersion(project).app(appVersion);
    let projectVersion = new ProjectVersion(project).source(appForm.source.value);
    project.simple = projectVersion;

    ({redirect: Redirect.dir('projects').dir(project.id).success('New Project created')});

} catch ($ModelInvalid){

    ({redirect: Redirect.dir('projects').name('new-step').invalid($ModelInvalid)});

}
