
import {name, token, context, clientId, clientSecret} from "form";
import {ProjectVersionKey} from '📦';
import {KeysRedirect} from '📤';
import {version} from '🔗';

let pk = new ProjectVersionKey(version).type(ProjectVersionKey.type.api).name(name);

if (context) pk.context(context);

pk.data().put('token', token);

if (clientId) {
    pk.data().put('clientId', clientId);
    pk.data().put('clientSecret', clientSecret);
}

({redirect: KeysRedirect.success('New Key created')});

