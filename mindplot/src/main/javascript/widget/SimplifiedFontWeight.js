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

mindplot.widget.SimplifiedFontWeight = new Class({
    Extends:mindplot.widget.FloatingToolbarItem,

    initialize : function(buttonId, model) {
        $assert(buttonId, "buttonId can not be null");
        $assert(model, "model can not be null");

        this.parent(buttonId, model, {
            onClass : 'boldOn',
            elemSelector: 'li.text-bold'
        });
    },

    onClick : function(elem) {
        elem.toggleClass(this.getOnClass());
        this._getModel().setValue(null);
    },

    setValue : function(value) {
        if (value) {
            var self = this;
            var selector = self.getSelector();
            var element = self._getElement().getElement(selector);
            if (element && value == 'bold')
                element.addClass(self.getOnClass());
            else if (element && value == 'normal')
                element.removeClass(self.getOnClass());
        }
    }
})
