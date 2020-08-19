import "./add-tekton-store-dailog.scss";

import { observer } from "mobx-react";
import React from "react";
import { Dialog, DialogProps } from "../dialog";
import { observable } from "mobx";
import { Wizard, WizardStep } from "../wizard";
import { t, Trans } from "@lingui/macro";
import { SubTitle } from "../layout/sub-title";
import { Input } from "../input";
import { _i18n } from "../../i18n";
import { Notifications } from "../notifications";
import { tektonStore } from "./taskstore.store";
import { tektonStoreNamespace } from "../+constant";
import store from "store";

interface Props extends DialogProps {}

export interface PipelineEntity {
  pipelineData: string;
  taskData: string;
  graphData: string;
}

export enum ResourceType {
  Task = "task",
  Pipeline = "pipeline",
}

@observer
export class AddTektonStoreDialog extends React.Component<Props> {
  @observable static isOpen = false;
  @observable static tektonResourceType: string = "";
  @observable static data: string = "";
  @observable static author: string = "";
  @observable name: string = "";
  @observable forks: number = 0;
  @observable paramsDescription = "";

  static open(data: string, resourceType: string) {
    AddTektonStoreDialog.isOpen = true;
    this.data = data;
    this.tektonResourceType = resourceType;
    const userConfig = store.get("u_config");
    this.author = userConfig ? userConfig.userName : "";
  }

  static close() {
    AddTektonStoreDialog.isOpen = false;
    this.data = "";
    this.tektonResourceType = "";
  }

  close = () => {
    AddTektonStoreDialog.tektonResourceType = "";
    AddTektonStoreDialog.data = "";
    AddTektonStoreDialog.author = "";
    AddTektonStoreDialog.close();
  };

  reset() {
    this.name = "";
    this.forks = 0;
    this.paramsDescription = "";
  }

  addTektonStore = () => {
    try {
      const resourceType: string = AddTektonStoreDialog.tektonResourceType;
      const data: string = AddTektonStoreDialog.data;
      const author: string = AddTektonStoreDialog.author;
      tektonStore.create(
        {
          name: this.name,
          namespace: tektonStoreNamespace,
        },
        {
          spec: {
            tektonResourceType: resourceType,
            data: data,
            author: author,
            forks: this.forks,
            paramsDescription: this.paramsDescription,
          },
        }
      );
      Notifications.ok(<>Add TektonStore {name} succeeded</>);
      this.reset();
      this.close();
    } catch (err) {
      Notifications.error(err);
    }
  };

  render() {
    const header = (
      <h5>
        <Trans>Add Store</Trans>
      </h5>
    );

    return (
      <Dialog
        className="AddTektonStoreDialog"
        isOpen={AddTektonStoreDialog.isOpen}
        close={this.close}
        pinned
      >
        <Wizard
          className={"AddTektonStoreWizard"}
          header={header}
          done={this.close}
        >
          <WizardStep
            className={"AddTektonStoreWizardStep"}
            contentClass="flex gaps column"
            next={this.addTektonStore}
          >
            <SubTitle title={<Trans>Name</Trans>} />
            <Input
              placeholder={_i18n._(t`Name`)}
              value={this.name}
              onChange={(value) => (this.name = value)}
            />
            <SubTitle title={<Trans>Author</Trans>} />
            <Input
              placeholder={_i18n._(t`Author`)}
              disabled={true}
              value={AddTektonStoreDialog.author}
            />
            <SubTitle title={<Trans>Forks</Trans>} />
            <Input
              disabled={true}
              placeholder={_i18n._(t`Forks`)}
              value={String(this.forks)}
              onChange={(value) => (this.forks = Number(value))}
            />
            <SubTitle title={<Trans>ParamsDescription</Trans>} />
            <Input
              multiLine={true}
              maxRows={10}
              placeholder={_i18n._(t`ParamsDescription`)}
              value={this.paramsDescription}
              onChange={(value) => (this.paramsDescription = value)}
            />
            {/* <SubTitle title={<Trans>Subreference</Trans>} />
            <Input
              placeholder={_i18n._(t`Subreference`)}
              value={this.subReference}
              onChange={(value) => (this.subReference = value)}
            /> */}
          </WizardStep>
        </Wizard>
      </Dialog>
    );
  }
}
