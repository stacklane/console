
import {ProjectUser} from '📦';
import {GetProjectName} from '📤';

let MyProjects = ProjectUser.me().all().map((v)=>{
    return ({
        'folder': v.folder /* may be null */ ,
        'project': v.project(),
        'name': GetProjectName(v.project()),
        'star': v.star
    });
});

export {MyProjects};
