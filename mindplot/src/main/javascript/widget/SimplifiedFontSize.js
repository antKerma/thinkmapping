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

mindplot.widget.SimplifiedFontSize = new Class({
    Extends:mindplot.widget.ToolbarItem,

    initialize : function (buttonId, model) {
        $assert(buttonId, "buttonId can not be null");
        $assert(model, "model can not be null");

        this._model = model;
        this._element = $(buttonId);
        var fn = function() { ; }.bind(this);


        this.parent(buttonId, fn, {topicAction:true,relAction:false});
        this._panelElem = this._init();
    },

    _init : function() {
        var self = this;

        // show
        self._getElement().addEvent('openPanel', function() {
            self.updateValue();
        });

        // click
        var sizeItems = self._getElement().getElements("li.text-size");
        self._currentItem = self._getElement().getElement("li[class='text-size sizeOn']");
        var model = self._getModel();
        sizeItems.each(function(elem) {
            elem.addEvent('click', function() {
                var size = elem.get("data-size");
                if (!elem.hasClass('colorOn')) {
                    self._currentItem.removeClass('sizeOn');
                    self._currentItem = elem;
                    elem.addClass('sizeOn');
                    model.setValue(size);
                }
            });
        });
    },

    updateValue : function() {
        var self = this;
        var size = this._model.getValue();
        self._getElement().getElement("li[class='text-size sizeOn']").removeClass('sizeOn');
        var sizeElement = self._getElement().getElement("li[data-size='"+size+"']");
        sizeElement.addClass('sizeOn');
    },

    isVisible : function() {
        return true;
    },

    _getModel : function() {
        return this._model;
    },

    _getElement : function() {
        return this._element;
    }
})
