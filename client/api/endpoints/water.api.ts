import get from "lodash/get";
import { IPodContainer } from "./pods.api";
import { IAffinity, WorkloadKubeObject } from "../workload-kube-object";
import { autobind } from "../../utils";
import { KubeApi } from "../kube-api";

@autobind()
export class Water extends WorkloadKubeObject {
  static kind = "Water"
  spec: {
    service: {
      ports: {
        name: string,
        protocol: string,
        port: number,
        targetPort: number,
      }[],
      type: string;
    };
    strategy: string;
    template: {
      metadata: {
        labels: {
          app: string;
        };
      };
      spec: {
        containers: {
          name: string;
          image: string;
          ports: {
            containerPort: number;
            name: string;
          }[];
          volumeMounts: {
            name: string;
            mountPath: string;
          }[];
        }[];
        affinity?: IAffinity;
        nodeSelector?: {
          [selector: string]: string;
        };
        tolerations: {
          key: string;
          operator: string;
          effect: string;
          tolerationSeconds: number;
        }[];
      };
    };
    volumeClaimTemplates: {
      metadata: {
        name: string;
      };
      spec: {
        accessModes: string[];
        resources: {
          requests: {
            storage: string;
          };
        };
      };
    }[];
  }
  status: {
    replicas: number;
    statefulset: number;
  }

  getImages() {
    const containers: IPodContainer[] = get(this, "spec.template.spec.containers", [])
    return [...containers].map(container => container.image)
  }
}

export const waterApi = new KubeApi({
  kind: Water.kind,
  apiBase: "/apis/nuwa.nip.io/v1/waters",
  isNamespaced: true,
  objectConstructor: Water,
});
