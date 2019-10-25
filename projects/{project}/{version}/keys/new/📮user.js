
import {identityType, clientId, secret, context} from "form";
import {ProjectVersionKey} from '📦';
import {KeysRedirect} from '📤';
import {version} from '🔗';

if (identityType != 'github' && identityType != 'google'){
    throw ({field:'identityType', error: 'Invalid user identity type.'});
}

let pk = new ProjectVersionKey(version).type(ProjectVersionKey.type.user).name(identityType);

if (context) pk.context(context);

pk.data().put('clientId', clientId)
pk.data().put('secret', secret);

({redirect: KeysRedirect.success('New Key created')});

