/**
 * Words that are unavailable to be used as org/project UID
 * since they may conflict with other REST paths/directories.
 */
let reserved = (check)=>{

    let words = [
        'auth','session','style','js','assets','setup','admin',
        'system','manage','orgs','user','settings','profile',
        'projects','organization','org','organizations',
        'site','sites',
        'project','new',
        'blueprint','blueprints'
    ];

    // TODO 'includes' would be cleaner
    //return words.includes(check);

    return words.filter((w)=>(w == check)).length > 0;

};

export {reserved as IsReservedWord};