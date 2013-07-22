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

mindplot.layout.CyclicSorter = new Class({
    Extends:mindplot.layout.AbstractBasicSorter,

    initialize:function () {

    },

    predictCycle: function(graph, parent, node, position, free){
        var rootNode = graph.getRootNode(parent);


        // If it is a dragged node...
        if (node) {
            $assert($defined(position), "position cannot be null for predict in dragging");
            var nodeDirection = this._getRelativeDirection(rootNode.getPosition(), node.getPosition());
            var positionDirection = this._getRelativeDirection(rootNode.getPosition(), position);
            var siblings = graph.getSiblings(node);

            var sameParent = parent == graph.getParent(node);
            if (siblings.length == 0 && nodeDirection == positionDirection && sameParent) {
                return [node.getOrder(), node.getPosition()];
            }
        }


        if (!position ) {
            var right = this._getChildrenForOrder(parent, graph, 0);
            var left = this._getChildrenForOrder(parent, graph, 1);
        }


        var order = position ? (position.x > rootNode.getPosition().x ? 0 : 1) : ((right.length - left.length) > 0 ? 1 : 0);
        var direction = order % 2 == 0 ? 1 : -1;
//        if((node==null) && parent.getId()==rootNode.getId()){
//            var children = this._getChildrenForOrder(parent, graph, order);
//            var vector=self._getDirectionVector(self._getAngle(node.order, children.length));
//            direction=vector.x>0?-1:1;
//        }

        // Exclude the dragged node (if set)
        var excludeDraggedNode = false;
        var excludedOrder = null;
        var children = this._getSortedChildren(graph, parent).filter(function (child) {
        	if(child!=node){
        		excludeDraggedNode = true;
        		excludedOrder = node?node.getOrder():null;
        	}
            return child!=node;
        });


        var totalLen = children.length + (excludeDraggedNode?1:0);
        
        if(position){
           var positionAngle =Math.atan(position.y / position.x) * 180 / Math.PI;
           positionAngle+=(position.x>0?180:0)
        }

        //get children from same side;
        children.map(function(d){
        	var angle = Math.atan(d.getPosition().y / d.getPosition().x);
        	var angleInRads = angle * 180 / Math.PI;
        	var childSign= d.getPosition().x > 0 ? true: false;
        	angleInRads+=(childSign>0?180:0)
        	if(d.getPosition().x==0){
        		if(d.getPosition().y>0){
        			angleInRads = 270;
        		}else{
        			angleInRads = 90;
        		}
        	}
        	
        	if(d.getPosition().y==0){
        		if(d.getPosition().x>0){
        			angleInRads = 180;
        		}else{
        			angleInRads = 0;
        		}
        	}
            d['angle'] = angleInRads;
        });

        // No children?
        if (children.length == 0) {
            return [order, {x:parent.getPosition().x + direction * (parent.getSize().width / 2 + mindplot.layout.BalancedSorter.INTERNODE_HORIZONTAL_PADDING * 2), y:parent.getPosition().y}];
        }

        // Try to fit within ...
        var result = null;
        var last = children.getLast();
        position = position || {x:last.getPosition().x, y:last.getPosition().y + 1};
        var candidates=[];
        children.sort(function(a,b){
            return a['angle']-b['angle'];
        });
        


        var found = false;
        var before=null;
        var after = null;
        var initialSign = (children[0].angle - positionAngle)/Math.abs((children[0].angle - positionAngle));
        before=children[0];
        for(var i=0;i<children.length;i++){
            result = [0, {x:children[i].getPosition().x,y:children[i].getPosition().y}];
            var sign = (children[i].angle - positionAngle)/Math.abs((children[i].angle - positionAngle));
            if(sign!=initialSign) {
                before= i>=1? children[i-1]:children[0];
                after = children[i];
                found=true;
                break;
            }else{
            	before=children[i];
            }
        }

        if(!found){
        	after=children[0];
        }
       
        //has found two nodes with higher and lower angles
        if(after && before){
            xAvg = (after.getPosition().x + before.getPosition().x)/2;
            yAvg = (after.getPosition().y + before.getPosition().y)/2;
            var vectorModule = Math.sqrt((xAvg*xAvg) + (yAvg*yAvg));
            var directionVector = {x:xAvg, y:yAvg};
            if(vectorModule>0) {
                directionVector = {x: xAvg/vectorModule, y:yAvg/vectorModule};
            }


            var radius=this._getRadius(children);
            var predictVector = {x: directionVector.x*radius, y: directionVector.y*radius};



            var newOrder = after.getOrder();
            if(after.getOrder()>excludedOrder) {
                newOrder = newOrder-1;
            }
            //case trying to drag a node to its position
            if(before.getOrder()+1 == after.getOrder()-1){
            	newOrder = excludedOrder;
            }

            newOrder= newOrder +((!found && !excludeDraggedNode)?1:0);
            result = [newOrder, {x:predictVector.x,y:predictVector.y}];
            return result;
        }
        
//        if(!found){
//        	before=children[0];
//        	after = children[children.length-1];
//        	xAvg = (after.getPosition().x + before.getPosition().x)/2;
//            yAvg = (after.getPosition().y + before.getPosition().y)/2;
//            return [after.getOrder()+1,{x:xAvg,y:yAvg}];
//            
//        }

        return result;
    },

    predict:function (graph, parent, node, position, free) {


        // If its a free node...
        if (free) {
            $assert($defined(position), "position cannot be null for predict in free positioning");
            $assert($defined(node), "node cannot be null for predict in free positioning");

            var rootNode = graph.getRootNode(parent);


            var direction = this._getRelativeDirection(rootNode.getPosition(), node.getPosition());

            var limitXPos = parent.getPosition().x + direction * (parent.getSize().width / 2 + node.getSize().width / 2 + mindplot.layout.BalancedSorter.INTERNODE_HORIZONTAL_PADDING);

            var xPos = direction > 0 ?
                (position.x >= limitXPos ? position.x : limitXPos) :
                (position.x <= limitXPos ? position.x : limitXPos);

            return [0, {x:xPos, y:position.y}];
        }

        var rootNode = graph.getRootNode(parent);
        if((node==null) && parent.getId()==rootNode.getId()){
            position=null;
        }

        if(parent.getId()==rootNode.getId()){
            return this.predictCycle(graph,parent,node,position,free);
        }


        // If it is a dragged node...
        if (node) {
            $assert($defined(position), "position cannot be null for predict in dragging");
            var nodeDirection = this._getRelativeDirection(rootNode.getPosition(), node.getPosition());
            var positionDirection = this._getRelativeDirection(rootNode.getPosition(), position);
            var siblings = graph.getSiblings(node);

            var sameParent = parent == graph.getParent(node);
            if (siblings.length == 0 && nodeDirection == positionDirection && sameParent) {
                return [node.getOrder(), node.getPosition()];
            }
        }


        if (!position ) {
            var right = this._getChildrenForOrder(parent, graph, 0);
            var left = this._getChildrenForOrder(parent, graph, 1);
        }


        var order = position ? (position.x > rootNode.getPosition().x ? 0 : 1) : ((right.length - left.length) > 0 ? 1 : 0);
        var direction = order % 2 == 0 ? 1 : -1;

        // Exclude the dragged node (if set)
        var children = this._getChildrenForOrder(parent, graph, order).filter(function (child) {
            return child != node;
        });

        // No children?
        if (children.length == 0) {
            return [order, {x:parent.getPosition().x + direction * (parent.getSize().width / 2 + mindplot.layout.BalancedSorter.INTERNODE_HORIZONTAL_PADDING * 2), y:parent.getPosition().y}];
        }

        // Try to fit within ...
        var result = null;
        var last = children.getLast();
        position = position || {x:last.getPosition().x, y:last.getPosition().y + 1};
        children.each(function (child, index) {
            var cpos = child.getPosition();
            if (position.y > cpos.y) {
                yOffset = child == last ?
                    child.getSize().height + mindplot.layout.BalancedSorter.INTERNODE_VERTICAL_PADDING * 2 :
                    (children[index + 1].getPosition().y - child.getPosition().y) / 2;
                result = [child.getOrder() + 2, {x:cpos.x, y:cpos.y + yOffset}];
            }
        });

        // Position wasn't below any node, so it must be inserted above
        if (!result) {
            var first = children[0];
            result = [position.x > 0 ? 0 : 1, {
                x:first.getPosition().x,
                y:first.getPosition().y - first.getSize().height - mindplot.layout.BalancedSorter.INTERNODE_VERTICAL_PADDING * 2
            }];
        }

        return result;
    },

    insert:function (treeSet, parent, child, order) {
        var rootNode = treeSet.getRootNode(parent);
        var children = this._getSortedChildren(treeSet, rootNode);

        
        
        //cyclesort case
        if(rootNode.getId()==parent.getId()){


            //case is new node
            if(child.getOrder()==null){
                var order=0;
                if(children.length>0) {
                    order=children[children.length-1].getOrder()+1;
                }
                child.setOrder(order);
                return;
            }

//
//        	if( child.getOrder()<order){
//            	order=order-1;
//            }


        	for (var i = 0; i < children.length; i++) {
                var node = children[i];
                if(node.getId()!=child.getId()){
	                max = Math.max(max, node.getOrder());
                    //de donde inserto en adelante les subo 1 el orden
	                if (node.getOrder() >= order) {

	                    max = Math.max(max, node.getOrder() + 1);
	                    node.setOrder(node.getOrder() + 1);
	                }
                }
            }

            child.setOrder(order);
            return;
        }
        

        var children = this._getChildrenForOrder(parent, treeSet, order);

        // If no children, return 0 or 1 depending on the side
        if (children.length == 0){
            child.setOrder(order % 2);
            return;
        }

        // Shift all the elements by two, so side is the same.
        // In case of balanced sorter, order don't need to be continuous...
        var max = 0;
        for (var i = 0; i < children.length; i++) {
            var node = children[i];
            max = Math.max(max, node.getOrder());
            if (node.getOrder() >= order) {
                max = Math.max(max, node.getOrder() + 2);
                node.setOrder(node.getOrder() + 2);
            }
        }

        var newOrder = order > (max + 1) ? (max + 2) : order;
        child.setOrder(newOrder);

    },

    detach:function (treeSet, node) {
        var parent = treeSet.getParent(node);
        var rootNode = treeSet.getParent(node);

        if(parent.getId()==rootNode.getId()) {
            var children = this._getSortedChildren(treeSet, rootNode);
            var correct=false;
            for(var i=0;i<children.length;i++) {
                var child=children[i];
                if(child.getId()!=node.getId()){
                    var newOrder=correct?i-1:i;
                    child.setOrder(newOrder);
                }else{
                    correct=true;
                }
            }
//            node.setOrder(0);
        }else{
            // Filter nodes on one side..
            var children = this._getChildrenForOrder(parent, treeSet, node.getOrder());

            children.each(function (child, index) {
                if (child.getOrder() > node.getOrder()) {
                    child.setOrder(child.getOrder() - 2);
                }
            });
            node.setOrder(node.getOrder() % 2 == 0 ? 0 : 1);
        }

    },

    computeOffsets:function (treeSet, rootNode) {
        $assert(treeSet, "treeSet can no be null.");
        $assert(rootNode, "rootNode can no be null.");
        var self = this;

        var offsets = {};

        var children = this._getSortedChildren(treeSet, rootNode);

        // Compute heights ...
        var nodes = children.map(
            function (child) {
                return {
                    id: child.getId(),
                    order: child.getOrder(),
                    width: child.getSize().width,
                    height: this._computeChildrenHeight(treeSet, child)
                };
            }, this);


        for (var i=0; i<nodes.length; i++) {
            var node = nodes[i];
            var xOffset = 0, yOffset = 0;
            var vector = self._getDirectionVector(self._getAngle(node.order, children.length));
            

            //radius as a function of number of nodes and width
            var radius=this._getRadius(nodes);

            // xOffset
            xOffset = Math.round(radius * vector.x);


            // yOffset
            yOffset = Math.round(radius * vector.y);

            // Add to offsets object
            $assert(!isNaN(xOffset), "xOffset can not be null");
            $assert(!isNaN(yOffset), "yOffset can not be null");
            offsets[node.id] = { x: xOffset, y: yOffset };
        }

        //adjust offset to childrens height

        //separate by sides
        var sides=this._getSides(nodes,offsets);
        //sort each side from upper nodes to lower nodes
        var rightNodes=sides.right.sort(function(a,b){return offsets[a.id].y>offsets[b.id].y});
        var leftNodes=sides.left.sort(function(a,b){return offsets[a.id].y>offsets[b.id].y});


        //separate in quadrants, each quadrants is sorted from the node closest to y=0
        var rightQuadrants=this._getQuadrants(rightNodes);
        var leftQuadrants=this._getQuadrants(leftNodes);

        //first set the position of pivots
        if(rightNodes.length > 3 && (rightNodes.length % 2)==0){
            var index=Math.floor(rightNodes.length/2)-1;
            var pivot1=rightNodes[index];
            var pivot2=rightNodes[index+1];
            this._checkHeightForPivot(pivot1,pivot2,offsets);
        }

        if(leftNodes.length > 3 && leftNodes.length % 2 ==0){
                    var index=Math.floor(leftNodes.length/2)-1;
                    var pivot1=leftNodes[index];
                    var pivot2=leftNodes[index+1];
                    this._checkHeightForPivot(pivot1,pivot2,offsets);
        }

        //separate and sort in quadrants
        //right side
        //get middle node
        this._checkHeight(rightQuadrants.upper.reverse(),0,offsets,-1);
        this._checkHeight(leftQuadrants.upper.reverse(),0,offsets,-1);
        this._checkHeight(rightQuadrants.lower,0,offsets,1);
        this._checkHeight(leftQuadrants.lower,0,offsets,1);

//        correct nodes to close to the Y-axis
//        if(nodes.length>10){
//            for (var i=0; i<nodes.length; i++) {
//                var node=nodes[i];
//                var xOffset = offsets[node.id].x;
//                var sign = (xOffset>0)? 1 : -1 ;
//                var limitSign = xOffset - (node.width/2)*sign;
//                limitSign=limitSign/Math.abs(limitSign);
//
//                if(sign!=limitSign) {
//                    //minimum distance from Y-Axis
//                    xOffset=(mindplot.layout.CyclicSorter.INTERNODE_HORIZONTAL_PADDING/2) + node.width/2*sign;
//                }
//                offsets[node.id].x = xOffset;
//            }
//        }
//        for (var i=0; i<nodes.length; i++) {
//            var sign = (xOffset>0)? 1 : -1 ;
//            var limitSign = xOffset - (node.width/2)*sign;
//            limitSign=limitSign/Math.abs(limitSign);
//
//            if(sign!=limitSign) {
//                xOffset=node.width/2*sign;
//            }
//
//        }



        return offsets;
    },

    verify:function (treeSet, node) {
        // Check that all is consistent ...
        var children = this._getChildrenForOrder(node, treeSet, node.getOrder());

        // All odd ordered nodes should be "continuous" by themselves
        // All even numbered nodes should be "continuous" by themselves
        var factor = node.getOrder() % 2 == 0 ? 2 : 1;
        for (var i = 0; i < children.length; i++) {
            var order = i == 0 && factor == 1 ? 1 : (factor * i);
            $assert(children[i].getOrder() == order, "Missing order elements. Missing order: " + (i * factor) + ". Parent:" + node.getId() + ",Node:" + children[i].getId());
        }
    },

    getChildDirection:function (treeSet, child) {
        var direction = 1;
        var rootNode = treeSet.getRootNode(child);

        if (child.getPosition().x == rootNode.getPosition().x) {
            direction = child.getPosition().y < 0 ? 1 : -1;
        } else {
            direction = child.getPosition().x < rootNode.getPosition().x ? -1 : 1;
        }

        return direction;
    },

    toString:function () {
        return "Cyclic Sorter";
    },

    _getDirection : function(order) {
        return order < 1 ? -1 : 1;
    },

    _getAngle : function(order, totalNodes) {
        return (order * 360 / totalNodes) % 360;
    },

    _getDirectionVector : function(alpha) {
        function inRads(angle) { return angle * (Math.PI / 180); }

        if (alpha == 0) {
            return { x: -1, y: 0 }
        } else if (alpha <= 90 ) {
            return { x: -Math.cos(inRads(alpha)), y: -Math.sin(inRads(alpha))}
        } else if (alpha <= 180) {
            return { x: Math.cos(inRads(180 - alpha)), y: -Math.sin(inRads(180 - alpha))}
        } else if (alpha <= 270) {
            return { x: Math.cos(inRads(alpha - 180)), y: Math.sin(inRads(alpha - 180))}
        } else {
            return { x: -Math.sin(inRads(alpha - 270)), y: Math.cos(inRads(alpha - 270))}
        }
    },

    _getChildrenForOrder:function (parent, graph, order) {
        return this._getSortedChildren(graph, parent).filter(function (child) {
            return child.getOrder() % 2 == order % 2;
        });
    },

    _getVerticalPadding:function () {
        return mindplot.layout.BalancedSorter.INTERNODE_VERTICAL_PADDING;
    },
    _checkHeight: function(quadrantNodes,currentNode,offsets,direction){

        if(quadrantNodes.length<=1)
            return;

        var node=quadrantNodes[currentNode];
        var nextNode=quadrantNodes[currentNode+1];


        var distanceToNextNode=this._getDistanceToNode(node,nextNode,offsets);
        var distanceDirection= distanceToNextNode/ Math.abs(distanceToNextNode);

        if(distanceDirection!= direction || Math.abs(distanceToNextNode)<(node.height/2.0 + nextNode.height/2.0)){
            offsets[nextNode.id].y=offsets[node.id].y +((node.height/2.0 + nextNode.height/2.0)*direction);
        }
        //correct next
        if(currentNode+2<quadrantNodes.length){
            this._checkHeight(quadrantNodes,currentNode+1,offsets,direction);
        }

        return;
    },
    _checkHeightForPivot: function(node,nextNode,offsets){

        var distanceToNextNode=this._getDistanceToNode(node,nextNode,offsets);
        if(distanceToNextNode<(node.height/2.0 + nextNode.height/2.0)){
            //we move apart the two nodes half the distance each.
            offsets[node.id].y=offsets[node.id].y +(0.5*(node.height/2.0 + nextNode.height/2.0)*-1);
            offsets[nextNode.id].y=offsets[nextNode.id].y +(0.5*(node.height/2.0 + nextNode.height/2.0)*1);
        }

        return;
    },
    _getDistanceToNode:function(node,nextNode,offsets){
        var pos1=offsets[node.id].y;
        var pos2=offsets[nextNode.id].y;

        return pos2-pos1;
    },
    _getSides: function(nodes,offsets,treeSet){
        var rightNodes=[];
        var leftNodes=[];
         //separate by sides
        for (var i=0; i<nodes.length; i++) {
                    var node = nodes[i];
                    //filter by side
                    var side = offsets[node.id].x >= 0? 1:0;
                    if(side){
                        rightNodes.push(node);
                    }else{
                        leftNodes.push(node);
                    }
        }

        return {right:rightNodes,left:leftNodes};
    },
    _getQuadrants: function(sideNodes){
        var pairNodes=(sideNodes.length % 2) ==0;
        var upperQuadrant=[];
        var lowerQuadrant=[];
        var switchQ=false;
        var pivotNode=sideNodes[Math.floor(sideNodes.length/2)];
        for (var i=0; i<sideNodes.length; i++) {
            if(!switchQ){
                if(sideNodes[i].id!=pivotNode.id){
                    upperQuadrant.push(sideNodes[i]);
                }else{
                    if(!pairNodes)
                        upperQuadrant.push(sideNodes[i]);
                    switchQ=true;
                    lowerQuadrant.push(sideNodes[i]);
                }
            }else{
                lowerQuadrant.push(sideNodes[i]);
            }

        }

        return {upper:upperQuadrant,lower:lowerQuadrant};
    },
    _getRadius: function(nodes){
        var radius=mindplot.layout.CyclicSorter.BASE_RADIUS;
        var factor= (Math.sqrt(3*nodes.length)/5 +1);
        radius*=factor;
        var maxWidth=0;
        return radius;
    }
});

mindplot.layout.CyclicSorter.INTERNODE_VERTICAL_PADDING = 0;
mindplot.layout.CyclicSorter.INTERNODE_HORIZONTAL_PADDING = 20;
mindplot.layout.CyclicSorter.BASE_RADIUS = 130;
