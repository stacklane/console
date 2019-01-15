import {key,project} from '🔗';

key.get().remove();

({redirect: Redirect.dir('projects').dir(project.id).dir('keys').success('Key successfully deleted')});