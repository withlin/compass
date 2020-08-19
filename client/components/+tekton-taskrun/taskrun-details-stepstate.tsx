import React from "react";
import {StepState} from "../../api/endpoints";
import {Trans} from "@lingui/macro";
import {DrawerItem} from "../drawer";

interface Props {
  stepState: StepState
}

export class TaskRunDetailsStepState extends React.Component<Props> {

  render() {

    const {stepState} = this.props

    return (
      <div>
        {stepState.waiting ?
          <>
            <DrawerItem name={<Trans>Message</Trans>}>
              <span className="text-secondary">{stepState.waiting.message}</span>
            </DrawerItem>
            <DrawerItem name={<Trans>Reason</Trans>}>
              <span className="text-secondary">{stepState.waiting.reason}</span>
            </DrawerItem>
          </> : null}
        {stepState.running ?
          <>
            <DrawerItem name={<Trans>StartedAt</Trans>}>
              <span className="text-secondary">{stepState.running.startedAt}</span>
            </DrawerItem>
          </> : null}
        {stepState.terminated ?
          <>
            <DrawerItem name={<Trans>ContainerID</Trans>}>
              <span className="text-secondary">{stepState.terminated.containerID}</span>
            </DrawerItem>
            <DrawerItem name={<Trans>Reason</Trans>}>
              <span className="text-secondary">{stepState.terminated.reason}</span>
            </DrawerItem>
            <DrawerItem name={<Trans>Message</Trans>}>
              <span className="text-secondary">{stepState.terminated.message}</span>
            </DrawerItem>
            <DrawerItem name={<Trans>StartedAt</Trans>}>
              <span className="text-secondary">{stepState.terminated.startedAt}</span>
            </DrawerItem>
            <DrawerItem name={<Trans>FinishedAt</Trans>}>
              <span className="text-secondary">{stepState.terminated.finishedAt}</span>
            </DrawerItem>
          </> : null}
      </div>
    )
  }
}
