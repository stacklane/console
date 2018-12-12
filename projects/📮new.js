
import {url} from 'form';
import {Source} from '🔌';
import {Me} from '👤';
import {Project, ProjectUser, ProjectInstance} from '📦';

if (!Source.isValidURLFormat(url)) throw Messages.fieldError('url', 'Invalid source URL: ' + url);

Messages.data('url', url);

({redirect: Redirect.dir('projects').name('new-step')});
