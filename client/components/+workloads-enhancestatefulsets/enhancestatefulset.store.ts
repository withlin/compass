import { observable } from "mobx";
import { autobind } from "../../utils";
import { KubeObjectStore } from "../../kube-object.store";
import { IPodMetrics, podsApi, PodStatus, EnhanceStatefulSet, enhanceStatefulSetApi, Stone } from "../../api/endpoints";
import { podsStore } from "../+workloads-pods/pods.store";
import { apiManager } from "../../api/api-manager";

@autobind()
export class EnhanceStatefulSetStore extends KubeObjectStore<EnhanceStatefulSet> {
  api = enhanceStatefulSetApi
  @observable metrics: IPodMetrics = null;

  loadMetrics(statefulSet: EnhanceStatefulSet) {
    const pods = this.getChildPods(statefulSet);
    return podsApi.getMetrics(pods, statefulSet.getNs(), "").then(metrics =>
      this.metrics = metrics
    );
  }

  getEnhanceStatefulSetByOwner(stone: Stone): EnhanceStatefulSet[] {
    if (!stone) return [];
    return this.items.filter(enhanceStatefulSet => {
      const owners = enhanceStatefulSet.getOwnerRefs()
      if (!owners.length) return
      return owners.find(owner => owner.uid === stone.getId())
    })
  }

  getChildPods(statefulSet: EnhanceStatefulSet) {
    return podsStore.getPodsByOwner(statefulSet)
  }

  getStatuses(statefulSets: EnhanceStatefulSet[]) {
    const status = { failed: 0, pending: 0, running: 0 }
    statefulSets.forEach(statefulSet => {
      const pods = this.getChildPods(statefulSet)
      if (pods.some(pod => pod.getStatus() === PodStatus.FAILED)) {
        status.failed++
      }
      else if (pods.some(pod => pod.getStatus() === PodStatus.PENDING)) {
        status.pending++
      }
      else {
        status.running++
      }
    })
    return status
  }

  reset() {
    this.metrics = null;
  }
}

export const enhanceStatefulSetStore = new EnhanceStatefulSetStore();

apiManager.registerStore(enhanceStatefulSetApi, enhanceStatefulSetStore);
