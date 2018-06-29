
import {Source} from '🔌';
import {ProjectUser} from '📦';

/**
 * @param project - May be a model link or actual model.
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
 * @param project - May be a model link or actual model.

let GetProjectFolder = (project)=>{
    let tag = project(()=>ProjectUser.me().get().tag);

    if (tag) return tag;

    return '';
};
 */

/**
 * @param project - May be a model link or actual model.
 */
let GetProjectTags = (project)=>{
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
        tags: GetProjectTags(v.project()),
        name: GetProjectName(v.project()),
        star: v.star
    });
}

export {GetProjectName, GetProjectTags, GetProjectUserDetails}