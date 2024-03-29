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

mindplot.commands.ChangeFeatureToTopicCommand = new Class({
    Extends:mindplot.Command,
    initialize: function(topicId, featureId, attributes) {
        $assert($defined(topicId), 'topicId can not be null');
        $assert($defined(featureId), 'featureId can not be null');
        $assert($defined(attributes), 'attributes can not be null');

        this.parent();
        this._topicId = topicId;
        this._featureId = featureId;
        this._attributes = attributes;
    },

    execute: function(commandContext) {
        var topic = commandContext.findTopics(this._topicId)[0];
        var feature = topic.findFeatureById(this._featureId);

        var oldAttributes = feature.getAttributes();
        feature.setAttributes(this._attributes);
        this._attributes = oldAttributes;
    },

    undoExecute: function(commandContext) {
        this.execute(commandContext);
    }
});