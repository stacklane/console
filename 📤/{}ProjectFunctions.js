
import {Source} from '🔌';
import {ProjectUser} from '📦';
import {Me} from '👤';

/**
 * @param project - Model Link
 */
let GetProjectName = (project)=>{
    let custom = project(()=>ProjectUser.me().get().name);

    if (custom) return custom;

    try {
        return project.name;
    } catch (e){
        return 'NA'; // case not expected
    }
};

/**
 * @param project - Model
 */
let GetProjectNameModel = (project)=>{
    let custom = project(()=>ProjectUser.me().get().name);

    if (custom) return custom;

    try {
        return project.name;
    } catch (e){
        return 'NA'; // case not expected
    }
};

/**
 * @param project - Model
 */
let GetProjectTagsModel = (project)=>{
    let p = project(()=>ProjectUser.me().get());

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
        name: GetProjectNameModel(v.project()),
        star: v.star
    });
};

let IsProjectStarred = (project)=>{
    return project(()=>ProjectUser.me().get()).star;
};

export {
    GetProjectName, GetProjectNameModel, IsProjectStarred, GetProjectUserDetails
};