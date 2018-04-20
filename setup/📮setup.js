
import {url} from "form";
import {Org, OrgUser, Project, ProjectUser} from '📦';

// TODO verify they don't have any org's at all to be accessing this script.

// TODO check for existing/dup org id.

if (url == null || !url.startsWith("https://github.com/") || !url.endsWith(".git")){
    throw ({field:'url', error: 'Invalid github.com URL'});
}

// Format: https://github.com/org/repo.git

try {

    let split = url.split('/');
    let orgId = split[3];
    let projectId = split[4].split('.')[0];

    let org = new Org().uid(orgId);

    let project = org(() => {
        let orgUser = OrgUser.me(); // TODO group

        let project = new Project().uid(projectId).source(url);

        project(() => {
            let projectUser = ProjectUser.me(); // TODO group
        });

        return project;
    });

    ({redirect: `/${orgId}/${projectId}/`, success: 'New project "' + projectId + '" created'});

} catch (e){

    ({error: e.message});

}