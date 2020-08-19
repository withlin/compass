import {Pod} from "../../api/endpoints";
import React, {Fragment} from "react";
import {TooltipContent} from "../tooltip";
import toPairs from "lodash/toPairs";
import startCase from "lodash/startCase";
import {StatusBrick} from "../status-brick";
import {cssNames} from "../../utils";

export interface PodContainerStatusesProps {
  pod: Pod
}

export class PodContainerStatuses extends React.Component<PodContainerStatusesProps> {

  render() {
    return (
      this.props.pod.getContainerStatuses().map(containerStatus => {
        const {name, state, ready} = containerStatus;
        const tooltip = (
          <TooltipContent tableView>
            {Object.keys(state).map(status => (
              <Fragment key={status}>
                <div className="title">
                  {name} <span className="text-secondary">({status}{ready ? ", ready" : ""})</span>
                </div>
                {toPairs(state[status]).map(([name, value]) => (
                  <div key={name} className="flex gaps align-center">
                    <div className="name">{startCase(name)}</div>
                    <div className="value ">{value}</div>
                  </div>
                ))}
              </Fragment>
            ))}
          </TooltipContent>
        );
        return (
          <Fragment key={name}>
            <StatusBrick className={cssNames(state, {ready})} tooltip={tooltip}/>
          </Fragment>
        )
      })
    )
  }
}