
import {sshRepo} from "form";
import {project} from '🔗';
import {ProjectKey} from '📦';

let pk = ProjectKey
    .newSSH('stacklane')
    .name(project.source.withRepository(sshRepo).main);

({
    redirect: Redirect
        .dir('projects').dir(project.id)
        .dir('keys').dir(pk.id)
        .success('New SSH key generated')
});
