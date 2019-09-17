
import {emailProviderType, emailScopeType, emailFrom, emailUsername, emailPassword} from "form";
import {ProjectVersionKey} from '📦';
import {KeysRedirect} from '📤';

if (emailProviderType == null || emailProviderType == '')
    throw ({field:'emailProviderType', error: 'Invalid email provider type.'});

let pk = new ProjectVersionKey().type(ProjectVersionKey.type.email).name(emailProviderType);

if (emailScopeType) pk.context(emailScopeType);

pk.data().put('from', emailFrom);
pk.data().put('user', emailUsername);
pk.data().put('pass', emailPassword);

({redirect: KeysRedirect.success('New Key created')});

