
import {Source} from '🔌';
import {ProjectUser} from '📦';
import {Me} from '👤';

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
    return ProjectUser.user(Me);
};

//let IsProjectNested = (project)=>{
//    return project(()=>ProjectUser.me().get()).parent.linked();
//};

let GetProjectHome = (project)=>{
    let pu = project(()=>ProjectUser.me().get());
    if (pu.parent.linked()){
        return `/projects/${pu.parent.id}/`;
    } else {
        return `/projects/${project.id}/`;
    }
};

export {
    GetProjectName, GetProjectTags, GetProjectUserDetails,
    IsProjectStarred, /*IsProjectNested,*/ GetChildProjects, GetProjectHome
};