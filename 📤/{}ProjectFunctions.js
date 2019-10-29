
import {Source} from '🔌';
import {ProjectUser} from '📦';
import {Me} from '👤';

/**
 * @param versionLink - ProjectVersion
 */
//let GetProjectVersionSourceName = (versionLink)=>{

//};

/**
 * @param project - Model
 */
let GetProjectTagsModel = (project)=>{
    let p = ProjectUser.me().get(project);

    let out = [];

    if (p.tag) out.push(p.tag);

    return out;
};

/**
 * @param v - ProjectUser
 */
let GetProjectUserDetails = (v)=>{
    return ({
        id: v.id,
        project: v.project(),
        tags: GetProjectTagsModel(v.project()),
        name: v.project().name,
        star: v.star
    });
};

let IsProjectStarred = (project)=>{
    return ProjectUser.me().get(project).star;
};

export {
    IsProjectStarred, GetProjectUserDetails
};