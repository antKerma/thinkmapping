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

mindplot.DesignerModel = new Class({
    Implements:[Events],
    initialize:function (options) {
        this._zoom = options.zoom;
        this._topics = [];
        this._relationships = [];
    },

    getZoom:function () {
        return this._zoom;
    },

    setZoom:function (zoom) {
        this._zoom = zoom;
    },

    getTopics:function () {
        return this._topics;
    },

    getRelationships:function () {
        return this._relationships;
    },

    getCentralTopic:function () {
        var topics = this.getTopics();
        return topics[0];
    },

    filterSelectedTopics:function () {
        var result = [];
        for (var i = 0; i < this._topics.length; i++) {
            if (this._topics[i].isOnFocus()) {
                result.push(this._topics[i]);
            }
        }
        return result;
    },

    filterSelectedRelationships:function () {
        var result = [];
        for (var i = 0; i < this._relationships.length; i++) {
            if (this._relationships[i].isOnFocus()) {
                result.push(this._relationships[i]);
            }
        }
        return result;
    },

    getEntities:function () {
        var result = [].append(this._topics);
        result.append(this._relationships);
        return result;
    },

    removeTopic:function (topic) {
        $assert(topic, "topic can not be null");
        this._topics.erase(topic);
    },

    removeRelationship:function (rel) {
        $assert(rel, "rel can not be null");
        this._relationships.erase(rel);
    },

    addTopic:function (topic) {
        $assert(topic, "topic can not be null");
        this._topics.push(topic);
    },

    addRelationship:function (rel) {
        $assert(rel, "rel can not be null");
        this._relationships.push(rel);
    },

    filterTopicsIds:function (validate, errorMsg) {
        var result = [];
        var topics = this.filterSelectedTopics();


        var isValid = true;
        for (var i = 0; i < topics.length; i++) {
            var selectedNode = topics[i];
            if ($defined(validate)) {
                isValid = validate(selectedNode);
            }

            // Add node only if it's valid.
            if (isValid) {
                result.push(selectedNode.getId());
            } else {
                $notify(errorMsg);
            }
        }
        return result;
    },
    filterSelectionUnconnected:function(){
        var topics=this.filterSelectedTopics();
        var result=[];

        if(topics==null || topics.length<2){
            return topics;
        }else{
            result=topics.slice(0);
        }

        var topicsModel = topics.map(function(a){
            return a.getModel();
        });

        for(var i=0;i<topics.length;i++){
            var matches=this._getMatchingAncestors(topics[i].getModel(),topicsModel);
            result=result.filter(function(a){
                for(var j=0;j<matches.length;j++){
                    if(matches[j].getId()== a.getId())
                        return false;
                }
                return true;
            });
        }

        return result;
    },
    _getMatchingAncestors: function(node,ancestors){
        var result=[];
        var selectedNode=node;
        while(selectedNode.getParent()!=null){
            var parent=selectedNode.getParent();
            for(var i=0;i<ancestors.length;i++) {
                if(parent.getId()==ancestors[i].getId()){
                    result.push(ancestors[i]);
                }
            }
            selectedNode = parent;
        }
        return result;

    },
    selectedTopic:function () {
        var topics = this.filterSelectedTopics();
        return (topics.length > 0) ? topics[0] : null;
    },

    findTopicById:function (id) {
        var result = null;
        for (var i = 0; i < this._topics.length; i++) {
            var topic = this._topics[i];
            if (topic.getId() == id) {
                result = topic;
                break;
            }
        }
        return result;

    }
});