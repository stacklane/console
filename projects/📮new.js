
import {url} from "form";
import {Source} from "🔌";
import {org} from '🔗';
import {Me} from '👤'
import {Project, ProjectUser} from '📦';

// Format: https://github.com/org/repo.git

if (!Source.isValidURLFormat(url)){
    throw ({field:'url', error: 'Invalid source URL: ' + url});
}

let project = new Project().source(url);

project(()=>{
    new ProjectUser().user(Me).star(true).role('Owner');
});

({redirect: `/projects/${project.id}/`, success: `New project created`});

