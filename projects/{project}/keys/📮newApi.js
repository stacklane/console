
import {name, token} from "form";
import {ProjectKey} from '📦';

let pk = new ProjectKey().type('api').name(name);

pk.data().put('token', token);

({redirect: '.', success:'New project key created'});

