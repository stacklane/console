
import {NewProjectGetInfo, NewProjectForm} from '📤';

let info = NewProjectGetInfo(NewProjectForm.Begin.view().source.value.value);

info.form = NewProjectForm.End.view({name: info.name});

export {info as NewProjectInfo};