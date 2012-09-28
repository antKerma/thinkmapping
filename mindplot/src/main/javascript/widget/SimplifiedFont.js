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
    Extends:mindplot.widget.FloatingToolbarItem,

    initialize : function(buttonId, model) {
        $assert(buttonId, "buttonId can not be null");
        $assert(model, "model can not be null");

        this.parent(buttonId, model, {
            onClass : 'sizeOn',
            dataKey : 'data-size',
            elemSelector: 'li.text-size'
        });


        // on init
//        var boldItem = self._getElement().getElement("li.text-bold");
//        boldItem.addEvent('click', function() {
//            $(this).toggleClass('boldOn');
//            model.setValue('bold', null);
//        });

        // set bold
//        var self = this;
//        if (bold && bold == 'bold') {
//            self._getElement().getElement("li.text-bold").addClass('boldOn');
//        }
    }
})
