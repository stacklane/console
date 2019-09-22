import {ref} from 'form';
import {version as versionPath} from '🔗';

if (!ref || ref.length == 0) throw Messages.fieldError('ref', 'Choose a branch/tag');

let version = versionPath.get();

// TODO this may not apply to ProjectVersion#app

version.source = version.source.withReferenceValue(ref);

({redirect: Redirect.index().success('Successfully Updated')});