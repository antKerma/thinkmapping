package com.wisemapping.rest.model;


import com.wisemapping.model.Collaborator;
import com.wisemapping.model.Mindmap;
import org.codehaus.jackson.annotate.JsonAutoDetect;
import org.jetbrains.annotations.NotNull;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.ArrayList;

import java.util.Collections;
import java.util.List;

@XmlRootElement(name = "maps")
@XmlAccessorType(XmlAccessType.PROPERTY)
@JsonAutoDetect(
        fieldVisibility = JsonAutoDetect.Visibility.NONE,
        getterVisibility = JsonAutoDetect.Visibility.PUBLIC_ONLY,
        isGetterVisibility = JsonAutoDetect.Visibility.PUBLIC_ONLY)
public class RestMindmapList {

    private List<RestMindmapInfo> mindmapsInfo;

    public RestMindmapList() {
        this(Collections.<Mindmap>emptyList(), null);
    }

    public RestMindmapList(@NotNull List<Mindmap> mindmaps, @NotNull Collaborator collaborator) {
        this.mindmapsInfo = new ArrayList<RestMindmapInfo>();
        for (Mindmap mindMap : mindmaps) {
            this.mindmapsInfo.add(new RestMindmapInfo(mindMap, collaborator));
        }
    }

    public int getCount() {
        return this.mindmapsInfo.size();
    }

    public void setCount(int count) {

    }

    @XmlElement(name = "map")
    public List<RestMindmapInfo> getMindmapsInfo() {
        return mindmapsInfo;
    }

    public void setMindmapsInfo(List<RestMindmapInfo> mindmapsInfo) {
        this.mindmapsInfo = mindmapsInfo;
    }
}
