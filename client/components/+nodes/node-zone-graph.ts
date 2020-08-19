import G6 from "@antv/g6";
import "./node-zone-register-shape";
import './node-zone-graph.scss'
export class NodeZoneGraph {

    private graph: any = null;
    private width: number;
    private height: number;
    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.initDrawGraphInstance();
    }

    private initDrawGraphInstance(): void {
        const data: any = {
            nodes: [
                { id: 'node112',lable:"node1", comboId: 'rack1',status:'error',description:'Zone-A/Rack=W-1'},
                { id: 'node2', lable:"node1", comboId: 'rack1' ,status:'ready',description:'Zone-A/Rack=W-1'},
                { id: 'node1-1',lable:"node1",comboId: 'rack1' ,status:'ready',description:'Zone-A/Rack=W-1'},
                { id: 'node2-2',lable:"node1",comboId: 'rack1' ,status:'ready',description:'Zone-A/Rack=W-1'},
                { id: 'node1-3',lable:"node1",comboId: 'rack1' ,status:'ready',description:'Zone-A/Rack=W-1'},
                { id: 'node2-4',comboId: 'rack2',status:'ready',description:'Zone-A/Rack=W-1'},
                { id: 'node1-5',lable:"node1",comboId: 'rack2',status:'ready',description:'Zone-A/Rack=W-1'},
                { id: 'node2-6',comboId: 'rack2' ,status:'ready',description:'Zone-A/Rack=W-1'},
                { id: 'node1-7',comboId: 'rack2' ,status:'ready',description:'Zone-A/Rack=W-1'},
                { id: 'node9-0',lable:"node1",comboId: 'rack3' ,status:'ready',description:'Zone-A/Rack=W-1'},
                { id: 'node9-1',lable:"node1",comboId: 'rack3' ,status:'error',description:'Zone-A/Rack=W-1'},
                { id: 'node9-2',comboId: 'rack3',status:'error',description:'Zone-A/Rack=W-1'},
                { id: 'node9-10',comboId: 'rack4',status:'ready',description:'Zone-A/Rack=W-1'},
                { id: 'node9-11',lable:"node1",comboId: 'rack4',status:'ready',description:'Zone-A/Rack=W-1'},
                { id: 'node9-12',comboId: 'rack4',status:'error',description:'Zone-A/Rack=W-1'},
                { id: 'node33',lable:"node1",comboId: 'rack5',status:'ready',description:'Zone-A/Rack=W-1'},
                { id: 'node34',lable:"node1",comboId: 'rack5',status:'error',description:'Zone-A/Rack=W-1'},
            ],
            combos: [
                { id:'rack1',description:'Zone-A/Rack=W-1'},
                { id:'rack2',description:'Zone-B/Rack=W-2'},
                { id:'rack3',description:'Zone-A/Rack=W-1'},
                { id:'rack4',description:'Zone-B/Rack=W-3'},
                { id:'rack5',description:'Zone-C/Rack=W-1'},
            ]
        };

        this.graph = new G6.Graph({
            container: "node-zone-graph",
            width: 1250,
            height: 370,
            renderer: "svg",
            fitView:true,
            fitViewPadding:[5,100,5,100],
            modes: {
                default: [
                  'drag-combo',
                  {
                    type: 'tooltip',
                    formatText: function formatText(model) {
                        const temp = `<div><span>Zone：</span>${model.description}</div> <div><span>Node：</span>${model.id}</div>`
                        return temp;
                    },
                  },
                  'drag-canvas',
                  'zoom-canvas'
                ]
            },
            layout:{
                type: 'comboForce',
                linkDistance: 10,         // 可选，边长
                nodeStrength: 10,         // 可选
                edgeStrength: 1,        // 可选
                nodeSpacing:10,
                maxIteration:100,
                comboSpacing:(d:any) => 50,
                comboPadding:(d:any) => 1,
                onTick: () => {           // 可选
                  console.log('ticking');
                },
                onLayoutEnd: () => {      // 可选
                  console.log('combo force layout done');
                }
            },
            groupByTypes: false,
            defaultCombo: {
                type: 'cCircle',
                style:{
                    stroke:'opacity',
                    lineWidth: 1,
                    opacity:0.8,
                    fillOpacity:0.9,
                },
            },
            defaultNode: {
                type:'self-node',
                size: 20,
               
            },
            comboStateStyles: {
                hover: {
                    opacity:0.5,
                    fillOpacity: 0.5,
                },
            },
            
        });

        this.graph.data(data);
        this.graph.render();
    }
}