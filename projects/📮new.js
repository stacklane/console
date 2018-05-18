
import {url} from "form";
import {org} from '🔗';
import {Me} from '👤'
import {Project, ProjectUser} from '📦';

// Format: https://github.com/org/repo.git

if (url == null || !url.startsWith("https://github.com/") || !url.endsWith(".git")){
    throw ({field:'url', error: 'Invalid github.com URL'});
}

let project = new Project().source(url);

project(()=>{
    new ProjectUser().user(Me).folder('New').role('Owner');
});

({redirect: `/projects/${project.id}/`, success: `New project created`});

