
import {project} from '🔗';
import {AccountUser} from '📦';

let live = project.get();

if (live.account.linked()){

    // Go to existing account:
    `/projects/${live.id}/account/` + live.account.get().id + '/';

} else {
    try {

        // Check if at least one to choose from:
        AccountUser.all().get();
        `/projects/${project.id}/account/choose`;

    } catch ($ModelNotFound) {

        // Nothing to choose from:
        `/projects/${project.id}/account/new`;

    }
}