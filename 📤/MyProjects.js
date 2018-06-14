
import {ProjectUser} from '📦';
import {GetProjectUserDetails} from '📤';

let MyProjects = ProjectUser.me().all().map(GetProjectUserDetails);

export {MyProjects};
