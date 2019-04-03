
import {url, name, dataRegion} from 'form';
import {Source} from '🔌';
import {Me, Role} from '👤';
import {Project, ProjectUser, ProjectInstance} from '📦';
import {NewProjectGetInfo} from '📤';

if (!Source.isValidURLFormat(url)) throw Messages.fieldError('url', 'Invalid source URL: ' + url);

if (dataRegion != 'us' && dataRegion != 'eu') throw Messages.fieldError('dataRegion', 'Invalid data region: ' + dataRegion);

let project = new Project()
    .source(url)
    .region(dataRegion)
    .icon(NewProjectGetInfo(url).icon);

project.name(name ? name : project.source.name);

project(()=>{
    new ProjectUser().role(Role.ProjectOwner).user(Me).star(true);
});

({redirect: Redirect.dir('projects').dir(project.id).success('New Project created')});
