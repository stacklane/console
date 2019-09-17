
import {project} from '🔗';
import {ref, newName} from 'form';
import {Source} from '🔌';
import {Me, Role} from '👤';
import {Project, ProjectUser, ProjectKey} from '📦';
import {Identicon} from 'util';

if (!ref || ref.length == 0) throw Messages.fieldError('ref', 'Choose a branch/tag');
if (!newName || newName.length == 0) throw Messages.fieldError('newName', 'New project name is required');

let current = project.get();

let projectCopy = new Project()
    .name(newName)
    .region(current.region)
    .icon(current.icon)
    .source(current.source.withReferenceValue(ref))
    .properties(current.properties);

/**
 * Assign ProjectUser
 */
projectCopy(()=>{
    new ProjectUser().user(Me).role(Role.ProjectOwner).star(true);
});

/**
 * Copy current ProjectKey's to the newly copied Project.
 */
ProjectKey.all().modify((key)=>{
    projectCopy(()=>key.copy());
});

/**
 *
 */
({redirect: Redirect.dir('projects').dir(projectCopy.id).success('Copy created')});