
import {project} from '🔗';
import {ProjectKey} from '📦';
import {Mapping} from '🔌';

let mapping = Mapping.test().keys(project);

let dev = mapping.createDevToken();

Messages.data('devToken', dev);

({
    redirect: Redirect
        .dir('projects')
        .dir(project.id)
        .dir('keys')
        .name('dev')
        .success('New dev token generated')
});
