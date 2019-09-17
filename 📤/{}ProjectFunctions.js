
import {Source} from '🔌';
import {ProjectUser} from '📦';
import {Me} from '👤';

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
        name: v.project().name,
        star: v.star
    });
};

let IsProjectStarred = (project)=>{
    return project(()=>ProjectUser.me().get()).star;
};

export {
    IsProjectStarred, GetProjectUserDetails
};