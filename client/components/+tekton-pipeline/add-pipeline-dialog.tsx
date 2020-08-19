import "./add-pipeline-dialog.scss"

import { observer } from "mobx-react";
import React from "react";
import { observable } from "mobx";
import { SubTitle } from "../layout/sub-title";
import { Input } from "../input";
import { _i18n } from "../../i18n";
import { Trans } from "@lingui/macro";
import { Dialog } from "../dialog";
import { Wizard, WizardStep } from "../wizard";
import { Notifications } from "../notifications";
import { configStore } from "../../config.store";
import { pipelineApi } from "../../api/endpoints";

interface Props<T = any> extends Partial<Props> { }

@observer
export class AddPipelineDialog extends React.Component<Props> {
  // @observable prefix: string = configStore.getDefaultNamespace();
  @observable static isOpen = false;
  @observable value: string = "";

  static open() {
    AddPipelineDialog.isOpen = true;
  }

  static close() {
    AddPipelineDialog.isOpen = false;
  }

  close = async () => {
    AddPipelineDialog.close();
    this.value = "";
  };

  submit = async () => {
    try {
      await pipelineApi.create(
        {
          name: this.value,
          namespace: configStore.getOpsNamespace(),
          labels: new Map<string, string>().set("namespace", configStore.getDefaultNamespace()),
        },
        {
          spec: {
            resources: [{ name: "you-git-addr", type: "git" }],
            tasks: [],
            params: [],
          },
        }
      );
      await this.close();
    } catch (err) {
      Notifications.error(err);
    }
  };

  render() {
    const header = (
      <h5>
        <Trans>Create Pipeline</Trans>
      </h5>
    );

    return (
      <Dialog
        className="AddPipelineDialog"
        isOpen={AddPipelineDialog.isOpen}
        close={this.close}>
        <Wizard  header={header} done={this.close}>
          <WizardStep contentClass="flex gaps column" next={this.submit}>
            <SubTitle title={"Pipeline Name"} />
            <Input
              required={true}
              placeholder={_i18n._("Pipeline Name")}
              value={this.value}
              onChange={(value) => (this.value = value)}
            />
          </WizardStep>
        </Wizard>
      </Dialog>
    );
  }
}
