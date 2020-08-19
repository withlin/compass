import "./config-user-dialog.scss"

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
import {Notifications} from "../notifications";
import {BaseDepartmentSelect} from "../+tenant-department/department-select";
import {BaseRoleSelect} from "../+tenant-role/role-select";
import {SelectOption} from "../select";

interface Props extends Partial<DialogProps> {
}

@observer
export class ConfigUserDialog extends React.Component<Props> {

  @observable static isOpen = false;
  @observable static data: TenantUser = null;
  @observable name = "";
  @observable namespace = "kube-system";
  @observable display = "";
  @observable email = "";
  @observable department_id = "";
  @observable password = "";
  @observable roles = observable.array<string>([], {deep: false});

  static open(user: TenantUser) {
    ConfigUserDialog.isOpen = true;
    ConfigUserDialog.data = user;
  }

  static close() {
    ConfigUserDialog.isOpen = false;
  }

  close = () => {
    ConfigUserDialog.close();
  }

  @computed get selectedRoles() {
    return [
      ...this.roles,
    ]
  }

  get user() {
    return ConfigUserDialog.data;
  }

  onOpen = () => {
    this.name = this.user.getName();
    this.department_id = this.user.spec.department_id;
    this.display = this.user.spec.display;
    this.email = this.user.spec.email;
    this.password = this.user.spec.password;
    this.roles.replace(this.user.spec.roles)
  }

  reset = () => {
    this.name = "";
    this.email = "";
    this.display = "";
    this.department_id = "";
    this.roles.replace([]);
  }

  updateUser = async () => {
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
    const {display, password, email, department_id} = this;
    const unwrapRoles = (options: SelectOption[]) => options.map(option => option.value);
    const header = <h5><Trans>Update User</Trans></h5>;
    return (
      <Dialog
        {...dialogProps}
        className="ConfigUserDialog"
        isOpen={ConfigUserDialog.isOpen}
        onOpen={this.onOpen}
        close={this.close}
      >
        <Wizard header={header} done={this.close}>
          <WizardStep contentClass="flow column" nextLabel={<Trans>Apply</Trans>} next={this.updateUser}>
            <div className="tenant-department">
              <SubTitle title={<Trans>Tenant Department</Trans>}/>
              <BaseDepartmentSelect
                placeholder={_i18n._(t`Tenant Department`)}
                themeName="light"
                className="box grow"
                value={department_id} onChange={({value}) => this.department_id = value}
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