
import {ProjectDeployment} from '📦';
import {Mapping} from '🔌';

let get = (deploy) => Mapping
                      .domain(deploy.name)
                      .token(deploy.token)
                      .units()
                      .week();

export {get as GetUnits};