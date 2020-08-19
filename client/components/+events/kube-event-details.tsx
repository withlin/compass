import "./kube-event-details.scss";

import React from "react";
import { observer } from "mobx-react";
import { Trans } from "@lingui/macro";
import { KubeObject } from "../../api/kube-object";
import { DrawerItem, DrawerTitle } from "../drawer";
import { cssNames } from "../../utils";
import { Icon } from "../icon";
import { eventStore } from "./event.store";

interface Props {
  object: KubeObject;
  title?: React.ReactNode;
}

@observer
export class KubeEventDetails extends React.Component<Props> {

  static defaultProps = {
    title: <Trans>Events</Trans>
  }

  async componentDidMount() {
    eventStore.loadAll();
  }

  render() {
    const { object, title } = this.props;
    const events = eventStore.getEventsByObject(object);
    if (!events.length) {
      return (
        null
      )
    }
    return (
      <>
        <DrawerTitle className="flex gaps align-center">
          <span>{title}</span>
        </DrawerTitle>
        <div className="KubeEventDetails">
          {events.map(evt => {
            const { message, count, lastTimestamp, involvedObject } = evt
            return (
              <div className="event" key={evt.getId()}>
                <div className={cssNames("title", { warning: evt.isWarning() })}>
                  {message}
                </div>
                <DrawerItem name={<Trans>Source</Trans>}>
                  {evt.getSource()}
                </DrawerItem>
                <DrawerItem name={<Trans>Count</Trans>}>
                  {count}
                </DrawerItem>
                <DrawerItem name={<Trans>Sub-object</Trans>}>
                  {involvedObject.fieldPath}
                </DrawerItem>
                <DrawerItem name={<Trans>Last seen</Trans>}>
                  {lastTimestamp}
                </DrawerItem>
              </div>
            )
          })}
        </div>
      </>
    )
  }
}
