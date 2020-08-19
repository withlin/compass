import { KubeObject } from "../kube-object";
import { KubeApi } from "../kube-api";


export class SubNet extends KubeObject {
    static kind = "Subnet";

    spec: {
        protocol: string,
        cidrBlock: string,
        gateway: string,
        namespaces: any[],
        excludeIps: string[],
        private?: boolean,
        allowSubnets?: string[],
        natOutgoing?: boolean,
        gatewayType?: string,
    }
}

export const subNetApi = new KubeApi({
    kind: SubNet.kind,
    apiBase: "/apis/kubeovn.io/v1/subnets",
    isNamespaced: true,
    objectConstructor: SubNet,
});