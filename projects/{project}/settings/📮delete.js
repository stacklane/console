import {project} from '🔗';
import {ProjectUser} from '📦';

if (project.get().mapping){
    throw Messages.error('Projects with domain mappings may not be deleted.');
}

if (ProjectUser.me().isSharing()){

    /**
     * Project is shared with another ProjectUser,
     * therefore don't delete the Project, only disassociate it with current user.
     */
    ProjectUser.me().get().remove();

    ({redirect: Redirect.home().success('Project was left shared with other users')});

} else {

    /**
     * Deleting unshared Project.
     */

    project.get().remove(); // Delete first, while 'me' still has access to it.
    ProjectUser.me().get().remove(); // This would cascade async, but we want to delete it sync, so explicit remove().

    ({redirect: Redirect.home().success('Deleted Project')});

}
