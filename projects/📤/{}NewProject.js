
import {Source} from '🔌';
import {Identicon} from 'util';

let get = (url)=>{
    let source = Source.of(url);

    let info = {
        type:'',
        visible: false,
        value: source.value,
        ssh: false,
        exists: false,
        name: '',
        defaultName: source.name,
        icon: Identicon.of(source.name)
    };

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

        if (source.icon()) info.icon = source.icon();
    } else {
        info.visible = false;
        info.exists = false;
    }

    return info;
};

export {get as NewProjectGetInfo};