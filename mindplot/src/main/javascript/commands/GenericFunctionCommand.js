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

mindplot.commands.GenericFunctionCommand = new Class({
    Extends:mindplot.Command,
    initialize:function (commandFunc, topicsIds, value) {
        $assert(commandFunc, "commandFunc must be defined");
        $assert($defined(topicsIds), "topicsIds must be defined");

        this.parent();
        this._value = value;
        this._topicsId = topicsIds;
        this._commandFunc = commandFunc;
        this._oldValues = [];
    },

    execute:function (commandContext) {
        if (!this.applied) {

            // @Todo: Debug hack. Remove
            var topics;
            try {
                topics = commandContext.findTopics(this._topicsId);
            } catch (e) {
                throw new Error(e + "," + this._commandFunc + "," + this._commandFunc.desc);
            }

            topics.each(function (topic) {
                var oldValue = this._commandFunc(topic, this._value);
                this._oldValues.push(oldValue);
            }.bind(this));
            this.applied = true;
        } else {
            throw "Command can not be applied two times in a row.";
        }

    },

    undoExecute:function (commandContext) {
        if (this.applied) {
            var topics = commandContext.findTopics(this._topicsId);
            topics.each(function (topic, index) {
                this._commandFunc(topic, this._oldValues[index]);

            }.bind(this));

            this.applied = false;
            this._oldValues = [];
        } else {
            throw "undo can not be applied.";
        }
    }
});