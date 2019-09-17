
import {name, token, context} from "form";
import {ProjectVersionKey} from '📦';
import {KeysRedirect} from '📤';

let pk = new ProjectVersionKey().type(ProjectVersionKey.type.api).name(name);

if (context) pk.context(context);

pk.data().put('token', token);

({redirect: KeysRedirect.success('New Key created')});

