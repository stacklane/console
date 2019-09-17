
import {key} from '🔗';
import {ProjectVersionKey} from '📦';

let KeyIsUserType = key.type == ProjectVersionKey.type.user;
let KeyIsApiType = key.type == ProjectVersionKey.type.api;
let KeyIsSSHType = key.type == ProjectVersionKey.type.ssh;
let KeyIsEnabled = key.state == ProjectVersionKey.state.enabled;

let KeySSHPublic = '';

if (KeyIsSSHType){
    KeySSHPublic = key.get().data().show('public');
    if (!KeySSHPublic) KeySSHPublic = '';
}

export {KeyIsUserType, KeyIsApiType, KeyIsSSHType, KeySSHPublic, KeyIsEnabled};

