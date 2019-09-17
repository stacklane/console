import {version} from '🔗';

let source = version.get().source;
let exists = source.exists();

let notExists = !exists;
let existsCC = 0;

if (exists) existsCC = 600;

export {source as VersionSource, exists as VersionSourceExists, notExists as VersionSourceNotExists, existsCC as VersionSourceExistsCacheControlSeconds};
