
import {ProjectUser} from '📦';
import {GetProjectName, GetProjectTags} from '📤';

let MyProjectTags = ProjectUser.me().all()
    .flatMap((v)=>GetProjectTags(v.project())
    .distinct();

export {MyProjectTags};
