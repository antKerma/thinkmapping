<%@ page import="com.wisemapping.security.Utils" %>
<%@ page import="com.wisemapping.model.User" %>
<%@page pageEncoding="UTF-8" %>
<%@ include file="/jsp/init.jsp" %>

<!DOCTYPE HTML>

<%--@elvariable id="mindmap" type="com.wisemapping.model.Mindmap"--%>
<%--@elvariable id="editorTryMode" type="java.lang.Boolean"--%>
<%--@elvariable id="editorTryMode" type="java.lang.String"--%>
<%--@elvariable id="mapXml" type="com.wisemapping.model.User"--%>
<html>
<head>
    <base href="${baseURL}/">
    <title><spring:message code="SITE.TITLE"/> - ${mindmap.title} </title>
    <!--[if lt IE 9]>
    <meta http-equiv="X-UA-Compatible" content="chrome=1">
    <![endif]-->
    <link rel="stylesheet/less" type="text/css" href="css/editor.less"/>
    <link rel="stylesheet/less" type="text/css" href="css/mindmapList.less"/>
    <script type='text/javascript' src='js/mootools-core.js'></script>
    <script type='text/javascript' src='js/mootools-more.js'></script>
    <script type='text/javascript' src='js/core.js'></script>
    <script type='text/javascript' src='js/less.js'></script>

    <link rel="icon" href="images/favicon.ico" type="image/x-icon">
    <link rel="shortcut icon" href="images/favicon.ico" type="image/x-icon">

    <script type="text/javascript">

        $(document).addEvent('loadcomplete', function (resource) {
            try {
                var mapId = '${mindmap.id}';
                var mapXml = '${mindmap.xmlAsJsLiteral}';

                // Configure designer options ...
                var options = loadDesignerOptions();
            <c:if test="${!memoryPersistence}">
                options.persistenceManager = new mindplot.RESTPersistenceManager("service/maps/{id}/document", "service/maps/{id}/history/latest");
            </c:if>
                var userOptions = ${mindmap.properties};
                options.zoom = userOptions.zoom;
                options.readOnly = ${!!readOnlyMode};
                options.locale = '${locale}';

                // Set map id ...
                options.mapId = mapId;

                // Build designer ...
                var designer = buildDesigner(options);

                // Load map from XML ...
                var parser = new DOMParser();
                var domDocument = parser.parseFromString(mapXml, "text/xml");

                var mindmap = mindplot.PersistenceManager.loadFromDom(mapId, domDocument);
                designer.loadMap(mindmap);
            } catch (e) {
                logStackTrace(e);
                throw e;
            }
        });
    </script>
</head>
<body>

<div id="actionsContainer"></div>

<jsp:include page="header.jsp">
    <jsp:param name="removeSignin" value="false"/>
    <jsp:param name="showLogout" value="true"/>
    <jsp:param name="onlyActionHeader" value="true"/>
    <jsp:param name="showMapTitle" value="true"/>
    <jsp:param name="mapTitle" value="${mindmap.title}"/>
    <jsp:param name="mapModificationDate" value="${mindmap.lastEditTime}"/>
</jsp:include>

<%@ include file="/jsp/mindmapEditorVerticalToolbar.jsf" %>

<div id="footerContainer" class="row">
    <a href="http://www.wisemapping.org/"><spring:message code="COPYRIGHT"/></a>
</div>

<div id="mindplot" onselectstart="return false;"></div>
<script type="text/javascript" src="js/editor.js"></script>
</body>
</html>
