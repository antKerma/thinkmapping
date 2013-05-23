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

        if (!position) {
            var right = this._getChildrenForOrder(parent, graph, 0);
            var left = this._getChildrenForOrder(parent, graph, 1);
        }
        // Filter nodes on one side..
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
        var children = this._getChildrenForOrder(parent, treeSet, order);

        // If no children, return 0 or 1 depending on the side
        if (children.length == 0) {
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
        console.log("\tchild order= " + child.getOrder());        //TODO(gb): Remove trace!!!
    },

    detach:function (treeSet, node) {
        var parent = treeSet.getParent(node);
        // Filter nodes on one side..
        var children = this._getChildrenForOrder(parent, treeSet, node.getOrder());

        children.each(function (child, index) {
            if (child.getOrder() > node.getOrder()) {
                child.setOrder(child.getOrder() - 2);
            }
        });
        node.setOrder(node.getOrder() % 2 == 0 ? 0 : 1);
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

            // xOffset
            xOffset = mindplot.layout.CyclicSorter.BASE_RADIUS * vector.x;

            // yOffset
            yOffset = mindplot.layout.CyclicSorter.BASE_RADIUS * vector.y;

            // Add to offsets object
            $assert(!isNaN(xOffset), "xOffset can not be null");
            $assert(!isNaN(yOffset), "yOffset can not be null");
            offsets[node.id] = { x: xOffset, y: yOffset };
        }

        offsets[node.id] = { x: xOffset, y: yOffset };

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
        return child.getOrder() % 2 == 0 ? 1 : -1;
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
    }
});

mindplot.layout.CyclicSorter.INTERNODE_VERTICAL_PADDING = 0;
mindplot.layout.CyclicSorter.INTERNODE_HORIZONTAL_PADDING = 20;
mindplot.layout.CyclicSorter.BASE_RADIUS = 120;
