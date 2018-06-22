
import {url} from "form";
import {Source} from "🔌";
import {Me} from '👤'
import {Project, ProjectUser, ProjectVersion} from '📦';

// Format: https://github.com/org/repo.git

if (!Source.isValidURLFormat(url)){
    throw ({field:'url', error: 'Invalid source URL: ' + url});
}

let project = new Project();

project(()=>{
    let v = new ProjectVersion().source(url);

    project.primary = v;

    new ProjectUser().user(Me).star(true).role('Owner');
});

({redirect: `/projects/${project.id}/`, success: `New project created`});

