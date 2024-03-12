import React, {useCallback, useEffect, useState} from 'react';
import ReactFlow, {
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    Background,
    Controls, MarkerType, useEdgesState,
    useNodeId,
    useNodesState
} from 'reactflow';
import 'reactflow/dist/style.css';
import SideMenu from "../../components/UI/SideMenu.jsx";
import NodeButton from "../../components/Buttons/NodeButton.jsx";
import './css/Home.css'
import CustomTextNode from "./components/CustomTextNode.jsx";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import CustomTextNodeDummy from "./components/CustomTextNodeDummy.jsx";
import _ from "lodash";
import NodeEditor from "./components/NodeEditor.jsx";
import Navbar from "../../components/UI/Navbar.jsx";
import toast from "react-hot-toast";
import {getToastStyles} from "../../utils/toastUtils.js";

const initialNodes = [
    { id: '1', type: "textUpdater", position: { x: 50, y: 50 }, data: { message: 'Message number 1', isSelected: false }, },
    { id: '2', type: "textUpdater", position: { x: 350, y: 150 }, data: { message: 'Message number 2', isSelected: false },  },
];
const initialEdges = [];

const nodeTypes = {textUpdater: CustomTextNode}

const Home = ({...props}) => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [pointerLocation, setPointerLocation] = useState({x: 0, y: 0});
    const [selectedNode, setSelectedNode] = useState({});


    useEffect(() => {
        window.addEventListener('mousemove', (e) => setPointerLocation({x: e.clientX, y: e.clientY}))

        return () => {
            window.removeEventListener('mousemove', this)
        }
    }, []);

    // const onNodesChange = useCallback(
    //     (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    //     [setNodes]
    // );
    // const onEdgesChange = useCallback(
    //     (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    //     [setEdges]
    // );
    const onConnect = useCallback(
        (connection) => {
            const newEdge = {
                ...connection,
                markerEnd: {
                    type: MarkerType.Arrow,
                },
            };
            setEdges((eds) => addEdge(newEdge, eds));
        },
        [setEdges]
    );

    const onSelectionChange = useCallback(
        (selection) => {
            if(!_.isEmpty(selection.nodes)) {
                const newSelection = selection?.nodes[0];
                setSelectedNode(newSelection);
                setNodes((nds) => nds.map(node => {
                    if(node?.id === newSelection?.id) {
                        node.selected = true;
                        node.data = {
                            ...node.data,
                            isSelected: true
                        }
                    } else {
                        node.selected = false;
                        node.data = {
                            ...node.data,
                            isSelected: false
                        }
                    }

                    return node;
                }));
            }
        },
        [setSelectedNode, setNodes]
    );

    const addNodes = (pointer) => {
            const newNode = {
                id: (nodes.length + 1).toString(),
                type: "textUpdater",
                position: {x: pointer?.x ? pointer.x -100 :100*(nodes.length + 1), y: pointer.y ? pointer.y - 100 : 100*(nodes.length + 1)},
                data: {message: `Message number ${nodes.length + 1}`, isSelected: false},
                width: 280,
                height: 90,
            }
            setNodes((nds) => [...nds, newNode]);
    }

    const changeNodes = (newNode, message) => {
        const tempNode = {...newNode}
        setNodes((nds) => nds.map(node => {
            if(node.id === tempNode.id) {
                node.data = {
                    ...node.data,
                    message: message,
                };
            }

            return node
        }));
    }

    const onDragEnd = (change) => {
        if(change?.destination?.droppableId === 'droppable-1') {
            addNodes(pointerLocation);
        }
    }

    const handleTextChange = (text) => {
        let newNode = {...selectedNode};
        newNode.data.message = text;
        setSelectedNode(newNode);
        changeNodes(newNode, text)
    }

    const validateConnections = () => {
        let isValid = true;
        let message = "No connections"
        if(_.isEmpty(edges)) {
            return false
        }

        return {isValid, error: message}
    }

    const handleSave = () => {
        let {isValid, error} = validateConnections();
        if(isValid) {
            toast('Saved Data !', {
                style: getToastStyles('success')
            })
        } else {
            toast(error ? error : "Cannot Save", {
                style: getToastStyles('error')
            })
        }
    }

    const handleBack = () => {
        setSelectedNode({});
        onSelectionChange({nodes: [{}]})
    }


    return (
            <>
                <Navbar onSave={handleSave} />
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
            </>
    )
}

export default Home
