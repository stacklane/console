
import {ProjectUser} from '📦';
import {GetProjectName, GetProjectTags} from '📤';

let MyProjects = ProjectUser.me().all().map((v)=>{
    return ({
        id: v.id,
        project: v.project(),
        tags: GetProjectTags(v.project()),
        name: GetProjectName(v.project()),
        star: v.star
    });
});

export {MyProjects};
