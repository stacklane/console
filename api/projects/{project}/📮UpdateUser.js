
import {star, tag} from 'form';
import {ProjectUser} from '📦';

let p = ProjectUser.me().get();

if (star != null){
    p.star = (star == 'true');
}

if (tag != null){
    p.tag = tag;
}
