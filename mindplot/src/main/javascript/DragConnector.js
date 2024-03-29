/*
 *    Copyright [2011] [wisemapping]
 *
 *   Licensed under WiseMapping Public License, Version 1.0 (the "License").
 *   It is basically the Apache License, Version 2.0 (the "License") plus the
 *   "powered by wisemapping" text requirement on every single page;
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the license at
 *
 *       http://www.wisemapping.org/license
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */

mindplot.DragConnector = new Class({
    initialize:function (designerModel, workspace) {
        $assert(designerModel, 'designerModel can not be null');
        $assert(workspace, 'workspace can not be null');

        // this._layoutManager = layoutManager;
        this._designerModel = designerModel;
        this._workspace = workspace;
    },

    checkConnection:function (dragTopic,selectedNodes) {
        var topics = this._designerModel.getTopics();

        // Must be disconnected from their current connection ?.
        var candidates = this._searchConnectionCandidates(dragTopic,selectedNodes);
        var currentConnection = dragTopic.getConnectedToTopic();

        var self=this;
        selectedNodes.map(function(node){
            var currentConnection = node.getConnectedToTopic();
            if (currentConnection && ((candidates.length == 0) || candidates[0] != currentConnection)) {
                //only allow disconnection when no candidates available and selection is only one node
                if (selectedNodes.length == 1) {
                    dragTopic.disconnect(self._workspace);
                }else if(candidates.length>0) {
                    dragTopic.disconnect(self._workspace);
                }
            }


            if (!node.isConnected() && candidates.length > 0) {
            // dragTopic.connectTo(candidates[0]);
            // Finally, connect nodes ...
                node.connectTo(candidates[0]);
            }
        });
    },

    _searchConnectionCandidates:function (dragTopic,selectedNodes) {
        var topics = this._designerModel.getTopics();
        var draggedNode = dragTopic.getDraggedTopic();

        var layoutManager = dragTopic.getLayoutManager();
        var rootNodeId = layoutManager._treeSet._rootNodes[0].getId();
       // var treeSet=layoutManager.getTreeSet();


        // Drag node connects to the border ...
        var dragTopicWidth = dragTopic.getSize ? dragTopic.getSize().width : 0; // Hack...
        var xMouseGap = dragTopic.getPosition().x > 0 ? 0 : dragTopicWidth;
        var sPos = {x:dragTopic.getPosition().x - xMouseGap, y:dragTopic.getPosition().y};

        // Perform a initial filter to discard topics:
        //  - Exclude dragged topic
        //  - Exclude dragTopic pivot
        //  - Nodes that are collapsed
        //  - It's not part of the branch dragged itself
        topics = topics.filter(function (topic) {
            var result = draggedNode != topic;
            result = result && topic != draggedNode;
            result = result && !topic.areChildrenShrunken() && !topic.isCollapsed();
            result = result && !draggedNode.isChildTopic(topic);
            return result;
        });

        //if multiples node selected, filter nodes for all of them
        if(selectedNodes.length>1){
            var draggedTopics = selectedNodes.map(function(a){
                return a.getDraggedTopic();
            });
            for(var i=0;i<draggedTopics.length;i++) {
                var draggedNode = draggedTopics[i];
                topics = topics.filter(function (topic) {
                    var result = draggedNode != topic;
                    result = result && topic != draggedNode;
                    result = result && !topic.areChildrenShrunken() && !topic.isCollapsed();
                    result = result && !draggedNode.isChildTopic(topic);
                    return result;
                });
            }
        }


        // Filter all the nodes that are outside the vertical boundary:
        //  * The node is to out of the x scope
        //  * The x distance greater the vertical tolerated distance
        var self=this;
        topics = topics.filter(function (topic) {
            var tpos = topic.getPosition();
            // Center topic has different alignment than the rest of the nodes. That's why i need to divide it by two...
            var txborder = tpos.x + (topic.getSize().width / 2) * Math.sign(sPos.x);
            var distance = (sPos.x - txborder) * Math.sign(sPos.x);
            //console.log("distance between: " + topic.getId() + " " + distance);
            if(topic.getId()==rootNodeId){
                var radius=self._getRadius(topic.getChildren());
                return  (distance < 2*radius);
            }
            return  distance > 0 && (distance < mindplot.DragConnector.MAX_VERTICAL_CONNECTION_TOLERANCE);

        });

        // Assign a priority based on the distance:
        // - Alignment with the targetNode
        // - Vertical distance
        // - Horizontal proximity
        // - It's already connected.
        var currentConnection = dragTopic.getConnectedToTopic();
        topics = topics.sort(function (a, b) {
            var aPos = a.getPosition();
            var bPos = b.getPosition();

            var av = this._isVerticallyAligned(a.getSize(), aPos, sPos);
            var bv = this._isVerticallyAligned(b.getSize(), bPos, sPos);
            return  this._proximityWeight(av, a, sPos, currentConnection) - this._proximityWeight(bv, b, sPos, currentConnection);

        }.bind(this));
        return topics;
    },

    _proximityWeight:function (isAligned, target, sPos, currentConnection) {
        var tPos = target.getPosition();
        return  (isAligned ? 0 : 200    ) + Math.abs(tPos.x - sPos.x) + Math.abs(tPos.y - sPos.y) + (currentConnection == target ? 0 : 100);
    },

    _isVerticallyAligned:function (targetSize, targetPosition, sourcePosition) {

        return Math.abs(sourcePosition.y - targetPosition.y) < targetSize.height / 2;

    },
    _getRadius: function(nodes){
        var radius=mindplot.layout.CyclicSorter.BASE_RADIUS;
        var factor= (Math.sqrt(3*nodes.length)/5 +1);
        radius*=factor;
        return radius;
    }

});

mindplot.DragConnector.MAX_VERTICAL_CONNECTION_TOLERANCE = 80;
