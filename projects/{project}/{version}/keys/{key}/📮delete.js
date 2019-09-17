import {key,project} from '🔗';
import {KeysRedirect} from '📤';

key.get().remove();

({redirect: KeysRedirect.success('Key successfully deleted')});