import "./add-user-dialog.scss"

import React from "react";
import {observer} from "mobx-react";
import {Dialog, DialogProps} from "../dialog";
import {computed, observable} from "mobx";
import {TenantUser, tenantUserApi} from "../../api/endpoints";
import {Wizard, WizardStep} from "../wizard";
import {t, Trans} from "@lingui/macro";
import {SubTitle} from "../layout/sub-title";
import {Input} from "../input";
import {_i18n} from "../../i18n";
import {systemName} from "../input/input.validators";
import {Notifications} from "../notifications";
import {BaseDepartmentSelect} from "../+tenant-department/department-select";
import {BaseRoleSelect} from "../+tenant-role/role-select";
import {SelectOption} from "../select";

interface Props extends Partial<DialogProps> {
}

@observer
export class AddUserDialog extends React.Component<Props> {

  @observable static isOpen = false;
  @observable name = "";
  @observable namespace = "kube-system";
  @observable display = "";
  @observable email = "";
  @observable department_id = "";
  @observable password = "";
  @observable roles = observable.array<string>([], {deep: false});

  static open() {
    AddUserDialog.isOpen = true;
  }

  static close() {
    AddUserDialog.isOpen = false;
  }

  close = () => {
    AddUserDialog.close();
  }

  reset = () => {
    this.name = "";
    this.email = "";
    this.display = "";
    this.department_id = "";
    this.password = "";
    this.roles.replace([]);
  }

  @computed get selectedRoles() {
    return [
      ...this.roles,
    ]
  }

  createUser = async () => {
    const {name, namespace, password, department_id, display, email} = this;
    const user: Partial<TenantUser> = {
      spec: {
        name: name,
        display: display,
        email: email,
        password: password,
        department_id: department_id,
        roles: this.selectedRoles,
      }
    }
    try {
      const newUser = await tenantUserApi.create({namespace, name}, user);
      // showDetails(newUser.selfLink);
      this.reset();
      Notifications.ok(
        <>User {name} save succeeded</>
      );
      this.close();
    } catch (err) {
      Notifications.error(err);
    }
  }

  render() {
    const {...dialogProps} = this.props;
    const {name, password, display, email} = this;
    const unwrapRoles = (options: SelectOption[]) => options.map(option => option.value);
    const header = <h5><Trans>Create User</Trans></h5>;
    return (
      <Dialog
        {...dialogProps}
        className="AddUserDialog"
        isOpen={AddUserDialog.isOpen}
        close={this.close}
      >
        <Wizard header={header} done={this.close}>
          <WizardStep contentClass="flow column" nextLabel={<Trans>Create</Trans>} next={this.createUser}>
            <div className="tenant-department">
              <SubTitle title={<Trans>Tenant Department</Trans>}/>
              <BaseDepartmentSelect
                placeholder={_i18n._(t`Tenant Department`)}
                themeName="light"
                className="box grow"
                value={this.department_id} onChange={({value}) => this.department_id = value}
              />
            </div>
            <div className="tenant-roles">
              <SubTitle title={<Trans>Tenant Role</Trans>}/>
              <BaseRoleSelect
                isMulti
                value={this.roles}
                placeholder={_i18n._(t`Tenant Roles`)}
                themeName="light"
                className="box grow"
                onChange={(opts: SelectOption[]) => {
                  if (!opts) opts = [];
                  this.roles.replace(unwrapRoles(opts));
                }}
              />
            </div>
            <div className="user-name">
              <SubTitle title={<Trans>User name</Trans>}/>
              <Input
                autoFocus required
                placeholder={_i18n._(t`Name`)}
                validators={systemName}
                value={name} onChange={v => this.name = v}
              />
            </div>
            <div className="display">
              <SubTitle title={<Trans>Display</Trans>}/>
              <Input
                placeholder={_i18n._(t`Display`)}
                value={display} onChange={v => this.display = v}
              />
            </div>
            <div className="email">
              <SubTitle title={<Trans>Email</Trans>}/>
              <Input
                placeholder={_i18n._(t`Email`)}
                value={email} onChange={v => this.email = v}
              />
            </div>
            <div className="password">
              <SubTitle title={<Trans>Password</Trans>}/>
              <Input
                type="password"
                placeholder={_i18n._(t`Password`)}
                value={password} onChange={v => this.password = v}
              />
            </div>
          </WizardStep>
        </Wizard>
      </Dialog>
    )
  }
}