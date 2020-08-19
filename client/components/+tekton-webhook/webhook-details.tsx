import {KubeObjectDetailsProps} from "../kube-object";
import {observer} from "mobx-react";
import React from "react";
import {KubeObjectMeta} from "../kube-object/kube-object-meta";
import {DrawerItem, DrawerTitle} from "../drawer";
import {Trans} from "@lingui/macro";
import {KubeEventDetails} from "../+events/kube-event-details";
import {apiManager} from "../../api/api-manager";
import {TektonWebHook, tektonWebHookApi} from "../../api/endpoints/tekton-webhook.api";
import {_i18n} from "../../i18n";
import {Table, TableCell, TableHead, TableRow} from "../table";

interface Props extends KubeObjectDetailsProps<TektonWebHook> {
}

@observer
export class WebHookDetails extends React.Component<Props> {

  render() {
    const {object: tektonWebHook} = this.props;
    if (!tektonWebHook) {
      return null;
    }

    return (
      <div className="WebHookDetails">
        <KubeObjectMeta object={tektonWebHook}/>
        <DrawerItem name={<Trans>Git Address</Trans>}>
          {tektonWebHook.spec.git}
        </DrawerItem>
        <DrawerItem name={<Trans>Uniform Resource Identifier</Trans>}>
          {"/webhook/gitea/namespaces/" + tektonWebHook.getNs() + "/tektonwebhooks/" + tektonWebHook.getName()}
        </DrawerItem>
        <DrawerTitle title={_i18n._(`Job`)}/>
        <Table
          className="box grow"
        >
          <TableHead>
            <TableCell className="branch"><Trans>Branch</Trans></TableCell>
            <TableCell className="pipelineRun">PipelineRun</TableCell>
            <TableCell className="args"><Trans>Params (Key / Value)</Trans></TableCell>
          </TableHead>
          {
            tektonWebHook.spec.jobs?.map(item => {
              return (
                <TableRow
                  nowrap
                >
                  <TableCell className="branch">{item.branch}</TableCell>
                  <TableCell className="pipelineRun">{item.pipeline_run}</TableCell>
                  <TableCell className="targetPath">{item.params?.map(item => <><span>{item.name} / {item.value}</span><br/></>)}</TableCell>
                </TableRow>
              )
            })
          }
        </Table>
        <KubeEventDetails object={tektonWebHook}/>
      </div>
    )
  }
}

apiManager.registerViews(tektonWebHookApi, {Details: WebHookDetails});