import _ from "lodash";
import {getConnectedEdges} from "reactflow";

export const validateConnectionsForTabs = (sheetData, tabs) => {
    if(!_.isEmpty(sheetData)) {
        const tabValidations = tabs.map(tab => {
            const tabData = sheetData[tab.id.toString()];
            let isValid = true;
            let message = `All nodes are connected in Tab: ${tab.label}`;

            if (_.isEmpty(tabData.savedEdges)) {
                isValid = false;
                message = `No connections in Tab: ${tab.label}`;
            } else {
                const connectedEdges = getConnectedEdges(tabData.savedNodes, tabData.savedEdges);
                const nodesWithAtLeastOneConnection = new Set();
                tabData.savedEdges.forEach(edge => {
                    nodesWithAtLeastOneConnection.add(edge.source);
                    nodesWithAtLeastOneConnection.add(edge.target);
                });

                const nodeWithZeroConnections = tabData.savedNodes.filter(node => !nodesWithAtLeastOneConnection.has(node.id));
                if (nodeWithZeroConnections.length > 0) {
                    isValid = false;
                    message = `Not all nodes connected in Tab: ${tab.label}`;
                }
            }

            return { isValid, message };
        });

        return tabValidations;
    } else {
        return [{isValid: false, message: 'No Nodes to save'}]
    }
};
