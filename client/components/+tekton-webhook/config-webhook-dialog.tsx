import "./config-webhook-dialog.scss";

import {observer} from "mobx-react";
import React from "react";
import {Dialog, DialogProps} from "../dialog";
import {observable} from "mobx";
import {Wizard, WizardStep} from "../wizard";
import {t, Trans} from "@lingui/macro";
import {SubTitle} from "../layout/sub-title";
import {Input} from "../input";
import {isUrl} from "../input/input.validators";
import {_i18n} from "../../i18n";
import {Notifications} from "../notifications";
import {tektonWebHookStore} from "./webhook.store";
import {Job, TektonWebHook} from "../../api/endpoints/tekton-webhook.api";
import {JobDetails} from "./job-details";

interface Props extends DialogProps {
}

@observer
export class ConfigWebhookDialog extends React.Component<Props> {

  @observable static isOpen = false;
  @observable static Data: TektonWebHook = null;
  @observable secret: string = "";
  @observable git: string = "";
  @observable jobs: Job[] = [];

  static open(webhook: TektonWebHook) {
    ConfigWebhookDialog.isOpen = true;
    ConfigWebhookDialog.Data = webhook;
  }

  get webhook() {
    return ConfigWebhookDialog.Data;
  }

  onOpen = async () => {
    this.secret = this.webhook.spec?.secret || "";
    this.git = this.webhook.spec?.git || "";
    this.jobs = this.webhook.spec?.jobs || [];
  }

  static close() {
    ConfigWebhookDialog.isOpen = false;
  }

  reset = async () => {
    this.secret = "";
    this.git = "";
    this.jobs = [];
  }

  close = async () => {
    ConfigWebhookDialog.close();
    await this.reset();
  }

  updateWebHook = async () => {
    try {
      this.webhook.spec.secret = this.secret;
      this.webhook.spec.git = this.git;
      this.webhook.spec.jobs = this.jobs;

      await tektonWebHookStore.update(this.webhook, {...this.webhook});
      Notifications.ok(
        <>WebHook {name} succeeded</>
      );
      await this.close();
    } catch (err) {
      Notifications.error(err);
    }
  }

  render() {
    const header = <h5><Trans>Config Webhook</Trans></h5>;

    return (
      <Dialog
        className="ConfigWebhookDialog"
        isOpen={ConfigWebhookDialog.isOpen}
        onOpen={this.onOpen}
        close={this.close}
        pinned
      >
        <Wizard className={"ConfigWebhookWizard"} header={header} done={this.close}>
          <WizardStep className={"ConfigWebhookWizardStep"} contentClass="flex gaps column" next={this.updateWebHook}>
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