
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
 * @param project - Model link
 */
let GetProjectIcon = (project)=>{
    return project.icon;
};

/**
 * @param project - Model link
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
};

let IsProjectStarred = (project)=>{
    return project(()=>ProjectUser.me().get()).star;
};

let GetChildProjects = (project)=>{
    return ProjectUser.user(Me).parent(project).ancestor();
};

//let IsProjectNested = (project)=>{
//    return project(()=>ProjectUser.me().get()).parent.linked();
//};

export {
    GetProjectName, GetProjectNameModel, GetProjectIcon, GetProjectTags, GetProjectUserDetails,
    IsProjectStarred, GetChildProjects   /*IsProjectNested,*/  /*, GetProjectHome*/
};