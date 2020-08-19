import { autobind } from "../../utils";
import { KubeObjectStore } from "../../kube-object.store";
import { taskRunApi, TaskRun } from "../../api/endpoints";
import { apiManager } from "../../api/api-manager";

@autobind()
export class TaskRunStore extends KubeObjectStore<TaskRun> {
  api = taskRunApi;

  // getTaskRunsByName(names: string[]):TaskRun[] {
  //   return names.map(name => {
  //     taskRunStore.items.filter(item => {
  //       if (item.getName() === name) {
  //         return item;
  //       }
  //     })
  //   }).slice();
  // }
}

export const taskRunStore = new TaskRunStore();
apiManager.registerStore(taskRunApi, taskRunStore);
