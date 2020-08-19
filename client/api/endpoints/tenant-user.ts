import {KubeObject} from "../kube-object";
import {KubeApi} from "../kube-api";
import {autobind} from "../../utils";
import {apiTenant} from "../index";

@autobind()
export class TenantUser extends KubeObject {
    static kind = "BaseUser";

    spec: {
        name: string,
        department_id: string,
        display: string,
        email: string,
        password: string
        roles?: string[]
    }
}

export const tenantUserApi = new KubeApi({
    kind: TenantUser.kind,
    apiBase: "/apis/fuxi.nip.io/v1/baseusers",
    isNamespaced: true,
    objectConstructor: TenantUser,
    request: apiTenant
});