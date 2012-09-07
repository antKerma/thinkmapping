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

mindplot.widget.NoteEditor = new Class({
    Extends:MooDialog,
    initialize:function (model) {
        $assert(model, "model can not be null");
        var panel = this._buildPanel(model);
        this.parent({
            closeButton:true,
            destroyOnClose:true,
            title:'Note',
            onInitialize:function (wrapper) {
                wrapper.setStyle('opacity', 0);
                this.fx = new Fx.Morph(wrapper, {
                    duration:600,
                    transition:Fx.Transitions.Bounce.easeOut
                });
            },

            onBeforeOpen:function () {
                this.overlay = new Overlay(this.options.inject, {
                    duration:this.options.duration
                });
                if (this.options.closeOnOverlayClick)
                    this.overlay.addEvent('click', this.close.bind(this));
                this.overlay.open();

                this.fx.start({
                    'margin-top':[-200, -100],
                    opacity:[0, 1]
                }).chain(function () {
                    this.fireEvent('show');
                }.bind(this));
            },

            onBeforeClose:function () {
                this.fx.start({
                    'margin-top':[-100, 0],
                    opacity:0
                }).chain(function () {
                    this.fireEvent('hide');
                }.bind(this));
                this.overlay.destroy();
            }
        });
        this.setContent(panel);
    },

    _buildPanel:function (model) {
        var result = new Element('div');
        var form = new Element('form', {'action':'none', 'id':'noteFormId'});

        // Add textarea ...
        var textArea = new Element('textarea',
            {placeholder:'Write your note here ...',
                required:true,
                autofocus:'autofocus'
            });
        if (model.getValue() != null)
            textArea.value = model.getValue();

        textArea.setStyles({
            'width':'100%',
            'height':80, resize:'none'
        });
        textArea.inject(form);

        // Register submit event ...
        form.addEvent('submit', function (event) {
            event.preventDefault();
            event.stopPropagation();
            if (textArea.value ) {
                model.setValue(textArea.value);
            }
            this.close();

        }.bind(this));

        // Add buttons ...
        var buttonContainer = new Element('div').setStyles({paddingTop:5, textAlign:'right'});

        // Create accept button ...
        var okButton = new Element('input', {type:'submit', value:'Accept', 'class':'btn-primary'});
        okButton.addClass('button');
        okButton.inject(buttonContainer);

        // Create remove button ...
        if ($defined(model.getValue())) {
            var rmButton = new Element('input', {type:'button', value:'Remove', 'class':'btn-primary'});
            rmButton.setStyle('margin', '5px');
            rmButton.addClass('button');
            rmButton.inject(buttonContainer);
            rmButton.addEvent('click', function () {
                model.setValue(null);
                this.close();
            }.bind(this));
            buttonContainer.inject(form);
        }

        // Create cancel button ...
        var cButton = new Element('input', {type:'button', value:'Cancel', 'class':'btn-secondary'});
        cButton.setStyle('margin', '5px');
        cButton.addClass('button');
        cButton.inject(buttonContainer);
        cButton.addEvent('click', function () {
            this.close();
        }.bind(this));
        buttonContainer.inject(form);

        result.addEvent('keydown', function (event) {
            event.stopPropagation();
        });

        form.inject(result);
        return result;
    },

    show:function () {
        this.open();
    }

});
