
import {name, token, context} from "form";
import {ProjectKey} from '📦';

let pk = new ProjectKey().type('api').name(name);

if (context == 'test') pk.context('test');

pk.data().put('token', token);

({redirect: '.', success:'New project key created'});

