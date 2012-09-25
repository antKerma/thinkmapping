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
mindplot.persistence.Beta2PelaMigrator = new Class({
    initialize:function (betaSerializer) {
        this._betaSerializer = betaSerializer;
        this._pelaSerializer = new mindplot.persistence.XMLSerializer_Pela();
    },

    toXML:function (mindmap) {
        return this._pelaSerializer.toXML(mindmap);
    },

    loadFromDom:function (dom, mapId) {
        $assert($defined(mapId), "mapId can not be null");
        var mindmap = this._betaSerializer.loadFromDom(dom, mapId);
        mindmap.setVersion(mindplot.persistence.ModelCodeName.PELA);

        // Beta does not set position on second level nodes ...
        var branches = mindmap.getBranches();
        branches.each(function (model) {
            this._fixPosition(model);
        }.bind(this));

        return mindmap;
    },

    _fixPosition:function (parentModel) {
        var parentPos = parentModel.getPosition();
        var isRight = parentPos.x > 0;
        parentModel.getChildren().each(function (child) {
            if (!child.getPosition()) {
                child.setPosition(parentPos.x + (50 * isRight ? 1 : -1), parentPos.y);
            }
            this._fixPosition(child);
        }.bind(this));
    }
});
