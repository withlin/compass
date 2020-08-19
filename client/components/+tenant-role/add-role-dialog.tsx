import "./add-role-dialog.scss"

import React from "react";
import {observer} from "mobx-react";
import {Dialog, DialogProps} from "../dialog";
import {observable} from "mobx";
import {TenantRole} from "../../api/endpoints";
import {Wizard, WizardStep} from "../wizard";
import {t, Trans} from "@lingui/macro";
import {SubTitle} from "../layout/sub-title";
import {Input} from "../input";
import {_i18n} from "../../i18n";
import {systemName} from "../input/input.validators";
import {Notifications} from "../notifications";
import {tenantRoleStore} from "./role.store";

interface Props extends Partial<DialogProps> {
}

@observer
export class AddRoleDialog extends React.Component<Props> {

  @observable static isOpen = false;

  static open() {
    AddRoleDialog.isOpen = true;
  }

  static close() {
    AddRoleDialog.isOpen = false;
  }

  @observable name = "";
  @observable namespace = "kube-system";
  @observable comment = "";

  close = () => {
    AddRoleDialog.close();
  }

  reset = () => {
    this.name = "";
    this.comment = "";
  }

  createRole = async () => {
    const {name, namespace, comment} = this;
    const role: Partial<TenantRole> = {
      spec: {
        value: 0,
        comment: comment,
      }
    }
    try {
      const newRole = await tenantRoleStore.create({namespace, name}, role);
      // showDetails(newRole.selfLink);
      this.reset();
      Notifications.ok(
        <>Role {name} save succeeded</>
      );
      this.close();
    } catch (err) {
      Notifications.error(err);
    }
  }

  render() {
    const {...dialogProps} = this.props;
    const {name, comment} = this;
    const header = <h5><Trans>Create Role</Trans></h5>;
    return (
      <Dialog
        {...dialogProps}
        className="AddRoleDialog"
        isOpen={AddRoleDialog.isOpen}
        close={this.close}
      >
        <Wizard header={header} done={this.close}>
          <WizardStep contentClass="flow column" nextLabel={<Trans>Create</Trans>} next={this.createRole}>
            <div className="name">
              <SubTitle title={<Trans>Name</Trans>}/>
              <Input
                autoFocus required
                placeholder={_i18n._(t`Name`)}
                validators={systemName}
                value={name} onChange={v => this.name = v}
              />
            </div>
            <div className="comment">
              <SubTitle title={<Trans>Comment</Trans>}/>
              <Input
                placeholder={_i18n._(t`Comment`)}
                value={comment} onChange={v => this.comment = v}
              />
            </div>
          </WizardStep>
        </Wizard>
      </Dialog>
    )
  }
}