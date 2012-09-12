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

package com.wisemapping.exporter;


import com.wisemapping.importer.freemind.FreemindIconConverter;
import com.wisemapping.model.Mindmap;
import com.wisemapping.model.ShapeStyle;
import com.wisemapping.util.JAXBUtils;
import com.wisemapping.jaxb.freemind.*;
import com.wisemapping.jaxb.wisemap.RelationshipType;
import com.wisemapping.jaxb.wisemap.TopicType;
import com.wisemapping.jaxb.wisemap.Icon;
import org.jetbrains.annotations.NotNull;

import javax.xml.bind.JAXBException;
import java.io.OutputStream;
import java.io.ByteArrayInputStream;
import java.math.BigInteger;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class FreemindExporter
        implements Exporter {

    private static final String FREE_MIND_VERSION = "0.9.0";
    private static final String POSITION_LEFT = "left";
    private static final String POSITION_RIGHT = "right";
    private com.wisemapping.jaxb.freemind.ObjectFactory objectFactory;
    private static final String EMPTY_FONT_STYLE = ";;;;;";

    private Map<String, Node> nodesMap = null;

    public void export(Mindmap map, OutputStream outputStream) throws ExportException {
        export(map.getXml(), outputStream);
    }

    public void export(byte[] xml, @NotNull OutputStream outputStream) throws ExportException {

        objectFactory = new com.wisemapping.jaxb.freemind.ObjectFactory();
        nodesMap = new HashMap<String, Node>();
        final com.wisemapping.jaxb.wisemap.Map mindmapMap;

        try {
            final ByteArrayInputStream stream = new ByteArrayInputStream(xml);
            mindmapMap = (com.wisemapping.jaxb.wisemap.Map) JAXBUtils.getMapObject(stream, "com.wisemapping.jaxb.wisemap");

            final com.wisemapping.jaxb.freemind.Map freemindMap = objectFactory.createMap();
            freemindMap.setVersion(FREE_MIND_VERSION);


            final List<TopicType> topics = mindmapMap.getTopic();

            // Isolated Topic does not exist in Freemind only take the center topic
            TopicType centerTopic = null;
            if (topics.size() > 1) {
                for (TopicType topic : topics) {
                    if (topic.isCentral() != null && topic.isCentral()) {
                        centerTopic = topic;
                        break;
                    }
                }
            } else {
                centerTopic = topics.get(0);
            }

            final Node main = objectFactory.createNode();
            freemindMap.setNode(main);
            if (centerTopic != null) {
                nodesMap.put(centerTopic.getId(), main);
                setTopicPropertiesToNode(main, centerTopic, true);
                addNodeFromTopic(centerTopic, main);
            }
            List<RelationshipType> relationships = mindmapMap.getRelationship();
            for (RelationshipType relationship : relationships) {
                Node srcNode = nodesMap.get(relationship.getSrcTopicId());
                Node dstNode = nodesMap.get(relationship.getDestTopicId());


                // Workaround for nodes without relationship associated ...
                if (srcNode != null && dstNode != null) {

                    Arrowlink arrowlink = objectFactory.createArrowlink();

                    arrowlink.setDESTINATION(dstNode.getID());
                    if (relationship.isEndArrow() != null && relationship.isEndArrow())
                        arrowlink.setENDARROW("Default");

                    if (relationship.isStartArrow() != null && relationship.isStartArrow())
                        arrowlink.setSTARTARROW("Default");

                    List<Object> cloudOrEdge = srcNode.getArrowlinkOrCloudOrEdge();
                    cloudOrEdge.add(arrowlink);
                }
            }

            JAXBUtils.saveMap(freemindMap, outputStream);
        } catch (JAXBException e) {
            throw new ExportException(e);
        }
    }

    private void addNodeFromTopic(@NotNull final TopicType mainTopic, @NotNull final Node destNode) {
        final List<TopicType> currentTopic = mainTopic.getTopic();

        for (TopicType topicType : currentTopic) {
            final Node newNode = objectFactory.createNode();
            nodesMap.put(topicType.getId(), newNode);
            setTopicPropertiesToNode(newNode, topicType, false);
            destNode.getArrowlinkOrCloudOrEdge().add(newNode);
            addNodeFromTopic(topicType, newNode);
            final String position = topicType.getPosition();
            if (position != null) {
                String xPos = position.split(",")[0];
                int x = Integer.valueOf(xPos);
                newNode.setPOSITION((x < 0 ? POSITION_LEFT : POSITION_RIGHT));
            }
        }
    }

    private void setTopicPropertiesToNode(@NotNull com.wisemapping.jaxb.freemind.Node freemindNode, @NotNull com.wisemapping.jaxb.wisemap.TopicType mindmapTopic, boolean isRoot) {
        freemindNode.setID("ID_" + mindmapTopic.getId());

        String text = mindmapTopic.getTextAttr();
        if (text == null || text.isEmpty()) {
            text = mindmapTopic.getText();
        }
        freemindNode.setTEXT(text);
        freemindNode.setBACKGROUNDCOLOR(mindmapTopic.getBgColor());

        final String shape = mindmapTopic.getShape();
        if (shape != null && !shape.isEmpty()) {
            if (isRoot && !ShapeStyle.ROUNDED_RECTANGLE.getStyle().endsWith(shape) || !isRoot && !ShapeStyle.LINE.getStyle().endsWith(shape)) {

                String style = shape;
                if (ShapeStyle.ROUNDED_RECTANGLE.getStyle().equals(shape)) {
                    style = "bubble";
                }
                freemindNode.setSTYLE(style);
            }
            addIconNode(freemindNode, mindmapTopic);
            addLinkNode(freemindNode, mindmapTopic);
            addFontNode(freemindNode, mindmapTopic);
            addEdgeNode(freemindNode, mindmapTopic);
            addNote(freemindNode, mindmapTopic);

            Boolean shrink = mindmapTopic.isShrink();
            if (shrink != null && shrink)
                freemindNode.setFOLDED(String.valueOf(shrink));
        }
    }

    private void addNote(com.wisemapping.jaxb.freemind.Node freemindNode, com.wisemapping.jaxb.wisemap.TopicType mindmapTopic) {
        if (mindmapTopic.getNote() != null) {
            final Hook note = new Hook();
            String textNote = mindmapTopic.getNote().getTextAttr();
            if (textNote == null || textNote.isEmpty()) {
                textNote = mindmapTopic.getNote().getText();
            }

            // @Todo: For some reason central topic nodes with CDATA seems not to be loaded in the JAXB model.
            // Temporally excluding and continue ..
            textNote = (textNote != null) ? textNote : "";

            textNote = textNote.replaceAll("%0A", "\n");
            note.setNAME("accessories/plugins/NodeNote.properties");
            note.setText(textNote);
            freemindNode.getArrowlinkOrCloudOrEdge().add(note);
        }
    }

    private void addLinkNode(com.wisemapping.jaxb.freemind.Node freemindNode, com.wisemapping.jaxb.wisemap.TopicType mindmapTopic) {
        if (mindmapTopic.getLink() != null) {
            final String url = mindmapTopic.getLink().getUrl();
            freemindNode.setLINK(url);
        }
    }

    private void addIconNode(com.wisemapping.jaxb.freemind.Node freemindNode, com.wisemapping.jaxb.wisemap.TopicType mindmapTopic) {
        if (mindmapTopic.getIcon() != null) {
            final List<Icon> iconsList = mindmapTopic.getIcon();
            for (Icon icon : iconsList) {
                final String id = icon.getId();
                final String freemindIconId = FreemindIconConverter.toFreemindId(id);
                if (freemindIconId != null) {

                    com.wisemapping.jaxb.freemind.Icon freemindIcon = new com.wisemapping.jaxb.freemind.Icon();
                    freemindIcon.setBUILTIN(freemindIconId);
                    freemindNode.getArrowlinkOrCloudOrEdge().add(freemindIcon);
                }
            }
        }
    }

    private void addEdgeNode(com.wisemapping.jaxb.freemind.Node freemindNode, com.wisemapping.jaxb.wisemap.TopicType mindmapTopic) {
        if (mindmapTopic.getBrColor() != null) {
            final Edge edgeNode = objectFactory.createEdge();
            edgeNode.setCOLOR(mindmapTopic.getBrColor());
            freemindNode.getArrowlinkOrCloudOrEdge().add(edgeNode);
        }
    }

    /*
     * MindmapFont format : fontName ; size ; color ; bold; italic;
     * eg: Verdana;10;#ffffff;bold;italic;
     *
     */
    private void addFontNode(@NotNull com.wisemapping.jaxb.freemind.Node freemindNode, com.wisemapping.jaxb.wisemap.TopicType mindmapTopic) {
        final String fontStyle = mindmapTopic.getFontStyle();
        if (fontStyle != null && fontStyle.length() != 0) {
            final Font font = objectFactory.createFont();
            final String[] part = fontStyle.split(";", 6);
            int countParts = part.length;
            boolean updated = false;

            if (!fontStyle.endsWith(EMPTY_FONT_STYLE)) {
                int idx = 0;

                // Font name
                if (idx < countParts && part[idx].length() != 0) {
                    font.setNAME(part[idx]);
                    updated = true;
                }
                idx++;

                // Font size
                if (idx < countParts && part[idx].length() != 0) {
                    String size = part[idx];
                    font.setSIZE(new BigInteger(size));
                    updated = true;
                }
                idx++;

                // Font Color
                if (idx < countParts && part[idx].length() != 0) {
                    freemindNode.setCOLOR(part[idx]);
                }
                idx++;

                // Font Styles
                if (idx < countParts && part[idx].length() != 0) {
                    font.setBOLD(Boolean.TRUE.toString());
                    updated = true;
                }
                idx++;

                if (idx < countParts && part[idx].length() != 0) {
                    font.setITALIC(Boolean.TRUE.toString());
                    updated = true;
                }

                if (updated) {
                    freemindNode.getArrowlinkOrCloudOrEdge().add(font);
                }
            }
        }
    }
}
