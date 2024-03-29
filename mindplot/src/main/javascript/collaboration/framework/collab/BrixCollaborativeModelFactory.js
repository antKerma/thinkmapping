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

mindplot.collaboration.framework.brix.BrixCollaborativeModelFactory = new Class({
    Extends:mindplot.collaboration.framework.AbstractCollaborativeModelFactory,
    initialize:function(brixFramework) {
        $assert(brixFramework, 'brixFramework can not be null');
        this._brixFramework = brixFramework;
    },

    createNewMindmap : function() {
        var mindmap = new mindplot.collaboration.framework.brix.model.Mindmap(this._brixFramework);
        var node = mindmap.createNode(mindplot.model.INodeModel.CENTRAL_TOPIC_TYPE, 0);
        mindmap.setVersion('pela-brix');
        mindmap.addBranch(node);
        return mindmap;
    },

    buildMindmap : function(model) {
        return new mindplot.collaboration.framework.brix.model.Mindmap(this._brixFramework, model);
    }
});