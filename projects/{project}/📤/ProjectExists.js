import {project} from '🔗';

let exists = project.source.exists();
let notExists = !exists;
let existsCC = 0;

if (exists) existsCC = 600;

export {exists as ProjectExists, notExists as ProjectNotExists, existsCC as ProjectExistsCacheControlSeconds};
