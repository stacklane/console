import {version} from '🔗';

let source = version.get().source;
let exists = source.exists();

let type = {github: false, bitbucket: false, stacklane: false}

if (source.type == 'GitHub') type.github = true;
else if (source.type == 'Bitbucket') type.bitbucket = true;
else if (source.type == 'Stacklane') type.stacklane = true;

let notExists = !exists;
let existsCC = 0;

if (exists) existsCC = 600;

export {source as VersionSource, exists as VersionSourceExists, type as VersionSourceType,
    notExists as VersionSourceNotExists, existsCC as VersionSourceExistsCacheControlSeconds};
