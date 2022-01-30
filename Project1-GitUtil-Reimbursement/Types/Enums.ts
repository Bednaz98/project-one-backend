
// used for determining the status of a Reimbursement request
export enum RequestStatus{
    Pending,
    Denied,
    Approved,
    deleted,
    All
}

export enum HTTPCommands{
    CreateProfile,
    Login,
    LogOut,
    ChangeFirstName,
    ChangeLastName,
    ChangePassword,
    GetManageName,
    MakeRequest,
    DeleteRequest,
    GetAllSentRequest,
    ManageChangeRequest,
    ManagerGetAllRequest,
    AdminCreateProfile,
    AdminGetAllEmployees,
    AdminAssignManager,
    AdminRemoveEmployee,
    AdminDeleteProfile,
    GetRecords,
    CheckAdminPermissions,
    CheckManagerPermissions
}

// used for indicating switch codes for communicating over http
export enum HTTPRequestErrorFlag{
    /**0 used tp verify first and last name length*/
    NameToShort,
    /**1 used to verify first and last name illegal character usage*/
    NameCharError,
    /**2 used to verify password criteria*/
    PasswordInitError,
    /**3  used if the manager does not exist when first creating a profile*/
    InitManagerNotExist,
    /**4   used if any employee listed is not found on the server when trying create a profile*/
    InitEmployeeError,
    /**5 used to indicate that the server failed to create a profile*/
    ProfileServerCreationError, 
    /**6 Used to indicate that the first and last name used to generate an initial id already exist*/
    ProfileAlreadyExist,
    /**7 used to indicate that the manager ID request could not be found when searching for a name*/
    ManagerNameNotFound,
    /**8 used to indicate that the employee ID sent does not correspond to a manager, the ID may still be a valid employee*/
    NotAManager,
    /**9 Used as a general notification that the given employee ID does not exist does not exist on in the database*/
    EmployeeNotFoundGeneral,
    /**10 used when the server fails to create a request*/
    RequestCreationError,
    /**11 Used when the Server is having problems updating a profile*/
    ProfileUpdateError,
    /**12 Used to indicate that the server could not find the request*/
    RequestNotFound,
    /**13 Used to indicate that the server could not update the request*/
    RequestUpdateError,
    /**14 Used to indicate that the employee does not have access to the request*/
    EmployeeRequestAccessError,
    /**15 Used to indicate that the server failed to delete a request*/
    RequestDeletionError,
    /**16 Used to indicate that a filter request type was denied*/
    RequestFilterDenied,
    /**17 used to identity that a request was previously approved and denied and can no longer be marked for as deleted*/
    RequestChangeStatusError,
    /**18 used to indicated that a manager can't mark employees request as deleted*/
    RequestManagerDeleteError,
    /**18 used to indicated that a manager can't mark employees request as all*/
    RequestManagerInvalidType,
    /**19 used when a manager does not have privileges to edit a request*/
    ManagerNotValidPrivileges,
    /**20 used to indicate that the employee to assign is not found*/
    EmployeeAssignmentError,
    /**21 used to indicate that the manager to assign is not found*/
    ManagerAssignmentError,
    /**22 used to indicate that the un-assignment process failed on the server*/
    UnAssignError,
    /**23 used to indicate that the user was not registered for authentication*/
    AuthenticationNotFound,
    /**24 used to indicate that the input authentication string does not match the server string*/
    AuthenticationStringError,
    /**25 used as a default value for the system. THIS SHOULD NOT BE USED*/
    Unknown,
    


}