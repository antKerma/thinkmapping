<%@page pageEncoding="UTF-8" %>

<%@ page import="com.wisemapping.model.User" %>
<%@ page import="com.wisemapping.security.Utils" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>

<%
    User user = Utils.getUser(false);
    if (user != null) {
        request.setAttribute("principal", user);
    }
%>

<div id="settings-dialog-modal" class="modal fade">
    <div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3><spring:message code="ACCOUNT"/></h3>
    </div>
    <div class="modal-body">

    </div>
    <div class="modal-footer">
        <button class="btn btn-cancel"><spring:message code="CLOSE"/></button>
    </div>
</div>
<div id="header">
    <div id="headerToolbar">
        <c:choose>
            <c:when test="${principal != null}">
                <div class="wrapper">
                    <c:if test="${param.showMapTitle == true}">
                        <h2 id="map-title">
                            ${param.mapTitle}<em>modifié le ${param.mapModificationDate}</em>
                        </h2>
                    </c:if>
                    <span><spring:message code="WELCOME"/>, <strong>${principal.firstname}</strong></span>
                    <nav class="main-menu">
                        <ul>
                            <li id="call-home">
                                <a href="c/home"><spring:message code="HOME"/></a>
                            </li>
                            <li id="call-maps" class="maps">
                                <a href="c/maps/"><spring:message code="MY_WISEMAPS"/></a>
                            </li>
                            <li id="call-settings">
                                <a id="userSettingsBtn" href="#" title="<spring:message code="ACCOUNT_DETAIL"/>"><spring:message code="SETTINGS"/></a>
                            </li>
                            <li id="call-logout">
                                <a href="c/logout" title="<spring:message code="LOGOUT"/>"><spring:message code="LOGOUT"/></a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </c:when>
            <c:when test="${param.removeSignin!=true}">
                <div id="headerActions">
                    <spring:message code="ALREADY_A_MEMBER"/>
                    <span><a href="c/login" title="<spring:message code="SIGN_IN"/>">
                        <spring:message code="SIGN_IN"/>
                    </a></span>
                </div>
            </c:when>
        </c:choose>
    </div>
    <c:if test="${param.onlyActionHeader!=true}">
        <div class="wrapper">
            <a id="logo" href="#">
                <img src="/images/thinkmapping-logo.png" alt="Think Mapping" title="Think Mapping">
            </a>
        </div>
    </c:if>
</div>


<script type="text/javascript" language="javascript" src="js/jquery-1.7.2.min.js"></script>
<script type="text/javascript">
    jQuery.noConflict();
    jQuery('#userSettingsBtn').click(
            function (event) {
                jQuery('#settings-dialog-modal .modal-body').load("c/account/settings",
                        function () {
                            jQuery('#settings-dialog-modal .btn-cancel').unbind('click').click(function () {
                                jQuery('#settings-dialog-modal').modal("hide");
                                window.location.reload();
                            });
                        }
                );
                jQuery('#settings-dialog-modal').modal();
                event.preventDefault();

            });

</script>


