
import {Source} from '🔌';
import {ProjectUser} from '📦';

/**
 * @param project - May be a model link or actual model.
 */
let GetProjectName = (project)=>{
    let custom = project(()=>ProjectUser.me().get().name);

    if (custom) return custom;

    try {
        return Source.get(project.source).name;
    } catch (e){
        return project.source; // Unlikely or impossible
    }
};

/**
 * @param project - May be a model link or actual model.
 */
let GetProjectTags = (project)=>{
    let p = project(()=>ProjectUser.me().get());

    let out = [];

    if (p.star) out.push(':star');

    out.push(p.tag ? p.tag : ':none');

    return out;
};


export {GetProjectName, GetProjectTags}