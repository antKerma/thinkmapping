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

mindplot.widget.FloatingToolbarItem = new Class({
    Extends:mindplot.widget.ToolbarItem,
    initialize : function (buttonId, model, options) {
        $assert(buttonId, "buttonId can not be null");
        $assert(model, "model can not be null");

        this._model = model;
        this._element = $(buttonId);
        var fn = function() { ; }.bind(this);

        this.parent(buttonId, fn, Object.merge({topicAction:true,relAction:false}, options));
        this._panelElem = this._init();
    },

    _init : function() {
        var self = this;

        // show
        self._getElement().addEvent('openPanel', function() {
            self.onPanelOpen();
        });

        // click
        var items = self._getElement().getElements(self.getSelector());
        items.each(function(elem) {
            elem.addEvent('click', function() {
                self.onClick(elem);
            });
        });
    },

    onClick : function(elem) {
        var self = this;
        var value = elem.get(self.getDataKey());
        if (!elem.hasClass(self.getOnClass())) {
            self.resetOn();
            elem.addClass(self.getOnClass());
            self._getModel().setValue(value);
        }
    },

    onPanelOpen : function() {
        var self = this;
        self.resetOn();
        self.setValue(this._model.getValue());
    },

    resetOn :  function() {
        var self = this;
        if (self._getElement().getElement(self.getSelector() + "." + self.getOnClass()))
            self._getElement().getElement(self.getSelector() + "." + self.getOnClass()).removeClass(self.getOnClass());
    },

    setValue : function(value) {
        if (value) {
            var self = this;
            var selector = self.getSelector() + '[' + this.getDataKey() + '="'+value+'"]';
            var element = self._getElement().getElement(selector);
            if (element)
                element.addClass(self.getOnClass());
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
    },

    getOnClass : function() {
        return this._options.onClass;
    },

    getDataKey : function() {
        return this._options.dataKey;
    },

    getSelector : function() {
        return this._options.elemSelector;
    }
});