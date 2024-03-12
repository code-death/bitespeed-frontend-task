import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import ReactFlow, {Background, Controls} from "reactflow";
import _ from "lodash";
import SideMenu from "../../../components/UI/SideMenu.jsx";
import CustomTextNodeDummy from "./CustomTextNodeDummy.jsx";
import NodeButton from "../../../components/Buttons/NodeButton.jsx";
import NodeEditor from "./NodeEditor.jsx";
import React from "react";
import Tabs from "../../../components/UI/Tabs/Tabs.jsx";

const FlowComponent = ({
                           onDragEnd,
                           onSelectionChange,
                           nodes,
                           edges,
                           onNodesChange,
                           onEdgesChange,
                           onConnect,
                           nodeTypes,
                           selectedNode,
                           addNodes,
                           handleBack,
                           handleTextChange,
                           ...props}) => {
    return (
        <DragDropContext
            onDragEnd={onDragEnd}
        >
            <div className={'home'}>
                <Droppable droppableId="droppable-1" type="PERSON">
                    {
                        (provided, snapshot) => {

                            return (
                                <div ref={provided.innerRef} className={'flow-drawer'}>
                                    <ReactFlow
                                        elementsSelectable={true}
                                        onSelectionChange={onSelectionChange}
                                        nodes={nodes}
                                        edges={edges}
                                        onNodesChange={onNodesChange}
                                        onEdgesChange={onEdgesChange}
                                        onConnect={onConnect}
                                        nodeTypes={nodeTypes}
                                    >
                                        <Controls />
                                        {/*<MiniMap />*/}
                                        <Background variant="dots" gap={12} size={1} />
                                    </ReactFlow>
                                    {provided.placeholder}
                                </div>
                            )
                        }
                    }
                </Droppable>
                {
                    _.isEmpty(selectedNode) ? (
                        <Droppable droppableId={"droppable-2"} type={"PERSON"}>
                            {
                                (provided, snapshot) => (
                                    <div ref={provided.innerRef}>
                                        <SideMenu position={'right'}>
                                            <Draggable draggableId="draggable-1" index={0}>
                                                {
                                                    (provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                        >
                                                            {snapshot.isDragging ? <CustomTextNodeDummy data={{message: "Drop me !"}} /> : <NodeButton onClick={addNodes} style={{width: '45%'}} text={'Message'} />}
                                                        </div>
                                                    )
                                                }
                                            </Draggable>
                                        </SideMenu>
                                        {provided.placeholder}
                                    </div>
                                )
                            }
                        </Droppable>
                    ) : (
                        <SideMenu style={{padding:0, width: "27%", height: "94vh"}} position={'right'}>
                            {selectedNode && <NodeEditor handleBack={handleBack} onChange={handleTextChange} type={'Message'} data={selectedNode.data}/>}
                        </SideMenu>
                    )
                }
            </div>
        </DragDropContext>
    )
}

export default FlowComponent
