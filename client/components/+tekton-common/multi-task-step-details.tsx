import {observer} from "mobx-react";
import React from "react";
import {computed, observable} from "mobx";
import {ActionMeta} from "react-select/src/types";
import {Collapse} from "../collapse";
import {Button} from "../button";
import {taskStep, TaskStep} from "./common";
import {TaskStepDetails} from "./task-step-details";
import {Trans} from "@lingui/macro";
import {Icon} from "../icon";
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";

  onChange?(value: T, meta?: ActionMeta<any>): void;
}

@observer
export class MultiTaskStepDetails extends React.Component<Props> {
  @computed get value(): TaskStep[] {
    return this.props.value || [];
  }

  add() {
    this.value.push(taskStep);
    this.forceUpdate();
  }

  remove = (index: number) => {
    this.value.splice(index, 1);
    this.forceUpdate();
  }

  genExtra = (index: number) => {
    if (this.value.length > 1) {
      return (
        <Icon
          material={"delete_outline"}
          style={{color: '#ff4d4f'}}
          onClick={(event) => {
            this.remove(index);
            event.preventDefault();
            event.stopPropagation();
          }}
        />
      );
    }
    return null;
  }

  getItemStyle = (draggableStyle: any, isDragging: boolean) => ({
    
      // some basic styles to make the items look a bit nicer
      userSelect: 'none',
      margin: '0 0 4px 0',
      
      // styles we need to apply on draggables
      ...draggableStyle
  })

  onDragEnd = (result: any) => {

    // dropped outside the list
    if(!result.destination) {
       return; 
    }
    const [removed] = this.value.splice(result.source.index, 1);
    this.value.splice(result.destination.index, 0, removed);
  }

  render() {
    
    return (
      <>
        <Button primary onClick={() => this.add()}>
          <span>Add Step</span>
        </Button>
        <br/>
        <br/>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided: any, snapshot: any) => (
              <div 
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {this.value?.map((item: any, index: number) => {
                  return (
                  <Draggable
                    key={`Draggable${index}`}
                    draggableId={`Draggable${index}`}
                    index={index}
                  >
                    {(provided: any, snapshot: any) => (
                      <div>
                        <div
                          ref={provided.innerRef}
                          {...provided.dragHandleProps}
                          {...provided.draggableProps}
                          style={this.getItemStyle(
                            provided.draggableProps.style,
                            snapshot.isDragging
                          )}
                        >
                          <Collapse panelName={<Trans>Step</Trans>} extraExpand={this.genExtra(index)} key={"step" + index}>
                            <TaskStepDetails value={this.value[index]} onChange={value => this.value[index] = value}/>
                          </Collapse>
                        </div>
                        {provided.placeholder}
                      </div>
                    )}
                  </Draggable>
                )})}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </>
    )

  }
}