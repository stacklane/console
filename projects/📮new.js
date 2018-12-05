
import {url} from 'form';
import {Source} from '🔌';
import {Me} from '👤';
import {Project, ProjectUser, ProjectInstance} from '📦';

if (!Source.isValidURLFormat(url)) throw Messages.fieldError('url', 'Invalid source URL: ' + url);

let project = new Project().source(url);

project.name = project.source.name;

project(()=>{
    new ProjectUser().user(Me).star(true);
});

({redirect: Redirect.dir('projects').dir(project.id).success('New Project created')});

