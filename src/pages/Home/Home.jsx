import React, {useCallback, useEffect, useState} from 'react';
import {addEdge, applyEdgeChanges, applyNodeChanges, getConnectedEdges, MarkerType, updateEdge,} from 'reactflow';
import 'reactflow/dist/style.css';
import './css/Home.css'
import CustomTextNode from "./components/CustomTextNode.jsx";
import _ from "lodash";
import Navbar from "../../components/UI/Navbar.jsx";
import toast from "react-hot-toast";
import {getToastStyles} from "../../utils/toastUtils.js";
import FlowComponent from "./components/FlowComponent.jsx";
import {useDispatch, useSelector} from "react-redux";
import {setSheetData} from "../../redux/store.js";

const initialNodes = [
    { id: '1', type: "textUpdater", position: { x: 50, y: 50 }, data: { message: 'Message number 1', isSelected: false }, },
    { id: '2', type: "textUpdater", position: { x: 350, y: 150 }, data: { message: 'Message number 2', isSelected: false },  },
];
const initialEdges = [];

const nodeTypes = {textUpdater: CustomTextNode}

const Home = ({localData, activeTabId, ...props}) => {
    const [nodes, setNodes] = useState(localData?.savedNodes ? localData?.savedNodes : []);
    const [edges, setEdges] = useState(localData?.savedEdges ? localData?.savedEdges : []);
    const [pointerLocation, setPointerLocation] = useState({x: 0, y: 0});
    const [selectedNode, setSelectedNode] = useState({});

    const tabs = useSelector(state => state.tabs)

    const dispatch = useDispatch();

    useEffect(() => {
        if(!_.isEmpty(localData)) {
            setNodes(prevNodes => localData.savedNodes.map(nd => nd))
            setEdges(prevEdges => localData.savedEdges.map(ed => ed))
        } else {
            setNodes(prevNodes => []);
            setEdges(prevEdges => []);
        }
    }, [localData]);

    useEffect(() => {
        window.addEventListener('mousemove', (e) => setPointerLocation({x: e.clientX, y: e.clientY}))

        return () => {
            window.removeEventListener('mousemove', this)
        }
    }, []);

    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [setNodes]
    );
    const onEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [setEdges]
    );
    const onConnect = useCallback(
        (connection) => {
            if(connection.source !== connection.target) {
                const newEdge = {
                    ...connection,
                    markerEnd: {
                        type: MarkerType.Arrow,
                    },
                };

                setEdges((edges) => {
                    let edgeExists = [...edges].filter(edge => edge.source === connection.source)?.[0];
                    if(_.isEmpty(edgeExists)) {
                        return addEdge(newEdge, edges)
                    } else {
                        return updateEdge(edgeExists, newEdge, edges)
                    }
                });
            }
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

    const validateConnectionsForSaving = () => {
        let isValid = true;
        let message = "No connections";

        if(_.isEmpty(edges)) {
            isValid = false;
            message = "No connections"
        } else {
            let connectedEdges = getConnectedEdges(nodes, edges);
            let nodesWithAtLeastOneConnection = [];
            let nodeWithZeroConnections = [];
            connectedEdges.forEach(edge => {
                if (!nodesWithAtLeastOneConnection.includes(edge.source)) {
                    nodesWithAtLeastOneConnection.push(edge.source)
                }
                if (!nodesWithAtLeastOneConnection.includes(edge.target)) {
                    nodesWithAtLeastOneConnection.push(edge.target)
                }
            })

            nodes.forEach(node => {
                if(!nodesWithAtLeastOneConnection.includes(node.id)) {
                    nodeWithZeroConnections.push(node.id)
                }
            })

            if(nodeWithZeroConnections.length > 0) {
                isValid = false;
                message = "Not all nodes connected"
            }
        }

        return {isValid, error: message}
    }

    const handleSave = () => {
        let {isValid, error} = validateConnectionsForSaving();
        if(isValid) {
            let localData = JSON.parse(window.localStorage.getItem('sheetData'));
            if(_.isEmpty(localData)) {
                localData = {};
            }
            let payload = {};
            payload.tabId = activeTabId;
            payload.data = {
                savedNodes: nodes,
                savedEdges: edges
            }
            localData[activeTabId] = payload.data;
            dispatch(setSheetData(payload));
            window.localStorage.setItem('sheetData', JSON.stringify(localData));
            window.localStorage.setItem('tabs', JSON.stringify(tabs));
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
                <FlowComponent
                    onDragEnd={onDragEnd}
                    onSelectionChange={onSelectionChange}
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    selectedNode={selectedNode}
                    addNodes={addNodes}
                    handleBack={handleBack}
                    handleTextChange={handleTextChange}
                />
            </>
    )
}

export default Home
