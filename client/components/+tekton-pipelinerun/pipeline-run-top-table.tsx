
import React from "react";
import { observer } from "mobx-react";
import { MainLayout } from "../layout/main-layout";
import { pipelineRunStore } from "./pipelinerun.store";
import { KubeObjectListLayout, KubeObjectListLayoutProps } from "../kube-object";
import { Trans } from "@lingui/macro";
import { PipelineRun } from "../../api/endpoints";
import Tooltip from "@material-ui/core/Tooltip";
import { Link } from "react-router-dom";
import { cssNames, IClassName, stopPropagation } from "../../utils";
import { Icon } from "../icon";
import { PipelineRunVisualDialog } from "./pipelinerun-visual-dialog";


interface Props extends Partial<KubeObjectListLayoutProps> {
    className?: IClassName;
    compact?: boolean;
    compactLimit?: number;
}

const defaultProps: Partial<Props> = {
    compactLimit: 10,
};

@observer
export class PipelineRunTopTable extends React.Component<Props> {
    static defaultProps = defaultProps as object;

    render() {
        const { compact, compactLimit, className, ...layoutProps } = this.props;
        const pipelineRuns = (
            <KubeObjectListLayout
                {...layoutProps}
                className={cssNames("pipelineRuns", className, { compact })}
                store={pipelineRunStore}
                isSelectable={false}
                renderHeaderTitle={<Trans>Top Duration</Trans>}
                customizeHeader={({ title, info }) => (
                    compact ? title : ({
                        info: (
                            <>
                                {info}
                                <Icon
                                    small
                                    material="help_outline"
                                    className="help-icon"
                                    tooltip={<Trans>Limited to {pipelineRunStore.limit}</Trans>}
                                />
                            </>
                        )
                    })
                )}
                renderTableHeader={[
                    { title: <Trans>Namespace</Trans>, className: "namespace" },
                    { title: <Trans>Name</Trans>, className: "name" },
                    {
                        title: <Trans>OwnerNamespace</Trans>,
                        className: "ownernamespace",
                    },
                    {
                        title: <Trans>Created</Trans>,
                        className: "age",
                    },
                    { title: <Trans>Duration</Trans>, className: "Duration" },
                ]}
                renderTableContents={(pipelineRun: PipelineRun) => {
                    return [
                        pipelineRun.getNs(),
                        pipelineRun.getName(),
                        pipelineRun.getOwnerNamespace(),
                        `${pipelineRun.getAge()}  ago`,
                        pipelineRun.getDuration() ?? "", ,
                    ]
                }}
                virtual={!compact}
                filterItems={[
                    items => compact ? items.slice(0, compactLimit) : items,
                ]}
            />
        )
        if (compact) {
            return pipelineRuns;
        }
        return (
            <MainLayout>
                {pipelineRuns}
            </MainLayout>
        )
    }
}
