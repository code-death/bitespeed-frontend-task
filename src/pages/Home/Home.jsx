import React, {useCallback, useEffect, useState} from 'react';
import {
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    getConnectedEdges,
    MarkerType,
    updateEdge, useEdgesState,
    useNodesState
} from 'reactflow';
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
import {validateConnectionsForTabs} from "../../utils/validations.js";

const initialNodes = [
    { id: '1', type: "textUpdater", position: { x: 50, y: 50 }, data: { message: 'Message number 1'}, },
    { id: '2', type: "textUpdater", position: { x: 350, y: 150 }, data: { message: 'Message number 2'},  },
];
const initialEdges = [];

const nodeTypes = {textUpdater: CustomTextNode}

const Home = ({localData, activeTabId, ...props}) => {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [pointerLocation, setPointerLocation] = useState({x: 0, y: 0});
    const [selectedNode, setSelectedNode] = useState({});

    const tabs = useSelector(state => state.tabs);
    const sheetData = useSelector(state => state.allData);

    const dispatch = useDispatch();

    useEffect(() => {
        let tabData = sheetData?.[activeTabId];
        if(!_.isEqual(tabData?.savedNodes, nodes) || !_.isEqual(tabData?.savedEdges, edges)) {
            if(!_.isEmpty(nodes) || !_.isEmpty(edges)) {
                let payload = {};
                payload.tabId = activeTabId;
                payload.data = {
                    savedNodes: nodes,
                    savedEdges: edges
                }
                dispatch(setSheetData(payload))
            }
        }
    }, [nodes, edges]);


    useEffect(() => {
            let tabData = sheetData?.[activeTabId];
            let selectedNode = tabData?.savedNodes.filter(node => node.selected)?.[0];
            if(!_.isEmpty(tabData) && !_.isEmpty(tabData.savedNodes) && !_.isEmpty(tabData.savedEdges)) {
                setNodes(prevNodes => tabData.savedNodes.map(nd => nd))
                setEdges(prevEdges => tabData.savedEdges.map(ed => ed))
            }
            if(!_.isEmpty(selectedNode)) {
                setSelectedNode(selectedNode);
            } else {
                setSelectedNode({})
            }
    }, [sheetData, activeTabId]);

    useEffect(() => {
        window.addEventListener('mousemove', (e) => setPointerLocation({x: e.clientX, y: e.clientY}))

        return () => {
            window.removeEventListener('mousemove', this)
        }
    }, []);

    const onNodesChange = useCallback(
        (changes) => {
            setNodes((nds) => applyNodeChanges(changes, nds));
        },
        [setNodes]
    );

    const onEdgesChange = useCallback(
        (changes) => {
            setEdges((eds) => applyEdgeChanges(changes, eds));
        },
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
            if (!_.isEmpty(selection.nodes)) {
                const newSelection = selection.nodes[0];
                setSelectedNode(newSelection);
                setNodes((nds) =>
                    nds.map((node) => {
                        if (node.id === newSelection.id) {
                            return {
                                ...node,
                                selected: true,
                            };
                        } else {
                            return {
                                ...node,
                                selected: false,
                            };
                        }
                    })
                );
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
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === newNode.id) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            message: message,
                        },
                    };
                }
                return node;
            })
        );
    };

    const onDragEnd = (change) => {
        if(change?.destination?.droppableId === 'droppable-1') {
            addNodes(pointerLocation);
        }
    }

    const handleTextChange = (text) => {
        const updatedNode = {
            ...selectedNode,
            data: {
                ...selectedNode.data,
                message: text,
            },
        };
        setSelectedNode(updatedNode);
        changeNodes(updatedNode, text);
    };




    const handleSave = () => {
        const tabValidations = validateConnectionsForTabs(sheetData, tabs);

        const allTabsValid = tabValidations?.every(validation => validation.isValid);

        if (allTabsValid) {
            const localData = JSON.parse(window.localStorage.getItem('sheetData')) || {};
            const payload = {
                tabId: activeTabId,
                data: {
                    savedNodes: nodes,
                    savedEdges: edges
                }
            };
            localData[activeTabId] = payload.data;
            dispatch(setSheetData(payload));
            window.localStorage.setItem('sheetData', JSON.stringify(localData));
            window.localStorage.setItem('tabs', JSON.stringify(tabs));
            toast('Saved Data !', {
                style: getToastStyles('success')
            });
        } else {
            const invalidTabMessages = tabValidations.filter(validation => !validation.isValid)
                .map(validation => validation.message)
                .join('\n');
            toast(invalidTabMessages || 'Cannot Save', {
                style: getToastStyles('error')
            });
        }
    };

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
