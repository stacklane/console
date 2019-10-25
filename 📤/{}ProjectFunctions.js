
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
    //let p = project(()=>ProjectUser.me().get());
    let p = ProjectUser.project(project).user(Me).one();

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
    //return project(()=>ProjectUser.me().get()).star;
    return ProjectUser.project(project).user(Me).one().star;
};

export {
    IsProjectStarred, GetProjectUserDetails
};