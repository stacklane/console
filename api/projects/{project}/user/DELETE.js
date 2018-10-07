
import {project} from '🔗';
import {ProjectUser} from '📦';

if (project.get().mapping){
    throw ({error: 'Projects with domain mappings may not be deleted.'});
}

if (ProjectUser.me().isSharing()){

    /**
     * Project is shared with another ProjectUser,
     * therefore don't delete the Project, only disassociate it with current user.
     */
    ProjectUser.me().get().remove();

    ({success: 'Project was left shared with other users.', redirect:'/' /* Back to dashboard */});

} else {

    /**
     * Deleting unshared Project.
     */

    project.get().remove(); // Delete first, while 'me' still has access to it.
    ProjectUser.me().get().remove(); // This will cascade async, but we want to delete it sync, so explicit remove().

    ({success: 'Deleted Project', redirect:'/' /* Back to dashboard */});

}