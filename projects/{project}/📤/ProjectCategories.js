import {project} from '🔗';

let categories = project.get().source.properties().categories();

let HasCategories = categories.length > 0;

let HasStyle = categories.filter((c)=>c.name=='style').length == 1;
let HasMessages = categories.filter((c)=>c.name=='messages').length == 1;
let HasOptions = categories.filter((c)=>c.name=='options').length == 1;

export {HasCategories, HasStyle, HasMessages, HasOptions};