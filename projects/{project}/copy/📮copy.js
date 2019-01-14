
import {project} from '🔗';
import {ref, newName} from 'form';
import {Source} from '🔌';
import {Me} from '👤';
import {Project, ProjectUser, ProjectKey} from '📦';
import {Identicon} from 'util';

if (!ref || ref.length == 0) throw Messages.fieldError('ref', 'Choose a branch/tag');
if (!newName || newName.length == 0) throw Messages.fieldError('newName', 'New project name is required');

let current = project.get();

let projectCopy = new Project()
    .icon(Identicon.random())
    .source(current.source.withReferenceValue(ref))
    .properties(current.properties);

projectCopy.name = newName;

projectCopy(()=>{
    /*let pu =*/ new ProjectUser().user(Me);

    // No nesting for now
    //let currentParent = current(()=>ProjectUser.me().get()).parent;
    //if (!currentParent.linked()){
        /**
         * Nest
         */
     //   pu.parent = current;
    //} else {
        /**
         * We don't currently allow more than one layer of nesting, so if you try to copy
         * an already nested project, it simply ends up under the same parent.
         */
     //   pu.parent = currentParent;
    // }
});

/**
 * Copy current ProjectKey's to the new Project copy.
 */
ProjectKey.all().modify((key)=>{
    projectCopy(()=>key.copy());
});

/**
 *
 */
({redirect: Redirect.dir('projects').dir(projectCopy.id).success('Copy created')});