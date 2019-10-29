
import {star, tag /*, title*/} from 'form';
import {ProjectUser} from '📦';
import {GetProjectUserDetails} from '📤';
import {project} from '🔗';

let p = ProjectUser.me().get(project);

if (star != null){
    p.star = (star == 'true');
}

if (tag != null){
    p.tag = tag;
}

//if (title != null){
//    p.name = title;
//}

//GetProjectUserDetails(p);

({updated:true});