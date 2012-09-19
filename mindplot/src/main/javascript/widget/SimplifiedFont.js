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

mindplot.widget.SimplifiedFont = new Class({
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
        var model = self._getModel();

        // show
        self._getElement().addEvent('openPanel', function() {
            self.updateValue();
        });

        // click
        var sizeItems = self._getElement().getElements("li.text-size");

        sizeItems.each(function(elem) {
            elem.addEvent('click', function() {
                self.resetSize();
                var size = elem.get("data-size");
                if (!elem.hasClass('sizeOn')) {
                    elem.addClass('sizeOn');
                    model.setValue('size', size);
                }
            });
        });

        // bold
        var boldItem = self._getElement().getElement("li.text-bold");
        boldItem.addEvent('click', function() {
            $(this).toggleClass('boldOn');
            model.setValue('bold', null);
        });

        // italics
        var boldItem = self._getElement().getElement("li.text-italic");
        boldItem.addEvent('click', function() {
            $(this).toggleClass('italicOn');
            model.setValue('italic', null);
        });
    },

    updateValue : function() {
        var self = this;
        self.resetSize();
        self.resetStyle();
        self.setSize(this._model.getValue().size);
        self.setBold(this._model.getValue().bold);
        self.setItalic(this._model.getValue().italic);
    },

    resetSize :  function() {
        var self = this;
        if (self._getElement().getElement("li.sizeOn"))
            self._getElement().getElement("li.sizeOn").removeClass('sizeOn');
    },

    resetStyle : function() {
        var self = this;
        if (self._getElement().getElement("li.boldOn"))
            self._getElement().getElement("li.boldOn").removeClass('boldOn');
        if (self._getElement().getElement("li.italicOn"))
            self._getElement().getElement("li.italicOn").removeClass('italicOn');
    },

    setSize : function(size) {
        var self = this;
        if (size) {
            var selector = 'li[data-size="'+size+'"]';
            var sizeElement = self._getElement().getElement(selector);
            if (sizeElement)
                sizeElement.addClass('sizeOn');
        }
    },

    setBold : function(bold) {
        var self = this;
        if (bold && bold == 'bold') {
            self._getElement().getElement("li.text-bold").addClass('boldOn');
        }
    },

    setItalic : function(italic) {
        var self = this;
        if (italic && italic == 'italic') {
            self._getElement().getElement("li.text-italic").addClass('italicOn');
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
})
