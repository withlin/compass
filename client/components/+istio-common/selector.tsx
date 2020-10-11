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


interface Props<T = any> extends Partial<Props> {
    value?: T;
    themeName?: "dark" | "light" | "outlined";

    onChange?(value: T, meta?: ActionMeta<any>): void;
}


export interface Selector {
    key: string,
    value: string
}

export const defaultSelector: Selector = {
    key: "",
    value: "",
}


@observer
export class SelectorDetails extends React.Component<Props> {


    @computed get value(): Selector[] {
        return this.props.value || [];
    }

    add = () => {
        this.value.push(defaultSelector);
    };

    remove = (index: number) => {
        this.value.splice(index, 1);
    };

    renderHostDetail(index: number) {
        return (
            <>
                <Grid container spacing={5} direction={"row"} zeroMinWidth>
                    <Grid item xs={11} direction={"row"} zeroMinWidth>
                        <Grid container spacing={1} direction={"row"} zeroMinWidth>
                            <Grid item xs={12}>
                                <Input
                                    placeholder={"key"}
                                    value={this.value[index].key}
                                    onChange={(value) => (this.value[index].key = value)}
                                />
                                <Input
                                    placeholder={"value"}
                                    value={this.value[index].value}
                                    onChange={(value) => (this.value[index].value = value)}
                                />
                            </Grid>

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
                            <Trans>Selectors</Trans>
              &nbsp;&nbsp;
              <Icon material={"edit"} className={"editIcon"} onClick={event => {
                                stopPropagation(event);
                                console.log("进来了")
                                this.add()
                            }} small />
                        </>
                    }>
                </SubTitle>
                {this.value.map((item: any, index: number) => {
                    return this.renderHostDetail(index);
                })}
            </>
        );
    }

}
