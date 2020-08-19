import { observable } from "mobx";
import { autobind } from "../../utils";
import { KubeObjectStore } from "../../kube-object.store";
import { IPodMetrics, podsApi, PodStatus, Stone, stoneApi } from "../../api/endpoints";
import { podsStore } from "../+workloads-pods/pods.store";
import { apiManager } from "../../api/api-manager";
import { enhanceStatefulSetStore } from "../+workloads-enhancestatefulsets/enhancestatefulset.store";

@autobind()
export class StoneStore extends KubeObjectStore<Stone> {
  api = stoneApi
  @observable metrics: IPodMetrics = null;

  loadMetrics(stone: Stone) {
    const pods = this.getChildPods(stone);
    return podsApi.getMetrics(pods, stone.getNs(), "").then(metrics =>
      this.metrics = metrics
    );
  }

  getChildEnhanceStatefulset(stone: Stone) {
    return enhanceStatefulSetStore
      .getEnhanceStatefulSetByOwner(stone)
      .filter(enhanceStatefulset => enhanceStatefulset.getNs() === stone.getNs())
  }

  getChildPods(stone: Stone) {
    return podsStore
      .getByLabel(stone.getTemplateLabels())
      .filter(pod => pod.getNs() === stone.getNs())
  }

  getStatuses(stones: Stone[]) {
    const status = { failed: 0, pending: 0, running: 0 }
    stones.forEach(stone => {
      const pods = this.getChildPods(stone)
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

export const stoneStore = new StoneStore();
apiManager.registerStore(stoneApi, stoneStore);
