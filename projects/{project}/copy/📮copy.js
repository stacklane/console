
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
    .theme(current.theme);

projectCopy.name = projectCopy.source.name;

projectCopy(()=>{
    new ProjectUser().user(Me).parent(current);
});

ProjectKey.all().modify((key)=>{
    projectCopy(()=>key.copy());
});

// Back to 'parent':
({redirect: `/projects/${current.id}/`, success: 'Copy created.'});