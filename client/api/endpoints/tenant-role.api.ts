import {KubeObject} from "../kube-object";
import {KubeApi} from "../kube-api";
import {autobind} from "../../utils";
import {apiPermission, apiTenant} from "../index";
import {KubeJsonApiData} from "../kube-json-api";

@autobind()
export class TenantRole extends KubeObject {
    static kind = "BaseRole";

    constructor(data: KubeJsonApiData) {
        super(data);
        apiPermission.get("/permission_transfer/" + this.spec.value).then((data: string[]) => this.permissions = data)
    }

    spec: {
        value: number
        comment?: string
    }
    permissions: string[]
}

export const tenantRoleApi = new KubeApi({
    kind: TenantRole.kind,
    apiBase: "/apis/fuxi.nip.io/v1/baseroles",
    isNamespaced: true,
    objectConstructor: TenantRole,
    request: apiTenant
});

