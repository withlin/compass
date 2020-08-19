import { autorun, observable } from "mobx";
import { t } from "@lingui/macro";
import { autobind } from "../../utils";
import { Terminal } from "./terminal";
import { TerminalApi } from "../../api/terminal-api";
import { dockStore, IDockTab, TabId, TabKind } from "./dock.store";
import { WebSocketApiState } from "../../api/websocket-api";
import { _i18n } from "../../i18n";
import { themeStore } from "../../theme.store";

export interface ITerminalTab extends IDockTab {
  node?: string; // activate node shell mode
  pod?: string;
  container?: string;
}

export function isTerminalTab(tab: IDockTab) {
  return tab && tab.kind === TabKind.TERMINAL;
}

export function createTerminalTab(tabParams: Partial<ITerminalTab> = {}) {
  return dockStore.createTab({
    kind: TabKind.TERMINAL,
    title: _i18n._(t``),
    ...tabParams,
  });
}

@autobind()
export class TerminalStore {
  protected namespace: string;
  protected pod: string;
  protected container: string;
  protected shellType: string;
  protected terminals = new Map<TabId, Terminal>();
  protected connections = observable.map<TabId, TerminalApi>();

  constructor() {
    // connect active tab
    autorun(() => {
      const { selectedTab, isOpen } = dockStore;
      if (!isTerminalTab(selectedTab)) return;
      if (isOpen) {
        this.connect(selectedTab.id);
      }
    });
    // disconnect closed tabs
    autorun(() => {
      const currentTabs = dockStore.tabs.map((tab) => tab.id);
      for (const [tabId] of this.connections) {
        if (!currentTabs.includes(tabId)) this.disconnect(tabId);
      }
    });
  }

  async connect(tabId: TabId) {
    if (this.namespace && this.container) {
      if (this.isConnected(tabId)) {
        return;
      }
      const tab: ITerminalTab = dockStore.getTabById(tabId);
      const api = new TerminalApi({
        namespace: this.namespace,
        pod: this.pod,
        container: this.container,
        shellType: this.shellType,
        id: tabId,
        node: tab.node,
        colorTheme: themeStore.activeTheme.type,
      });
      const terminal = new Terminal(tabId, api);
      this.connections.set(tabId, api);
      this.terminals.set(tabId, terminal);
    } else {
      dockStore.closeTab(tabId);
    }
  }

  disconnect(tabId: TabId) {
    if (!this.isConnected(tabId)) {
      return;
    }
    const terminal = this.terminals.get(tabId);
    const terminalApi = this.connections.get(tabId);
    terminal.destroy();
    terminalApi.destroy();
    this.connections.delete(tabId);
    this.terminals.delete(tabId);
  }

  reconnect(tabId: TabId) {
    const terminalApi = this.connections.get(tabId);
    if (terminalApi) terminalApi.connect();
  }

  isConnected(tabId: TabId) {
    return !!this.connections.get(tabId);
  }

  isDisconnected(tabId: TabId) {
    const terminalApi = this.connections.get(tabId);
    if (terminalApi) {
      return terminalApi.readyState === WebSocketApiState.CLOSED;
    }
  }

  sendCommand(
    command: string,
    options: { enter?: boolean; newTab?: boolean; tabId?: TabId } = {}
  ) {
    const { enter, newTab, tabId } = options;
    const { selectTab, getTabById } = dockStore;

    const tab = tabId && getTabById(tabId);
    if (tab) selectTab(tabId);
    if (newTab) createTerminalTab();

    const terminalApi = this.connections.get(dockStore.selectedTabId);
    if (terminalApi) {
      terminalApi.emitStatus(command);
      if (enter) {
        const dataObj = { Data: command + (enter ? "\r" : "") };
        terminalApi.sendCommand(dataObj);
      }
    }
  }

  async startTerminal(
    namespace: string,
    pod: string,
    container: string,
    shellType?: string,
    options: { newTab?: boolean; tabId?: TabId } = {}
  ) {
    this.namespace = namespace;
    this.pod = pod;
    this.container = container;
    this.shellType = shellType;

    const { newTab, tabId } = options;
    const { selectTab, getTabById } = dockStore;

    const tab = tabId && getTabById(tabId);
    if (tab) selectTab(tabId);
    if (newTab) createTerminalTab({ pod: this.pod, container: this.container });
  }

  getTerminal(tabId: TabId) {
    return this.terminals.get(tabId);
  }

  reset() {
    [...this.connections].forEach(([tabId]) => {
      this.disconnect(tabId);
    });
  }
}

export const terminalStore = new TerminalStore();
