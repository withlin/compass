import "./kube-event-icon.scss";

import React from "react";
import { Icon } from "../icon";
import { TooltipContent } from "../tooltip";
import { KubeObject } from "../../api/kube-object";
import { eventStore } from "./event.store";
import { cssNames } from "../../utils";
import { KubeEvent } from "../../api/endpoints/events.api";

interface Props {
  object: KubeObject;
  showWarningsOnly?: boolean;

  namespace?: string;
  filterEvents?: (events: KubeEvent[]) => KubeEvent[];
}

const defaultProps: Partial<Props> = {
  showWarningsOnly: true,
};

export class KubeEventIcon extends React.Component<Props> {
  static defaultProps = defaultProps as object;

  render() {
    const { object, showWarningsOnly, namespace, filterEvents } = this.props;
    let events: KubeEvent[];
    namespace == ""
      ? events = eventStore.getEventsByObject(object)
      : events = eventStore.getEventsByNamespaceObject(namespace, object)
      
    let warnings = events.filter(evt => evt.isWarning());
    if (filterEvents) warnings = filterEvents(warnings);
    if (!events.length || (showWarningsOnly && !warnings.length)) {
      return null;
    }
    const event = [...warnings, ...events][0]; // get latest event
    return (
      <Icon
        material="warning"
        className={cssNames("KubeEventIcon", { warning: event.isWarning() })}
        tooltip={(
          <TooltipContent className="KubeEventTooltip">
            {event.message}
            <div className="age">
              <Icon material="access_time" />
              {event.getAge(undefined, undefined, true)}
            </div>
          </TooltipContent>
        )}
      />
    )
  }
}
