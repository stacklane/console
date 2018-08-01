
import {instance, project} from '🔗';
import {branch} from 'form';
import {Source} from '🔌';
import {ProjectInstance} from '📦';

let current = instance.get();

let newBranch = branch;

if (!branch) newBranch = current.source.branch;

let copy = new ProjectInstance()
    .source(current.source.withBranch(newBranch))
    .theme(current.theme);

({redirect: `/projects/${project.id}/`, success: 'Copy created.'});