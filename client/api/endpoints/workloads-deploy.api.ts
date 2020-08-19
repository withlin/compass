import get from "lodash/get";
import { WorkloadKubeObject } from "../workload-kube-object";
import { autobind } from "../../utils";
import { KubeApi } from "../kube-api";
import moment from "moment";
import { advanceFormatDuration } from "../../utils";

@autobind()
export class Deploy extends WorkloadKubeObject {
  static kind = "Workloads";

  spec: {
    // 这里需要优化,引用到外部的interface
    appName: string; // the app name
    resourceType: string;
    metadata: string; // the field record array container configuration
    service?: string;
    volumeClaims?: string;
  };

  status: {};

  getOwnerNamespace(): string {
    return get(this, "metadata.labels.namespace");
  }

  getAppName() {
    return get(this, "spec.appName");
  }

  getResourceType() {
    return get(this, "spec.resourceType");
  }

  getGenerateTimestamp() {
    if (this.metadata && this.metadata.creationTimestamp) {
      return this.metadata.creationTimestamp;
    }
    return "";
  }

  getCreated(humanize = true, compact = true, fromNow = false) {
    if (fromNow) {
      return moment(this.metadata.creationTimestamp).fromNow();
    }
    const diff =
      new Date().getTime() -
      new Date(this.metadata.creationTimestamp).getTime();
    if (humanize) {
      return advanceFormatDuration(diff, compact);
    }
    return diff;
  }

  getObject() {
    return get(this, "spec.metadata");
  }

  setMetadata(metadata: string) {
    this.spec.metadata = metadata;
  }
}

export const deployApi = new KubeApi({
  kind: Deploy.kind,
  apiBase: "/apis/fuxi.nip.io/v1/workloads",
  isNamespaced: true,
  objectConstructor: Deploy,
});
