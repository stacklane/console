
import {sshRepo} from "form";
import {version} from '🔗';
import {ProjectVersionKey} from '📦';
import {KeysRedirect} from '📤';

let pk = ProjectVersionKey
    .newSSH(version)
    .name(version.source.withRepository(sshRepo).main);

({redirect: KeysRedirect.dir(pk.id).success('New SSH key generated')});
