import {project} from '🔗';

let categories = project.get().source.properties().categories();

let CategoryInfo = {
    show: project.get().source.exists(),
    has: categories.length > 0,
    style: false,
    messages: false,
    options: false,
    cacheControl: 0
};

if (CategoryInfo.has){
    CategoryInfo.style = categories.filter((c)=>c.name=='style').length == 1;
    CategoryInfo.messages = categories.filter((c)=>c.name=='messages').length == 1;
    CategoryInfo.options = categories.filter((c)=>c.name=='options').length == 1;
    CategoryInfo.cacheControl = 600;
}

export {CategoryInfo};