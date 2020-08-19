import React from "react";
import {Link} from "react-router-dom";
import {autorun, observable} from "mobx";
import {disposeOnUnmount, observer} from "mobx-react";
import {Pipeline, Task, taskApi} from "../../api/endpoints";
import {getDetailsUrl} from "../../navigation";

interface Props {
  pipeline: Pipeline;
}

@observer
export class PipelineDetailsTask extends React.Component<Props> {
  @observable tasks: Task[] = [];

  @disposeOnUnmount
  taskLoader = autorun(async () => {
    const {pipeline} = this.props;
    this.tasks = await Promise.all(
      pipeline.getTaskSet().map(taskName => taskApi.get({
        name: taskName,
        namespace: pipeline.getNs(),
      }))
    );
  });

  render() {
    return (
      <div className="PipelineDetailsTask">
        {
          this.tasks.map(task => {
            return (
              <p>
                <Link key={task.getId()} to={getDetailsUrl(task.selfLink)}>
                  {task.getName()}
                </Link>
              </p>
            );
          })
        }
      </div>
    );
  }
}