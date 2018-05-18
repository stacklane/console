
import {ProjectUser} from '📦';

let projects = ProjectUser.me().all().map((v)=>{
    return ({
        'folder': v.folder /* may be null */,
        'project': v.project()
    });
});

projects;
