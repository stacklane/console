
import {project} from '🔗';
import {branch} from 'form';
import {Source} from '🔌';
import {Me} from '👤';
import {Project, ProjectUser, ProjectKey} from '📦';

let current = project.get();

let newBranch = branch;

if (!branch) newBranch = current.source.branch;

let projectCopy = new Project()
    .source(current.source.withBranch(newBranch))
    .properties(current.properties);

projectCopy.name = projectCopy.source.name;

projectCopy(()=>{
    let pu = new ProjectUser().user(Me);
    let currentParent = current(()=>ProjectUser.me().get()).parent;
    if (!currentParent.linked()){
        /**
         * Nest
         */
        pu.parent = current;
    } else {
        /**
         * We don't currently allow more than one layer of nesting, so if you try to copy
         * an already nested project, it simply ends up under the same parent.
         */
        pu.parent = currentParent;
    }
});

/**
 * Copy ProjectKey's to the new parent / new Project copy.
 */
ProjectKey.all().modify((key)=>{
    projectCopy(()=>key.copy());
});

/**
 * Back to 'parent'.
 */
({redirect: `/projects/${current.id}/`, success: 'Copy created.'});