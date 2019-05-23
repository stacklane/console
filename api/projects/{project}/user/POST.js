
import {star, tag /*, title*/} from 'form';
import {ProjectUser} from '📦';
import {GetProjectUserDetails} from '📤';

let p = ProjectUser.me().get();

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

null;