import "./register-shape";
import G6 from "@antv/g6";

export const graphId = "container"

export const initData = {
  nodes: [
    {
      id: "1-1",
      x: 0,
      y: 0,
      taskName: "",
      anchorPoints: [
        [0, 0.5],
        [1, 0.5],
      ],
    },
  ],
}

export class Graphs {

  public instance: any = null;
  public width: number = 0;
  public height: number = 0;
  public cfg: any = null;

  constructor(width?: number, height?: number) {
    this.width = width;
    this.height = height;

    this.cfg = {
      container: graphId,
      width: this.width,
      height: this.height,
      renderer: "svg",
      autoPaint: true,
      defaultEdge: {
        type: "Line",
        style: {
          stroke: "#959DA5",
          lineWidth: 4,
        },
        // 其他配置
      },
      defaultNode: {
        type: "card-node",
        size: [140, 60],
        linkPoints: {
          left: true,
          right: true,
          size: 5,
        },
      },
      nodeStateStyles: {
        hover: {
          fillOpacity: 0.1,
          lineWidth: 2,
        },
      },
    }
  }

  setNodeStatusToSucceed(node: any): void {
    this.instance.setItemState("succeed", false, node);
  }

  setNodeStatusToFailed(node: any): void {
    this.instance.setItemState("failed", "", node);
  }

  setNodeStatusToPending(node: any): void {
    this.instance.setItemState("pending", "", node);
  }

  setNodeStatusToCancel(node: any): void {
    this.instance.setItemState("cancel", "", node);
  }

  bindClickOnNode(callback: (currentNode: any) => any): void {

    this.instance.on("node:click", (evt: any) => {
      const {item} = evt;
      const shape = evt.target.cfg.name;

      if (shape === "right-plus") {
        const source = item._cfg.id.toString();
        let splitSource = source.split("-");
        splitSource[0] = Number(splitSource[0]) + 1;

        let tragetId = splitSource.join("-");

        const model = item.getModel();
        const {x, y} = model;
        const point = this.instance.getCanvasByPoint(x, y);
        const NodeX = Number(point.x) + 300;

        if (this.width - NodeX < 400) {
          this.width = this.width + 400;
          this.changeSize(this.width, this.height);
        }

        this.instance.addItem("node", {
          id: tragetId,
          taskName: "",
          x: Number(point.x) + 300,
          y: Number(point.y),
          anchorPoints: [
            [0, 0.5],
            [1, 0.5],
          ],
        });

        this.instance.addItem("edge", {
          source: tragetId,
          target: model.id,
        });

        return;
      }

      if (shape === "bottom-plus") {
        const source = item._cfg.id;
        let splitSource = source.split("-");

        splitSource[1] = Number(splitSource[1]) + 1;

        let tragetId = splitSource.join("-");
        const model = item.getModel();
        const {x, y} = model;
        const point = this.instance.getCanvasByPoint(x, y);
        const NodeY: number = Number(point.y) + 80;

        if (this.height - NodeY < 100){
          this.height = this.height + 100;
          this.changeSize(this.width, this.height);
        }

        this.instance.addItem("node", {
          id: tragetId,
          taskName: "",
          x: Number(point.x),
          y: NodeY,
          anchorPoints: [
            [0, 0.5],
            [1, 0.5],
          ],
        });

        let edgeTarget = model.id.toString();
        let splitEdgeTarget = edgeTarget.split('-');
        splitEdgeTarget[0] = Number(splitEdgeTarget[0]);
        splitEdgeTarget[1] = '1';
        let edgeTargetId = splitEdgeTarget.join("-");

        this.instance.addItem("edge", {
          type: "hvh",
          source: edgeTargetId,
          target: tragetId,
        });
        return;
      }

      callback(item);

    });
  }

  setTaskName(taskName: string, node: any): void {
    let nodes = this.instance.save();
    nodes.nodes.map((item: any, index: number) => {
      if (node._cfg.id === item.id) {
        item.taskName = taskName
      }
      nodes[index] = item;
    })
    this.instance.changeData(nodes);
    this.instance.setItemState(node, "click", taskName);
  }

  bindMouseenter(): void {
    // 监听鼠标进入节点事件
    this.instance.on("node:mouseenter", (evt: { item: any }) => {
      const node = evt.item;
      // 激活该节点的 hover 状态
      this.instance.setItemState(node, "hover", true);
    });
  }

  bindMouseleave(): void {
    // 监听鼠标离开节点事件
    this.instance.on("node:mouseleave", (evt: { item: any }) => {
      const node = evt.item;
      // 关闭该节点的 hover 状态
      this.instance.setItemState(node, "hover", false);
    });
  }

  changeSize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.instance.changeSize(this.width, this.height);
  }

  init() {
    this.instance = new G6.Graph(this.cfg);
    // this.instance.data(initData);
    this.instance.setMode("addEdge");
  }

  render() {
    if (this.instance) {
      this.instance.render()
    }
  }

}

