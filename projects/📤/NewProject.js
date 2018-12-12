
import {url} from '&';
import {Source} from '🔌';

//let url2 = url;

let source = Source.of(url);

let info = {type:'', visible: false, value: source.value, ssh: false, exists: false, name: '', defaultName: source.name, icon: ''};

if (source.ssh){
    info.visible = true;
    info.ssh = true;
    info.name = source.name;
    info.type = source.type;
} else if (source.exists()){
    info.visible = true;
    info.exists = true;
    info.name = source.manifest().name;
    info.type = source.type;
    //info.icon = // TODO retrieve contents of 🎛.svg after validating that it's a valid xml file: source.icon();
} else {
    info.visible = false;
    info.exists = false;
}

export {info as NewProjectInfo};