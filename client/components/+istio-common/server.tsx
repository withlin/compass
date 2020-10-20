import { observer } from "mobx-react";
import React from "react";
import { computed, observable } from "mobx";
import { Input } from "../input";
import { ActionMeta } from "react-select/src/types";
import { SubTitle } from "../layout/sub-title";
import { Icon } from "../icon";
import { t, Trans } from "@lingui/macro";
import { _i18n } from "../../i18n";
import { Grid } from "@material-ui/core";
import { stopPropagation } from "../../utils";
import { Server, Port } from "../../api/endpoints/istio-gateway.api"
import { HostDetails } from "./hosts"


interface Props<T = any> extends Partial<Props> {
    value?: T;
    themeName?: "dark" | "light" | "outlined";

    onChange?(value: T, meta?: ActionMeta<any>): void;
}

export const defaultPort: Port = {
    number: 0,
    protocol: "",
    targetPort: 0,
    name: "",
}

export const server: Server = {
    port: defaultPort,
    name: "",
    bind: "",
    hosts: [],
    defaultEndpoint: "",
    // Tls:"" not support now

};

// export const defaultSelector: Selector = {
//     key: "",
//     value: "",
// }



@observer
export class ServerDetail extends React.Component<Props> {


    @computed get value(): Server[] {
        return this.props.value || [];
    }


    get typeOptions() {
        return ["true", "false"];
    }

    add = () => {
        this.value.push(server);
    };

    remove = (index: number) => {
        this.value.splice(index, 1);
    };

    renderServerDetail(index: number) {
        return (
            <>
                <Grid container spacing={5} direction={"row"} zeroMinWidth>
                    <Grid item xs={11} direction={"row"} zeroMinWidth>
                        <Grid container spacing={1} direction={"row"} zeroMinWidth>
                            <Grid item xs={12}>
                                <Input
                                    placeholder={"Name"}
                                    value={this.value[index].name}
                                    onChange={(value) => (this.value[index].name = value)}
                                />
                            </Grid>
                            <Grid item xs zeroMinWidth>
                                <Input
                                    placeholder={"PortName"}
                                    value={this.value[index].port.name}
                                    onChange={(value) => (this.value[index].port.name = value)}
                                />
                            </Grid>
                            <Grid item xs zeroMinWidth>
                                <Input
                                    placeholder={"PortNumber"}
                                    value={this.value[index].port.number.toString()}
                                    onChange={(value) => (this.value[index].port.number = Number(value))}
                                />
                            </Grid >
                            <Grid item xs zeroMinWidth>
                                <Input
                                    placeholder={"PortTargetPort"}
                                    value={this.value[index].port.targetPort.toString()}
                                    onChange={(value) => (this.value[index].port.targetPort = Number(value))}
                                />
                            </Grid>
                            <Grid item xs zeroMinWidth>
                                <Input
                                    placeholder={"PortProtocol"}
                                    value={this.value[index].port.protocol}
                                    onChange={(value) => (this.value[index].port.protocol = value)}
                                />
                            </Grid>

                        </Grid>

                        <Grid item xs zeroMinWidth>
                            <Input
                                placeholder={"Bind"}
                                value={this.value[index].bind}
                                onChange={(value) => (this.value[index].bind = value)}
                            />
                        </Grid>
                        <Grid item xs zeroMinWidth>
                            <Input
                                placeholder={"DefaultEndpoint"}
                                value={this.value[index].defaultEndpoint}
                                onChange={(value) => (this.value[index].defaultEndpoint = value)}
                            />
                        </Grid>
                        <Grid item xs zeroMinWidth>
                            <HostDetails value={this.value[index].hosts} />
                        </Grid>

                    </Grid>
                    <Grid item xs zeroMinWidth>
                        <Icon
                            small
                            tooltip={_i18n._(t`Remove`)}
                            className="remove-icon"
                            material="clear"
                            onClick={(event) => {
                                this.remove(index);
                                stopPropagation(event)
                            }}
                        />
                    </Grid>
                </Grid>
            </>
        )
    }


    render() {
        return (
            <>
                <SubTitle
                    title={
                        <>
                            <Trans>Server</Trans>
              &nbsp;&nbsp;
              <Icon material={"edit"} className={"editIcon"} onClick={event => {
                                stopPropagation(event);
                                this.add()
                            }} small />
                        </>
                    }>
                </SubTitle>
                {this.value.map((item: any, index: number) => {
                    return this.renderServerDetail(index);
                })}
            </>
        );
    }

}
