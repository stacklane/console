
import {emailProviderType, emailScopeType, emailFrom, emailUsername, emailPassword} from "form";
import {ProjectKey} from '📦';

if (emailProviderType == null || emailProviderType == '')
    throw ({field:'emailProviderType', error: 'Invalid email provider type.'});

let pk = new ProjectKey().type('email').name(emailProviderType);

if (emailScopeType == 'test' || emailScopeType == 'live') pk.context(emailScopeType);

pk.data().put('from', emailFrom);
pk.data().put('user', emailUsername);
pk.data().put('pass', emailPassword);

({redirect: '.', success:'New project key created'});

