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
mindplot.layout.RootedTreeSet = new Class({
    initialize:function () {
        this._rootNodes = [];
    },

    setRoot:function (root) {
        $assert(root, 'root can not be null');
        this._rootNodes.push(this._decodate(root));
    },

    getTreeRoots:function () {
        return this._rootNodes;
    },

    _decodate:function (node) {
        node._children = [];
        return node;
    },

    add:function (node) {
        $assert(node, 'node can not be null');
        $assert(!this.find(node.getId(), false), 'node already exits with this id. Id:' + node.getId());
        $assert(!node._children, 'node already added');
        this._rootNodes.push(this._decodate(node));
    },


    remove:function (nodeId) {
        $assert($defined(nodeId), 'nodeId can not be null');
        var node = this.find(nodeId);
        this._rootNodes.erase(node);
    },

    connect:function (parentId, childId) {
        $assert($defined(parentId), 'parent can not be null');
        $assert($defined(childId), 'child can not be null');

        var parent = this.find(parentId);
        var child = this.find(childId, true);
        $assert(!child._parent, 'node already connected. Id:' + child.getId() + ",previous:" + child._parent);

        parent._children.push(child);
        child._parent = parent;
        this._rootNodes.erase(child);
    },

    disconnect:function (nodeId) {
        $assert($defined(nodeId), 'nodeId can not be null');
        var node = this.find(nodeId);
        $assert(node._parent, "Node is not connected");

        node._parent._children.erase(node);
        this._rootNodes.push(node);
        node._parent = null;
    },

    find:function (id, validate) {
        $assert($defined(id), 'id can not be null');

        var graphs = this._rootNodes;
        var result = null;
        for (var i = 0; i < graphs.length; i++) {
            var node = graphs[i];
            result = this._find(id, node);
            if (result) {
                break;
            }
        }
        validate = !$defined(validate) ? true : validate;
        $assert(validate ? result : true, 'node could not be found id:' + id + "\n,RootedTreeSet" + this.dump());
        return result;

    },

    _find:function (id, parent) {
        if (parent.getId() == id) {
            return parent;

        }

        var result = null;
        var children = parent._children;
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            result = this._find(id, child);
            if (result)
                break;
        }

        return result;
    },

    getChildren:function (node) {
        $assert(node, 'node cannot be null');
        return node._children;
    },

    getRootNode:function (node) {
        $assert(node, "node cannot be null");
        var parent = this.getParent(node);
        if ($defined(parent)) {
            return this.getRootNode(parent);
        }

        return node;
    },

    getAncestors:function (node) {
        $assert(node, 'node cannot be null');
        return this._getAncestors(this.getParent(node), []);
    },

    _getAncestors:function (node, ancestors) {
        var result = ancestors;
        if (node) {
            result.push(node);
            this._getAncestors(this.getParent(node), result);
        }
        return result;
    },

    getSiblings:function (node) {
        $assert(node, 'node cannot be null');
        if (!$defined(node._parent)) {
            return [];
        }
        var siblings = node._parent._children.filter(function (child) {
            return child != node;
        });
        return siblings;
    },

    hasSinglePathToSingleLeaf:function (node) {
        $assert(node, 'node cannot be null');
        return this._hasSinglePathToSingleLeaf(node);
    },

    _hasSinglePathToSingleLeaf:function (node) {
        var children = this.getChildren(node);

        if (children.length == 1) {
            return this._hasSinglePathToSingleLeaf(children[0]);
        }

        return children.length == 0;
    },

    isStartOfSubBranch:function (node) {
        return this.getSiblings(node).length > 0 && this.getChildren(node).length == 1;
    },

    isLeaf:function (node) {
        $assert(node, 'node cannot be null');
        return this.getChildren(node).length == 0;
    },

    getParent:function (node) {
        $assert(node, 'node cannot be null');
        return node._parent;
    },

    dump:function () {
        var branches = this._rootNodes;
        var result = "";
        for (var i = 0; i < branches.length; i++) {
            var branch = branches[i];
            result += this._dump(branch, "");
        }
        return result;
    },

    _dump:function (node, indent) {
        var result = indent + node + "\n";
        var children = this.getChildren(node);
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            result += this._dump(child, indent + "   ");
        }

        return result;
    },

    plot:function (canvas) {
        var branches = this._rootNodes;
        for (var i = 0; i < branches.length; i++) {
            var branch = branches[i];
            this._plot(canvas, branch);
        }
    },

    _plot:function (canvas, node, root) {
        var children = this.getChildren(node);
        var cx = node.getPosition().x + canvas.width / 2 - node.getSize().width / 2;
        var cy = node.getPosition().y + canvas.height / 2 - node.getSize().height / 2;
        var rect = canvas.rect(cx, cy, node.getSize().width, node.getSize().height);
        var order = node.getOrder() == null ? "r" : node.getOrder();
        var text = canvas.text(node.getPosition().x + canvas.width / 2, node.getPosition().y + canvas.height / 2, node.getId() + "[" + order + "]");
        text.attr('fill', '#FFF');
        var fillColor = this._rootNodes.contains(node) ? "#000" : (node.isFree() ? "#abc" : "#c00");
        rect.attr('fill', fillColor);

        var rectPosition = {x:rect.attr("x") - canvas.width / 2 + rect.attr("width") / 2, y:rect.attr("y") - canvas.height / 2 + rect.attr("height") / 2};
        var rectSize = {width:rect.attr("width"), height:rect.attr("height")};
        rect.click(function () {
            console.log("[id:" + node.getId() + ", order:" + node.getOrder() + ", position:(" + rectPosition.x + "," + rectPosition.y + "), size:" + rectSize.width + "x" + rectSize.height + ", freeDisplacement:(" + node.getFreeDisplacement().x + "," + node.getFreeDisplacement().y + ")]");
        });
        text.click(function () {
            console.log("[id:" + node.getId() + ", order:" + node.getOrder() + ", position:(" + rectPosition.x + "," + rectPosition.y + "), size:" + rectSize.width + "x" + rectSize.height + ", freeDisplacement:(" + node.getFreeDisplacement().x + "," + node.getFreeDisplacement().y + ")]");
        });

        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            this._plot(canvas, child);
        }
    },

    updateBranchPosition:function (node, position) {

        var oldPos = node.getPosition();
        node.setPosition(position);

        var xOffset = oldPos.x - position.x;
        var yOffset = oldPos.y - position.y;

        var children = this.getChildren(node);
        children.each(function (child) {
            this.shiftBranchPosition(child, xOffset, yOffset);
        }.bind(this));

    },

    shiftBranchPosition:function (node, xOffset, yOffset) {
        var position = node.getPosition();
        node.setPosition({x:position.x + xOffset, y:position.y + yOffset});

        var children = this.getChildren(node);
        children.each(function (child) {
            this.shiftBranchPosition(child, xOffset, yOffset);
        }.bind(this));
    },

    getSiblingsInVerticalDirection:function (node, yOffset) {
        // siblings with lower or higher order, depending on the direction of the offset and on the same side as their parent
        var parent = this.getParent(node);
        var siblings = this.getSiblings(node).filter(function (sibling) {
            var sameSide = node.getPosition().x > parent.getPosition().x ? sibling.getPosition().x > parent.getPosition().x : sibling.getPosition().x < parent.getPosition().x;
            var orderOK = yOffset < 0 ? sibling.getOrder() < node.getOrder() : sibling.getOrder() > node.getOrder();
            return orderOK && sameSide;
        });

        if (yOffset < 0) {
            siblings.reverse();
        }

        return siblings;
    },

    getBranchesInVerticalDirection:function (node, yOffset) {
        // direct descendants of the root that do not contain the node and are on the same side
        // and on the direction of the offset
        var rootNode = this.getRootNode(node);
        var branches = this.getChildren(rootNode).filter(function (child) {
            return this._find(node.getId(), child);
        }, this);

        var branch = branches[0];
        var rootDescendants = this.getSiblings(branch).filter(function (sibling) {
            var sameSide = node.getPosition().x > rootNode.getPosition().x ? sibling.getPosition().x > rootNode.getPosition().x : sibling.getPosition().x < rootNode.getPosition().x;
            var sameDirection = yOffset < 0 ? sibling.getOrder() < branch.getOrder() : sibling.getOrder() > branch.getOrder();
            return sameSide && sameDirection;
        }, this);

        return rootDescendants;
    }

});

