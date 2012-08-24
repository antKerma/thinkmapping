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

package com.wisemapping.ncontroller;


import com.wisemapping.exceptions.WiseMappingException;
import com.wisemapping.model.CollaborationRole;
import com.wisemapping.model.Mindmap;
import com.wisemapping.model.MindMapHistory;
import com.wisemapping.security.Utils;
import com.wisemapping.service.MindmapService;
import com.wisemapping.view.MindMapBean;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.io.IOException;
import java.util.Locale;

@Controller
public class MindmapController {


    @Qualifier("mindmapService")
    @Autowired
    private MindmapService mindmapService;

    @Value("${site.baseurl}")
    String siteBaseUrl;


    @RequestMapping(value = "maps/import")
    public String showImportPage() {
        return "mindmapImport";
    }

    @RequestMapping(value = "maps/{id}/details")
    public String showDetails(@PathVariable int id, @NotNull Model model) {
        final MindMapBean mindmap = findMindmapBean(id);
        model.addAttribute("mindmap", mindmap);
        model.addAttribute("baseUrl", siteBaseUrl);
        return "mindmapDetail";
    }

    @RequestMapping(value = "maps/{id}/print")
    public String showPrintPage(@PathVariable int id, @NotNull Model model) {
        final MindMapBean mindmap = findMindmapBean(id);
        model.addAttribute("principal", Utils.getUser());
        model.addAttribute("mindmap", mindmap);
        final Locale locale = LocaleContextHolder.getLocale();
        model.addAttribute("locale", locale.toString().toLowerCase());
        return "mindmapPrint";
    }

    @RequestMapping(value = "maps/{id}/export")
    public String showExportPage(@PathVariable int id, @NotNull Model model) throws IOException {
        final Mindmap mindmap = findMindmap(id);
        model.addAttribute("mindmap", mindmap);
        return "mindmapExport";
    }

    @RequestMapping(value = "maps/{id}/exportf")
    public String showExportPageFull(@PathVariable int id, @NotNull Model model) throws IOException {
        showExportPage(id, model);
        return "mindmapExportFull";
    }

    @RequestMapping(value = "maps/{id}/share")
    public String showSharePage(@PathVariable int id, @NotNull Model model) {
        final Mindmap mindmap = findMindmap(id);
        model.addAttribute("mindmap", mindmap);
        return "mindmapShare";
    }

    @RequestMapping(value = "maps/{id}/sharef")
    public String showSharePageFull(@PathVariable int id, @NotNull Model model) {
        showSharePage(id, model);
        return "mindmapShareFull";
    }

    @RequestMapping(value = "maps/{id}/publish")
    public String showPublishPage(@PathVariable int id, @NotNull Model model) {
        final Mindmap mindmap = findMindmap(id);
        model.addAttribute("mindmap", mindmap);
        model.addAttribute("baseUrl", siteBaseUrl);
        return "mindmapPublish";
    }

    @RequestMapping(value = "maps/{id}/publishf")
    public String showPublishPageFull(@PathVariable int id, @NotNull Model model) {
        showPublishPage(id, model);
        return "mindmapPublishFull";
    }

    @RequestMapping(value = "maps/{id}/history", method = RequestMethod.GET)
    public String showHistoryPage(@PathVariable int id, @NotNull Model model) {
        model.addAttribute("mindmapId", id);
        return "mindmapHistory";
    }

    @RequestMapping(value = "maps/{id}/historyf", method = RequestMethod.GET)
    public String showHistoryPageFull(@PathVariable int id, @NotNull Model model) {
        showHistoryPage(id, model);
        return "mindmapHistoryFull";
    }

    @RequestMapping(value = "maps/")
    public String showListPage(@NotNull Model model) {
        final Locale locale = LocaleContextHolder.getLocale();
        model.addAttribute("locale", locale.toString().toLowerCase());
        return "mindmapList";
    }

    @RequestMapping(value = "maps/{id}/edit", method = RequestMethod.GET)
    public String showMindmapEditorPage(@PathVariable int id, @NotNull Model model) {
        final MindMapBean mindmapBean = findMindmapBean(id);
        final Mindmap mindmap = mindmapBean.getDelegated();

        model.addAttribute("mindmap", mindmapBean);

        // Configure default locale for the editor ...
        final Locale locale = LocaleContextHolder.getLocale();
        model.addAttribute("locale", locale.toString().toLowerCase());
        model.addAttribute("principal", Utils.getUser());
        model.addAttribute("readOnlyMode", !mindmap.hasPermissions(Utils.getUser(), CollaborationRole.EDITOR));

        return "mindmapEditor";
    }

    @RequestMapping(value = "maps/{id}/view", method = RequestMethod.GET)
    public String showMindmapViewerPage(@PathVariable int id, @NotNull Model model) {
        final String result = showMindmapEditorPage(id, model);
        model.addAttribute("readOnlyMode", true);
        return result;
    }

    @RequestMapping(value = "maps/{id}/try", method = RequestMethod.GET)
    public String showMindmapTryPage(@PathVariable int id, @NotNull Model model) {
        final String result = showMindmapEditorPage(id, model);
        model.addAttribute("memoryPersistence", true);
        return result;
    }

    @RequestMapping(value = "maps/{id}/{hid}/view", method = RequestMethod.GET)
    public String showMindmapViewerRevPage(@PathVariable int id, @PathVariable int hid, @NotNull Model model) throws WiseMappingException {

        final String result = showMindmapEditorPage(id, model);
        model.addAttribute("readOnlyMode", true);

        // Change map XML ....
        final MindMapBean mindmapBean = (MindMapBean) model.asMap().get("mindmap");
        final MindMapHistory mindmapHistory = mindmapService.findMindmapHistory(id, hid);
        mindmapBean.getDelegated().setXml(mindmapHistory.getXml());

        return result;
    }

    @RequestMapping(value = "maps/{id}/embed")
    public ModelAndView showEmbeddedPage(@PathVariable int id, @RequestParam(required = false) Float zoom) {
        ModelAndView view;
        final MindMapBean mindmap = findMindmapBean(id);
        view = new ModelAndView("mindmapEmbedded", "mindmap", mindmap);
        view.addObject("zoom", zoom == null ? 1 : zoom);
        final Locale locale = LocaleContextHolder.getLocale();
        view.addObject("locale", locale.toString().toLowerCase());
        return view;
    }

    @RequestMapping(value = "maps/{id}/public", method = RequestMethod.GET)
    public String showPublicViewPage(@PathVariable int id, @NotNull Model model) throws WiseMappingException {
        return this.showPrintPage(id, model);
    }

    @Deprecated
    @RequestMapping(value = "publicView", method = RequestMethod.GET)
    public String showPublicViewPageLegacy(@RequestParam(required = true) int mapId) {
        return "redirect:maps/" + mapId + "/public";
    }

    @Deprecated
    @RequestMapping(value = "embeddedView", method = RequestMethod.GET)
    public String showPublicViewLegacyPage(@RequestParam(required = true) int mapId, @RequestParam(required = false) int zoom) {
        return "redirect:maps/" + mapId + "/embed?zoom=" + zoom;
    }

    private Mindmap findMindmap(long mapId) {
        final Mindmap mindmap = mindmapService.findMindmapById((int) mapId);
        if (mindmap == null) {
            throw new IllegalArgumentException("Mindmap could not be found");
        }
        return mindmap;
    }

    private MindMapBean findMindmapBean(long mapId) {
        return new MindMapBean(findMindmap(mapId), Utils.getUser());
    }
}
