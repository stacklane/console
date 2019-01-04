import {project} from '🔗';

let categories = project.get().source.properties().categories();

let ShowCategories = project.get().exists();

let HasCategories = false;
let HasStyle = false;
let HasMessages = false;
let HasOptions = false;

let CategoryCacheControlSeconds = 0;

if (ShowCategories){
    HasCategories = categories.length > 0;
    HasStyles = categories.filter((c)=>c.name=='style').length == 1;
    HasMessages = categories.filter((c)=>c.name=='messages').length == 1;
    HasOptions = categories.filter((c)=>c.name=='options').length == 1;
    CategoryCacheControlSeconds = 600;
}

export {ShowCategories, CategoryCacheControlSeconds, HasCategories, HasStyle, HasMessages, HasOptions};