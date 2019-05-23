
import {project} from '🔗';
import {AccountUser} from '📦';

let live = project.get();
let redirectBase = Redirect.dir('projects').dir(project.id).dir('account');

if (live.account.linked()){

    // Go to existing account:
    redirectBase.dir(live.account.id);

} else {
    try {

        // Check if at least one to choose from:
        AccountUser.me().all().get();
        redirectBase.name('choose');

    } catch ($ModelNotFound) {

        // Nothing to choose from:
        redirectBase.name('new');

    }
}