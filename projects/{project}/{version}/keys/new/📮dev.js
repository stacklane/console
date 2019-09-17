
import {project, version} from '🔗';
import {Mapping} from '🔌';
import {KeysRedirect} from '📤';

let mapping = Mapping.test().keys(version);

let dev = mapping.createDevToken(project.name);

Messages.data('devToken', dev);

({redirect: KeysRedirect.name('dev').success('New dev token generated')});