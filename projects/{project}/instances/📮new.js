
import {url} from 'form';
import {Source} from '🔌';
import {Me} from '👤';
import {ProjectInstance} from '📦';
import {project} from '🔗';

if (!Source.isValidURLFormat(url)) throw ({field:'url', error: 'Invalid source URL: ' + url});

new ProjectInstance().source(url);

({redirect: `/projects/${project.id}/`, success: `New instance created`});

