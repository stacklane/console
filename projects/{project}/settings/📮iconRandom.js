
import {project} from '🔗';
import {Identicon} from 'util';

project.get().icon = Identicon.random();

({redirect: Redirect.index().success('Project icon updated. Allow 1-2 minutes to see it updated.')});