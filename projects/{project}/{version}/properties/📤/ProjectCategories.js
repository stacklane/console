import {version} from '🔗';
import {VersionSource} from '📤';

let categories = VersionSource.properties().categories();

let CategoryInfo = {
    has: categories.length > 0,
    style: false,
    messages: false,
    options: false
};

if (CategoryInfo.has){
    CategoryInfo.style = categories.filter((c)=>c.name=='style').length == 1;
    CategoryInfo.messages = categories.filter((c)=>c.name=='messages').length == 1;
    CategoryInfo.options = categories.filter((c)=>c.name=='options').length == 1;
}

export {CategoryInfo};