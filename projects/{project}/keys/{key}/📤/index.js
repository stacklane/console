
import {key} from '🔗';

let KeyIsUserType = key.type == 'user';
let KeyIsApiType = key.type == 'api';
let KeyIsSSHType = key.type == 'ssh';
let KeyIsEnabled = key.state == 'enabled';

let KeySSHPublic = '';

if (KeyIsSSHType){
    KeySSHPublic = key.get().data().show('public');
    if (!KeySSHPublic) KeySSHPublic = '';
}

export {KeyIsUserType, KeyIsApiType, KeyIsSSHType, KeySSHPublic, KeyIsEnabled};

