
import {url} from "form";
import {org} from '🔗';
import {Project, ProjectUser} from '📦';
import {IsReservedWord} from "📤";

if (url == null || !url.startsWith("https://github.com/") || !url.endsWith(".git")){
    throw ({field:'url', error: 'Invalid github.com URL'});
}

// Format: https://github.com/org/repo.git

let split = url.split('/');
let orgId = split[3];
let projectId = split[4].split('.')[0];

if (orgId != org.uid){
    // When org in GH URL differs from current org, prepend to final project ID.
    projectId = orgId + '-' + projectId;
}

if (IsReservedWord(projectId)) throw ({warn: `Project ID "${projectId}" is reserved.`});
if (Project.uid(projectId).count()) throw ({warn: `Project "${projectId}" already exists for "${orgId}"`});

let project = new Project().uid(projectId).source(url);

project(() => {
    let projectUser = ProjectUser.me(); // TODO group
});

({redirect: `/${org.uid}/${projectId}/`, success: `New project "${projectId}" created`});

