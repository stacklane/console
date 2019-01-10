
import {url, name} from 'form';
import {Source} from '🔌';
import {Me} from '👤';
import {Project, ProjectUser, ProjectInstance} from '📦';
import {NewProjectGetInfo} from '📤';

if (!Source.isValidURLFormat(url)) throw Messages.fieldError('url', 'Invalid source URL: ' + url);

let project = new Project().source(url);

project.name = name ? name : project.source.name;
project.icon = NewProjectGetInfo(url).icon;

project(()=>{
    new ProjectUser().user(Me).star(true);
});

({redirect: Redirect.dir('projects').dir(project.id).success('New Project created')});
