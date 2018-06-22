
import {domain} from "form";
import {Domain} from "🔌";
import {version} from '🔗';
import {Me} from '👤'
import {Mapping} from '📦';

let versionLive = version.get();

versionLive.mapping.domain.verification.check();

if (versionLive.mapping.domain.verification.verified){
    ({success: `Domain successfully verified`});
} else {
    ({error: `Domain not verified`});
}