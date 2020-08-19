import "./add-webhook-dialog.scss";

import {observer} from "mobx-react";
import React from "react";
import {Dialog, DialogProps} from "../dialog";
import {observable} from "mobx";
import {Wizard, WizardStep} from "../wizard";
import {t, Trans} from "@lingui/macro";
import {SubTitle} from "../layout/sub-title";
import {Input} from "../input";
import {isUrl, systemName} from "../input/input.validators";
import {_i18n} from "../../i18n";
import {configStore} from "../../config.store";
import {Notifications} from "../notifications";
import {tektonWebHookStore} from "./webhook.store";
import {Job} from "../../api/endpoints/tekton-webhook.api";
import {JobDetails} from "./job-details";

interface Props extends DialogProps {
}

@observer
export class AddWebhookDialog extends React.Component<Props> {

  @observable static isOpen = false;
  @observable name: string = "";
  @observable secret: string = "";
  @observable git: string = "";
  @observable jobs: Job[] = [];

  static open() {
    AddWebhookDialog.isOpen = true;
  }

  static close() {
    AddWebhookDialog.isOpen = false;
  }

  close = async () => {
    AddWebhookDialog.close();
    await this.reset();
  }

  reset = async () => {
    this.name = "";
    this.secret = "";
    this.git = "";
    this.jobs = [];
  }

  addWebHook = async () => {
    try {
      await tektonWebHookStore.create(
        {
          name: this.name,
          namespace: configStore.getOpsNamespace(),
        },
        {
          spec: {
            secret: this.secret,
            git: this.git,
            jobs: this.jobs,
          },
        });
      Notifications.ok(
        <>WebHook {name} succeeded</>
      );
      await this.close();
    } catch (err) {
      Notifications.error(err);
    }
  }

  render() {
    const header = <h5><Trans>Add Webhook</Trans></h5>;

    return (
      <Dialog
        className="AddWebhookDialog"
        isOpen={AddWebhookDialog.isOpen}
        close={this.close}
        pinned
      >
        <Wizard header={header} done={this.close}>
          <WizardStep contentClass="flex gaps column" next={this.addWebHook}>
            <SubTitle title={<Trans>Name</Trans>}/>
            <Input
              validators={systemName}
              placeholder={_i18n._(t`Name`)}
              value={this.name}
              onChange={value => this.name = value}
            />
            <SubTitle title={<Trans>Secret</Trans>}/>
            <Input
              type={"password"}
              placeholder={_i18n._(t`Secret`)}
              value={this.secret}
              onChange={value => this.secret = value}
            />
            <SubTitle title={<Trans>Git Address</Trans>}/>
            <Input
              validators={isUrl}
              placeholder={_i18n._(t`Git`)}
              value={this.git}
              onChange={value => this.git = value}
            />
            <JobDetails value={this.jobs} onChange={value => this.jobs = value}/>
          </WizardStep>
        </Wizard>
      </Dialog>
    )
  }
}