export function GetPrimaryConnectionKey():string{
    return String(process.env.CD_PK);
}

export function GetDataBaseName():string{
    return "test-banking-system-josh";
}

export function GetProfileContainerName():string{
    return "project1-RevSystem-Profiles";
}

export function GetRequestContainerName():string{
    return "project1-RevSystem-Request";
}