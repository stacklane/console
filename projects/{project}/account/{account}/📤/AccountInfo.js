
import {account} from '🔗';
import {Project} from '📦';

let currentCount = Project.account(account).count();

let projects = Project.account(account);

export {currentCount as AccountProjectCount, projects as ProjectsForAccount};