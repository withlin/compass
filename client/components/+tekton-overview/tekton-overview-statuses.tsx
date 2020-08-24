import "./tekton-overview-status.scss"

import React from "react";
import { observer } from "mobx-react";
import { Trans } from "@lingui/macro";
import { OverviewWorkloadStatus } from "./overview-tekton-status";
import { Link } from "react-router-dom";
import { pipelineRunURL, taskRunURL, taskURL, pipelineURL, pipelineResourceURL } from "../+tekton"
import { namespaceStore } from "../+namespaces/namespace.store";
import { PageFiltersList } from "../item-object-list/page-filters-list";
import { NamespaceSelectFilter } from "../+namespaces/namespace-select";
import { pipelineRunStore } from "../+tekton-pipelinerun/pipelinerun.store";
import { taskRunStore } from "../+tekton-taskrun";
import { taskStore } from "../+tekton-task/task.store";
import { pipelineStore } from "../+tekton-pipeline/pipeline.store";
import { pipelineResourceStore } from "../+tekton-pipelineresource/pipelineresource.store";



@observer
export class OverviewStatuses extends React.Component {
    render() {
        const { contextNs } = namespaceStore;
        const pipelineRuns = pipelineRunStore.getAllByNs(contextNs);
        const taskRuns = taskRunStore.getAllByNs(contextNs);
        const tasks = taskStore.getAllByNs(contextNs);
        const pipelines = pipelineStore.getAllByNs(contextNs);
        const pipelineresources = pipelineResourceStore.getAllByNs(contextNs);

        return (
            <div className="OvervieStatus">
                <div className="header flex gaps align-center">
                    <h5 className="box grow"><Trans>Overview</Trans></h5>
                    <NamespaceSelectFilter />
                </div>
                <PageFiltersList />
                <div className="workloads">
                    <div className="workload">
                        <div className="title"><Link to={taskRunURL()}><Trans>TaskRuns</Trans> ({taskRuns.length})</Link></div>
                        <OverviewWorkloadStatus status={taskRunStore.getStatuses(taskRuns)} />
                    </div>
                    <div className="workload">
                        <div className="title"><Link to={pipelineRunURL()}><Trans>PipelineRuns</Trans> ({pipelineRuns.length})</Link></div>
                        <OverviewWorkloadStatus status={pipelineRunStore.getStatuses(pipelineRuns)} />
                    </div>
                    <div className="workload">
                        <div className="title"><Link to={taskURL()}><Trans>Tasks</Trans> ({tasks.length})</Link></div>
                        <OverviewWorkloadStatus status={taskStore.getStatuses(tasks)} />
                    </div>
                    <div className="workload">
                        <div className="title"><Link to={pipelineURL()}><Trans>Pipelines</Trans> ({pipelines.length})</Link></div>
                        <OverviewWorkloadStatus status={pipelineStore.getStatuses(pipelines)} />
                    </div>
                    <div className="workload">
                        <div className="title"><Link to={pipelineResourceURL()}><Trans>pipelineResources</Trans> ({pipelineresources.length})</Link></div>
                        <OverviewWorkloadStatus status={pipelineResourceStore.getStatuses(pipelineresources)} />
                    </div>
                </div >
            </div >
        )
    }
}
