
import {Source} from '🔌';
import {Me, Role} from '👤';
import {project as projectPath} from '🔗';
import {Project, ProjectUser, ProjectVersion, ProjectVersionKey, ProjectDeployment, Domain, DomainUser, ProjectKey} from '📦';

let project = projectPath.get();

let version = new ProjectVersion(project)
    .source(project.source)
    .properties(project.properties);

project.simple = version;

if (project.mapping){
    let deploy = new ProjectDeployment(project);
    deploy.version = version;
    deploy.path = '/';
    deploy.www = project.mapping.www;
    deploy.ip = project.mapping.ip;
    deploy.name = project.mapping.name;
    deploy.record = project.mapping.record;

    let domain = new Domain().name(project.mapping.domain.name).domain(project.mapping.domain);
    new DomainUser(domain).role(Role.DomainOwner).user(Me);
    deploy.domain = domain;
}

ProjectKey.all().modify((key)=>{

    let newKey = new ProjectVersionKey(version);
    newKey.type = key.type;
    newKey.name = key.name;
    newKey.context = key.context;
    key.data().copyTo(newKey);

    key.remove();

});

Redirect.home().dir('projects').dir(project.id);






