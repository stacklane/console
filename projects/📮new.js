
import {url} from 'form';
import {Source} from '🔌';
import {Me} from '👤';
import {Project, ProjectUser, ProjectInstance} from '📦';

// Format: https://github.com/org/repo.git

if (!Source.isValidURLFormat(url)){
    throw ({field:'url', error: 'Invalid source URL: ' + url});
}

let project = new Project();

project(()=>{
    new ProjectUser().user(Me).star(true);

    let instance = new ProjectInstance().source(url);

    project.name = instance.source.name;
});

({redirect: `/projects/${project.id}/`, success: `New project created`});

