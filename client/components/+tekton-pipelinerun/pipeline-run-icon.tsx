import "./pipeline-run-icon.scss";

import React from "react";
import { Icon } from "../icon";
import { TooltipContent } from "../tooltip";
import { cssNames } from "../../utils";

interface Props {
    object: any;
    showWarningsOnly?: boolean;
}

const defaultProps: Partial<Props> = {
    showWarningsOnly: true,
};

export class PipelineRunIcon extends React.Component<Props> {
    static defaultProps = defaultProps as object;

    render() {
        const { object } = this.props;
        return (
            <Icon
                material="warning"
                className={cssNames("PipelineIcon", { warning: "true" })}
                tooltip={(
                    <TooltipContent className="PiplineRunTooltip">
                        {`reason:  ${object.reason}`}
                        <br />
                        {`message:  ${object.message}`}
                        <br />
                        <div className="age">
                            <Icon material="access_time" />
                            {`lastTransitionTime:  ${object.lastTransitionTime}`}
                        </div>
                    </TooltipContent>
                )}
            />
        )
    }
}
