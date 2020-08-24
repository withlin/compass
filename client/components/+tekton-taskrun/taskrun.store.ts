import { autobind } from "../../utils";
import { KubeObjectStore } from "../../kube-object.store";
import { taskRunApi, TaskRun, TaskRunStatusReason } from "../../api/endpoints";
import { apiManager } from "../../api/api-manager";

@autobind()
export class TaskRunStore extends KubeObjectStore<TaskRun> {
  api = taskRunApi;

  getStatuses(taskruns: TaskRun[]) {
    const status = {
      failed: 0,
      pending: 0,
      running: 0,
      succeeded: 0,
      cancel: 0,
    };
    taskruns.forEach((taskRun) => {
      const currentStatus = taskRun.getStatus();
      if (currentStatus === TaskRunStatusReason.Failed) {
        status.failed++;
      }
      if (currentStatus === TaskRunStatusReason.Pending) {
        status.pending++;
      }
      if (currentStatus === TaskRunStatusReason.Running) {
        status.running++;
      }
      if (currentStatus === TaskRunStatusReason.Succeeded) {
        status.succeeded++;
      }
      if (currentStatus === TaskRunStatusReason.Timeout) {
        status.cancel++;
      }
    });
    return status;
  }
}

export const taskRunStore = new TaskRunStore();
apiManager.registerStore(taskRunApi, taskRunStore);
