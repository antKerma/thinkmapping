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

web2d.Image = new Class({
    Extends: web2d.Element,
    initialize : function(attributes) {
        var peer = web2d.peer.Toolkit.createImage();
        this.parent(peer, attributes);
    },

    getType : function() {
        return "Image";
    },

    setHref : function(href) {
        this._peer.setHref(href);
    },

    getHref : function() {
        return this._peer.getHref();
    },

    getSize : function() {
        return this._peer.getSize();
    }
});