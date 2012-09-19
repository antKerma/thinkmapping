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

mindplot.widget.SimplifiedTopicShape = new Class({
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
        var shapeItems = self._getElement().getElements("li");
        var model = self._getModel();
        shapeItems.each(function(elem) {
            elem.addEvent('click', function() {
                var shape = elem.get("data-shape");
                if (!elem.hasClass('shapeOn')) {
                    self.resetOn();
                    elem.addClass('shapeOn');
                    model.setValue(shape);
                }
            });
        });
    },

    updateValue : function() {
        var self = this;
        self.resetOn();
        self.setShape(this._model.getValue());
    },

    resetOn :  function() {
        var self = this;
        if (self._getElement().getElement("li.shapeOn"))
            self._getElement().getElement("li.shapeOn").removeClass('shapeOn');
    },

    setShape : function(shape) {
        if (shape) {
            var self = this;
            var selector = 'li[data-shape="'+shape+'"]';
            var colorElement = self._getElement().getElement(selector);
            if (colorElement)
                colorElement.addClass('shapeOn');
        }
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
});