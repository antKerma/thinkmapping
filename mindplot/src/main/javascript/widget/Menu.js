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

mindplot.widget.Menu = new Class({
    Extends:mindplot.widget.IMenu,

    initialize:function (designer, containerId, mapId, readOnly, baseUrl) {
        var self = this;
        this.parent(designer, containerId, mapId);

        baseUrl = !$defined(baseUrl) ? "" : baseUrl;
        var widgetsBaseUrl = baseUrl + "css/widget";

        // Stop event propagation ...
        $(this._containerId).addEvent('click', function (event) {
            event.stopPropagation();
            return false;
        });

        $(this._containerId).addEvent('dblclick', function (event) {
            event.stopPropagation();
            return false;
        });

        // Create panels ...
        var designerModel = designer.getModel();

        var fontFamilyBtn = $('fontFamily');
        if (fontFamilyBtn) {
            var fontFamilyModel = {
                getValue:function () {
                    var nodes = designerModel.filterSelectedTopics();
                    var result = null;
                    for (var i = 0; i < nodes.length; i++) {
                        var fontFamily = nodes[i].getFontFamily();
                        if (result != null && result != fontFamily) {
                            result = null;
                            break;
                        }
                        result = fontFamily;
                    }
                    return result;
                },

                setValue:function (value) {
                    designer.changeFontFamily(value);

                }
            };
            this._toolbarElems.push(new mindplot.widget.FontFamilyPanel("fontFamily", fontFamilyModel));
            this._registerTooltip('fontFamily', $msg('FONT_FAMILY'));
        }

        var fontBtn = $('font');
        if (fontBtn) {
            var fontSizeModel = {
                getValue:function () {
                    var nodes = designerModel.filterSelectedTopics();
                    var size = null, sizeBreak = false;

                    for (var i = 0; i < nodes.length; i++) {
                        var fontSize = sizeBreak ? null : nodes[i].getFontSize();      // size
                        if (size != null && size != fontSize) {
                            size = null;
                            sizeBreak = true;
                        }
                        size = fontSize;
                    }

                    return size;
                },
                setValue:function (value) {
                    designer.changeFontSize(value);
                }
            };

            var fontBoldModel = {
                getValue:function () {
                    var nodes = designerModel.filterSelectedTopics();
                    var bold = null, boldBreak = false;

                    for (var i = 0; i < nodes.length; i++) {
                        var fontBold = boldBreak ? null : nodes[i].getFontWeight();    // bold
                        if (bold != null && bold != fontBold) {
                            bold = null;
                            boldBreak = true;
                        }
                        bold = fontBold
                    }

                    return bold;
                },
                setValue:function (value) {
                    designer.changeFontWeight();
                }
            };

            var fontItalicModel = {
                getValue:function () {
                    var nodes = designerModel.filterSelectedTopics();
                    var italic = null, italicBreak = false;

                    for (var i = 0; i < nodes.length; i++) {
                        var fontItalic = italicBreak ? null : nodes[i].getFontStyle();    // italic
                        if (italic != null && italic != fontItalic) {
                            italic = null;
                            italicBreak = true;
                        }
                        italic = fontItalic
                    }

                    return italic;
                },
                setValue:function (value) {
                    designer.changeFontStyle();
                }
            };

            this._toolbarElems.push(new mindplot.widget.SimplifiedFont("font", fontSizeModel));
            this._toolbarElems.push(new mindplot.widget.SimplifiedFontWeight("font", fontBoldModel));
            this._toolbarElems.push(new mindplot.widget.SimplifiedFontItalic("font", fontItalicModel));
        }

        var topicShapeBtn = $('topicShape');
        if (topicShapeBtn) {
            var topicShapeModel = {
                getValue:function () {
                    var nodes = designerModel.filterSelectedTopics();
                    var result = null;
                    for (var i = 0; i < nodes.length; i++) {
                        var shapeType = nodes[i].getShapeType();
                        if (result != null && result != shapeType) {
                            result = null;
                            break;
                        }
                        result = shapeType;
                    }
                    return result;
                },
                setValue:function (value) {
                    designer.changeTopicShape(value);
                }
            };
            this._toolbarElems.push(new mindplot.widget.SimplifiedTopicShape("topicShape", topicShapeModel));
        }

        var topicIconBtn = $('topicIcon');
        if (topicIconBtn) {
            // Create icon panel dialog ...
            var topicIconModel = {
                getValue:function () {
                    return null;
                },
                setValue:function (value) {
                    designer.addIconType(value);
                }
            };
            this._toolbarElems.push(new mindplot.widget.IconPanel('topicIcon', topicIconModel));
            this._registerTooltip('topicIcon', $msg('TOPIC_ICON'));
        }

        // Topic color item ...
        var topicColorBtn = $('topicColor');
        if (topicColorBtn) {

            var topicColorModel = {
                getValue:function () {
                    var nodes = designerModel.filterSelectedTopics();
                    var result = null;
                    for (var i = 0; i < nodes.length; i++) {
                        var color = nodes[i].getBackgroundColor();
                        if (result != null && result != color) {
                            result = null;
                            break;
                        }
                        result = color;
                    }
                    return result;
                },
                setValue:function (hex) {
                    designer.changeBackgroundColor(hex);
                    designer.changeBorderColor(self._changeColor(hex, 0.2, true));
                }
            };
            this._toolbarElems.push(new mindplot.widget.SimplifiedColorPalette('topicColor', topicColorModel));
        }

        // Border color item ...
        var topicBorderBtn = $('topicBorder');
        if (topicBorderBtn) {
            var borderColorModel =
            {
                getValue:function () {
                    var nodes = designerModel.filterSelectedTopics();
                    var result = null;
                    for (var i = 0; i < nodes.length; i++) {
                        var color = nodes[i].getBorderColor();
                        if (result != null && result != color) {
                            result = null;
                            break;
                        }
                        result = color;
                    }
                    return result;
                },
                setValue:function (hex) {
                    designer.changeBorderColor(hex);
                }
            };
            this._toolbarElems.push(new mindplot.widget.ColorPalettePanel('topicBorder', borderColorModel, widgetsBaseUrl));
            this._registerTooltip('topicBorder', $msg('TOPIC_BORDER_COLOR'));
        }

        // Font color item ...
        var fontColorBtn = $('fontColor');
        if (fontColorBtn) {
            var fontColorModel =
            {
                getValue:function () {
                    var result = null;
                    var nodes = designerModel.filterSelectedTopics();
                    for (var i = 0; i < nodes.length; i++) {
                        var color = nodes[i].getFontColor();
                        if (result != null && result != color) {
                            result = null;
                            break;
                        }
                        result = color;
                    }
                    return result;
                },
                setValue:function (hex) {
                    designer.changeFontColor(hex);
                }
            };
            this._toolbarElems.push(new mindplot.widget.SimplifiedColorPalette('fontColor', fontColorModel));
        }

        this._addButton('export', false, false, function () {
            var reqDialog = new MooDialog.Request('c/iframeWrapper.htm?url=c/maps/' + mapId + "/exportf", null,
                {'class':'modalDialog exportModalDialog',
                    closeButton:true,
                    destroyOnClose:true,
                    title:$msg('EXPORT')
                });
            reqDialog.setRequestOptions({
                onRequest:function () {
                    reqDialog.setContent($msg('LOADING'));
                }
            });
            MooDialog.Request.active = reqDialog;
        });

        this._addButton('print', false, false, function () {
            var baseUrl = window.location.href.substring(0, window.location.href.lastIndexOf("c/maps/"));
            var win = window.open(baseUrl + 'c/maps/' + mapId + '/print');
        });

        this._addButton('zoomIn', false, false, function () {
            designer.zoomIn();
        });
        this._registerTooltip('zoomIn', $msg('ZOOM_IN'));

        this._addButton('zoomOut', false, false, function () {
            designer.zoomOut();
        });
        this._registerTooltip('zoomOut', $msg('ZOOM_OUT'));


        var undoButton = this._addButton('undoEdition', false, false, function () {
            designer.undo();
        });
        if (undoButton) {
            undoButton.disable();
        }

        var redoButton = this._addButton('redoEdition', false, false, function () {
            designer.redo();
        });
        if (redoButton) {
            redoButton.disable();
        }

        if (redoButton && undoButton) {
            designer.addEvent('modelUpdate', function (event) {
                if (event.undoSteps > 0) {
                    undoButton.enable();
                } else {
                    undoButton.disable();
                }
                if (event.redoSteps > 0) {
                    redoButton.enable();
                } else {
                    redoButton.disable();
                }

            }.bind(this));
        }

        this._addButton('copySelection', true, false, function () {
            designer.copyToClipboard();
        });

        this._addButton('pasteSelection', true, false, function () {
            designer.pasteClipboard();
        });

        this._addButton('addTopic', true, false, function () {
            designer.createChildForSelectedNode();
        });

        this._addButton('editTopic', true, false, function() {
            var nodes = designerModel.filterSelectedTopics();
            var topic = nodes[nodes.length-1];
            topic.showTextEditor(topic.getText());
        });

        this._addButton('addRelationship', true, false, function (event) {
            designer.showRelPivot(event);
        });

        this._addButton('deleteTopic', true, true, function () {
            designer.deleteSelectedEntities();
        });

        this._addButton('topicLink', true, false, function () {
            designer.addLink();
        });
        this._registerTooltip('topicLink', $msg('TOPIC_LINK'));


        this._addButton('topicRelation', true, false, function (event) {
            designer.showRelPivot(event);
        });
        this._registerTooltip('topicRelation', $msg('TOPIC_RELATIONSHIP'));


        this._addButton('topicNote', true, false, function () {
            designer.addNote();
        });
        this._registerTooltip('topicNote', $msg('TOPIC_NOTE'));

        var saveElem = $('save');
        if (saveElem) {
            this._addButton('save', false, false, function () {
                this.save(saveElem, designer, true);
            }.bind(this));


            if (!readOnly) {
                // To prevent the user from leaving the page with changes ...
                $(window).addEvent('beforeunload', function () {
                    if (this.isSaveRequired()) {
                        this.save(saveElem, designer, false);
                    }
                }.bind(this));

                // Autosave on a fixed period of time ...
                (function () {
                    if (this.isSaveRequired()) {
                        this.save(saveElem, designer, false);
                    }
                }.bind(this)).periodical(30000);
            }
        }

        var discardElem = $('discard');
        if (discardElem) {
            this._addButton('discard', false, false, function () {
                this.discardChanges();
            }.bind(this));
            this._registerTooltip('discard', $msg('DISCARD_CHANGES'));
        }

        var tagElem = $('tagIt');
        if (tagElem) {
            this._addButton('tagIt', false, false, function () {
                var reqDialog = new MooDialog.Request('c/tags?mapId=' + mapId, null,
                    {'class':'modalDialog tagItModalDialog',
                        closeButton:true,
                        destroyOnClose:true,
                        title:'Tags'
                    });
                reqDialog.setRequestOptions({
                    onRequest:function () {
                        reqDialog.setContent($msg('LOADING'));
                    }
                });
            });
            this._registerTooltip('tagIt', "Tag");
        }

        var shareElem = $('shareIt');
        if (shareElem) {
            this._addButton('shareIt', false, false, function () {
                var reqDialog = new MooDialog.Request('c/iframeWrapper?url=c/maps/' + mapId + "/sharef", null,
                    {'class':'modalDialog shareModalDialog',
                        closeButton:true,
                        destroyOnClose:true,
                        title:$msg('COLLABORATE')
                    });
                reqDialog.setRequestOptions({
                    onRequest:function () {
                        reqDialog.setContent($msg('LOADING'));
                    }
                });
                MooDialog.Request.active = reqDialog;
            });
            this._registerTooltip('shareIt', $msg('COLLABORATE'));

        }

        var publishElem = $('publishIt');
        if (publishElem) {
            this._addButton('publishIt', false, false, function () {
                var reqDialog = new MooDialog.Request('c/iframeWrapper?url=c/maps/' + mapId + "/publishf", null,
                    {'class':'modalDialog publishModalDialog',
                        closeButton:true,
                        destroyOnClose:true,
                        title:$msg('PUBLISH')
                    });
                reqDialog.setRequestOptions({
                    onRequest:function () {
                        reqDialog.setContent($msg('LOADING'));
                    }
                });
                MooDialog.Request.active = reqDialog;

            });
        }

        var saveasElem = $('saveAs');
        if (saveasElem) {
            this._addButton('saveAs', false, false, function () {
                var reqDialog = new MooDialog.Request('c/iframeWrapper?url=c/maps/' + mapId + "/saveas", null,
                    {'class':'modalDialog saveAsModalDialog',
                        closeButton:true,
                        destroyOnClose:true,
                        title:$msg('TOOLBAR_SAVE_AS')
                    });
                reqDialog.setRequestOptions({
                    onRequest:function () {
                        reqDialog.setContent($msg('LOADING'));
                    }
                });
                MooDialog.Request.active = reqDialog;

            });
        }

        var historyElem = $('history');
        if (historyElem) {

            this._addButton('history', false, false, function () {
                var reqDialog = new MooDialog.Request('c/iframeWrapper?url=c/maps/' + mapId + "/historyf", null,
                    {'class':'modalDialog historyModalDialog',
                        closeButton:true,
                        destroyOnClose:true,
                        title:$msg('HISTORY')
                    });
                reqDialog.setRequestOptions({
                    onRequest:function () {
                        reqDialog.setContent($msg('LOADING'));
                    }
                });
            });
            this._registerTooltip('history', $msg('HISTORY'));
        }

        this._registerEvents(designer);

        // Keyboard Shortcuts Action ...
        var keyboardShortcut = $('keyboardShortcuts');
        if (keyboardShortcut) {

            keyboardShortcut.addEvent('click', function (event) {
                var reqDialog = new MooDialog.Request('c/keyboard', null,
                    {'class':'modalDialog keyboardModalDialog',
                        closeButton:true,
                        destroyOnClose:true,
                        title:$msg('SHORTCUTS')
                    });
                reqDialog.setRequestOptions({
                    onRequest:function () {
                        reqDialog.setContent($msg('LOADING'));
                    }
                });
                MooDialog.Request.active = reqDialog;
                event.preventDefault();
            });
        }

    },

    _registerEvents:function (designer) {

        // Register on close events ...
        this._toolbarElems.each(function (elem) {
            elem.addEvent('show', function () {
                this.clear()
            }.bind(this));
        }.bind(this));

        designer.addEvent('onblur', function () {
            var topics = designer.getModel().filterSelectedTopics();
            var rels = designer.getModel().filterSelectedRelationships();

            this._toolbarElems.each(function (button) {
                var isTopicAction = button.isTopicAction();
                var isRelAction = button.isRelAction();

                if (isTopicAction || isRelAction) {
                    if ((isTopicAction && topics.length != 0) || (isRelAction && rels.length != 0)) {
                        button.enable();
                    } else {
                        button.disable();
                    }
                }
            })
        }.bind(this));

        designer.addEvent('onfocus', function () {
            var topics = designer.getModel().filterSelectedTopics();
            var rels = designer.getModel().filterSelectedRelationships();

            this._toolbarElems.each(function (button) {
                var isTopicAction = button.isTopicAction();
                var isRelAction = button.isRelAction();

                if (isTopicAction || isRelAction) {

                    if (isTopicAction && topics.length > 0) {
                        button.enable();
                    }

                    if (isRelAction && rels.length > 0) {
                        button.enable();
                    }
                }
            })
        }.bind(this));
    },

    _addButton:function (buttonId, topic, rel, fn) {
        // Register Events ...
        var result = null;
        if ($(buttonId)) {

            var button = new mindplot.widget.ToolbarItem(buttonId, function (event) {
                fn(event);
                this.clear();
            }.bind(this), {topicAction:topic, relAction:rel});

            this._toolbarElems.push(button);
            result = button;
        }
        return result;
    },

    _registerTooltip:function (buttonId, text, shortcut) {
        if ($(buttonId)) {
            var tooltip = text;
            if (shortcut) {
                shortcut = Browser.Platform.mac ? shortcut.replace("meta+", "⌘") : shortcut.replace("meta+", "ctrl+");
                tooltip = tooltip + " (" + shortcut + ")";
            }
            new mindplot.widget.KeyboardShortcutTooltip($(buttonId), tooltip);
        }
    },

    _pad : function(num, totalChars) {
        var pad = '0';
        num = num + '';
        while (num.length < totalChars) {
            num = pad + num;
        }
        return num;
    },

    _changeColor : function(color, ratio, darker) {
        // Trim trailing/leading whitespace
        color = color.replace(/^\s*|\s*$/, '');

        // Expand three-digit hex
        color = color.replace(
            /^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i,
            '#$1$1$2$2$3$3'
        );

        // Calculate ratio
        var difference = Math.round(ratio * 256) * (darker ? -1 : 1),
        // Determine if input is RGB(A)
            rgb = color.match(new RegExp('^rgba?\\(\\s*' +
                '(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
                '\\s*,\\s*' +
                '(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
                '\\s*,\\s*' +
                '(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
                '(?:\\s*,\\s*' +
                '(0|1|0?\\.\\d+))?' +
                '\\s*\\)$'
                , 'i')),
            alpha = !!rgb && rgb[4] != null ? rgb[4] : null,

        // Convert hex to decimal
            decimal = !!rgb? [rgb[1], rgb[2], rgb[3]] : color.replace(
                /^#?([a-f0-9][a-f0-9])([a-f0-9][a-f0-9])([a-f0-9][a-f0-9])/i,
                function() {
                    return parseInt(arguments[1], 16) + ',' +
                        parseInt(arguments[2], 16) + ',' +
                        parseInt(arguments[3], 16);
                }
            ).split(/,/),
            returnValue;

        // Return RGB(A)
        return !!rgb ?
            'rgb' + (alpha !== null ? 'a' : '') + '(' +
                Math[darker ? 'max' : 'min'](
                    parseInt(decimal[0], 10) + difference, darker ? 0 : 255
                ) + ', ' +
                Math[darker ? 'max' : 'min'](
                    parseInt(decimal[1], 10) + difference, darker ? 0 : 255
                ) + ', ' +
                Math[darker ? 'max' : 'min'](
                    parseInt(decimal[2], 10) + difference, darker ? 0 : 255
                ) +
                (alpha !== null ? ', ' + alpha : '') +
                ')' :
            // Return hex
            [
                '#',
                this._pad(Math[darker ? 'max' : 'min'](
                    parseInt(decimal[0], 10) + difference, darker ? 0 : 255
                ).toString(16), 2),
                this._pad(Math[darker ? 'max' : 'min'](
                    parseInt(decimal[1], 10) + difference, darker ? 0 : 255
                ).toString(16), 2),
                this._pad(Math[darker ? 'max' : 'min'](
                    parseInt(decimal[2], 10) + difference, darker ? 0 : 255
                ).toString(16), 2)
            ].join('');
    }

});