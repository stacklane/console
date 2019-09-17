
import {NewProjectGetInfo, NewProjectForm} from '📤';

let info = NewProjectGetInfo(NewProjectForm.App.view().source.value.value);

info.newProjectViewValues = {name: info.name};

export {info as NewProjectInfo};