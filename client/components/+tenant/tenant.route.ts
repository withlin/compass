import {RouteProps} from "react-router"
import {buildURL, IURLParams} from "../../navigation";
import {Tenant} from "./tenant";

export const tenantRoute: RouteProps = {
    get path() {
        return Tenant.tabRoutes.map(({path}) => path).flat()
    }
}

export const tenantDepartmentRoute: RouteProps = {
    path: "/tenant-department"
}

export const tenantPermissionRoute: RouteProps = {
    path: "/tenant-permission"
}

export const tenantRoleRoute: RouteProps = {
    path: "/tenant-role"
}

export const tenantUserRoute: RouteProps = {
    path: "/tenant-user"
}


// Route params
export interface ITenantDepartmentParams {
}

export interface ITenantPermissionParams {
}

export interface ITenantRoleParams {
}

export interface ITenantUserParams {
}


// URL-builders
export const tenantURL = (params?: IURLParams) => tenantDepartmentURL(params);
export const tenantDepartmentURL = buildURL<ITenantDepartmentParams>(tenantDepartmentRoute.path)
export const tenantPermissionURL = buildURL<ITenantPermissionParams>(tenantPermissionRoute.path)
export const tenantRoleURL = buildURL<ITenantRoleParams>(tenantRoleRoute.path)
export const tenantUserURL = buildURL<ITenantUserParams>(tenantUserRoute.path)
