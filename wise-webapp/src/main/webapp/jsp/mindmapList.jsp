<%@page pageEncoding="UTF-8" %>
<%@include file="/jsp/init.jsp" %>

<!DOCTYPE HTML>

<html lang="en">
<head>
    <base href="${baseURL}/">
    <title><spring:message code="SITE.TITLE"/> - <spring:message code="MY_WISEMAPS"/></title>
    <!--[if lt IE 9]>
    <meta http-equiv="X-UA-Compatible" content="chrome=1">
    <![endif]-->

    <link rel="icon" href="images/favicon.ico" type="image/x-icon"/>
    <link rel="shortcut icon" href="images/favicon.ico" type="image/x-icon"/>

    <link rel="stylesheet/less" type="text/css" href="css/mindmapList.less"/>

    <script type="text/javascript" language="javascript" src="js/jquery-1.7.2.min.js"></script>
    <script type="text/javascript" language="javascript" src="bootstrap/js/bootstrap.js"></script>
    <script src="js/less.js" type="text/javascript"></script>

    <!--jQuery DataTables-->
    <script type="text/javascript" language="javascript" src="js/jquery.dataTables.min.js"></script>
    <script type="text/javascript" language="javascript" src="js/mindmapList.js"></script>

    <!-- Update timer plugging -->
    <script type="text/javascript" language="javascript" src="js/jquery.timeago.js"></script>
    <script type="text/javascript" language="javascript" src="js/jquery.timeago.${locale}.js"></script>


    <script type="text/javascript" language="javascript">
        $(function () {
            $('#mindmapListTable').dataTable({
                bProcessing:true,
                sAjaxSource:"service/maps/",
                sAjaxDataProp:'mindmapsInfo',
                fnInitComplete:function () {
                    $('#mindmapListTable tbody').change(updateStatusToolbar);
                    callbackOnTableInit();
                },
                aoColumns:[
                    {
                        sTitle:'<input type="checkbox" id="selectAll"/>',
                        sWidth:"60px",
                        sClass:"select",
                        bSortable:false,
                        bSearchable:false,
                        mDataProp:"starred",
                        bUseRendered:false,
                        fnRender:function (obj) {
                            return '<input type="checkbox"/><span class="' + (obj.aData.starred ? 'starredOn' : 'starredOff') + '"></span>';
                        }
                    },
                    {
                        sTitle:"<spring:message code="NAME"/>",
                        sWidth:"270px",
                        bUseRendered:false,
                        mDataProp:"title",
                        fnRender:function (obj) {
                            return '<a href="c/maps/' + obj.aData.id + '/edit">' + $('<span></span>').text(obj.aData.title).html() + '</a>';
                        }
                    },
                    {
                        sTitle:"<spring:message code="CREATOR"/>",
                        mDataProp:"creator"
                    },
                    {
                        bSearchable:false,
                        sTitle:"<spring:message code="LAST_UPDATE"/>",
                        bUseRendered:false,
                        sType:"date",
                        mDataProp:"lastModificationTime",
                        fnRender:function (obj) {
                            var time = obj.aData.lastModificationTime;
                            return '<abbr class="timeago" title="' + time + '">' + $.timeago(time) + '</abbr>' + ' ' + '<span style="color: #777;font-size: 75%;padding-left: 5px;">' + obj.aData.lastModifierUser + '</span>';
                        }
                    }
                ],
                bAutoWidth:false,
                oLanguage:{
                    "sLengthMenu":"<spring:message code="SHOW_REGISTERS"/>",
                    "sSearch":"",
                    "sZeroRecords":"<spring:message code="NO_MATCHING_FOUND"/>",
                    "sLoadingRecords":"<spring:message code="LOADING"/>",
                    "sInfo":"<spring:message code="TABLE_ROWS"/>",
                    "sInfoEmpty" : "<spring:message code="ZERO_RESULTS"/>",
                    "sEmptyTable":"<spring:message code="NO_SEARCH_RESULT"/>",
                    "sProcessing":"<spring:message code="LOADING"/>"
                },
                bStateSave:true
            });

            // Customize search action ...
            $('#mindmapListTable_filter').appendTo("#buttonsToolbar");
            $('#mindmapListTable_filter').append('<span><label><spring:message code="SEARCH"/></label><input type="submit" value="<spring:message code="SEARCH"/>"></span>');
            $("#mindmapListTable_info").appendTo("#pageInfo");

            // Re-arrange pagination actions ...
            $("#tableFooter").appendTo("#mindmapListTable_wrapper");
            $("#mindmapListTable_length").appendTo("#tableFooter");
            $('#mindmapListTable_length select').addClass('span1');


            $('input:checkbox[id="selectAll"]').click(function () {
                $("#mindmapListTable").dataTableExt.selectAllMaps();
            });

            // Hack for changing the pagination buttons ...
            $('#nPageBtn').click(function () {
                $('#mindmapListTable_next').click();
            });
            $('#pPageBtn').click(function () {
                $('#mindmapListTable_previous').click();
            });
        });
    </script>
</head>
<body>
<jsp:include page="header.jsp">
    <jsp:param name="removeSignin" value="false"/>
    <jsp:param name="showLogout" value="true"/>
</jsp:include>

<div style="min-height: 500px">
    <div id="mindmapListContainer">
        <div id="messagesPanel" class="alert alert-error alert-block fade in hide" style="margin-top: 10px">
            <strong><spring:message code="UNEXPECTED_ERROR"/></strong>

            <p><spring:message code="UNEXPECTED_ERROR_SERVER_ERROR"/></p>

            <div></div>
        </div>




        <div id="buttonsToolbar" class="btn-toolbar">

            <div class="btn-group">
                <a id="newBtn" class="btn btn-primary">
                    <div class="btn-label new"><spring:message code="NEW_MAP"/></div>
                </a>
                <a id="importBtn" class="btn btn-primary">
                    <div class="btn-label import"><spring:message code="IMPORT"/></div>
                </a>
            </div>

            <div class="btn-group act-multiple" id="deleteBtn">
                <a class="btn btn-primary">
                    <div class="btn-label delete"><spring:message code="DELETE"/></div>
                </a>
            </div>

            <div id="actionsBtn" class="btn-group act-single">

                <a class="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                    <div class="btn-label more">
                        <spring:message code="MORE"/>
                    </div>
                </a>

                <ul class="dropdown-menu">
                    <li><a href="#" onclick="return false"><i class="icon-exclamation-sign"></i>
                        <spring:message code="INFO"/></a></li>
                    <li id="duplicateBtn"><a href="#" onclick="return false"><i class="icon-plus-sign"></i>
                        <spring:message code="DUPLICATE"/></a></li>
                    <li id="renameBtn"><a href="#" onclick="return false"><i class="icon-edit"></i> <spring:message
                            code="RENAME"/></a></li>
                    <li id="publishBtn"><a href="#" onclick="return false"><i class="icon-globe"></i>
                        <spring:message code="PUBLISH"/></a>
                    </li>
                    <li id="shareBtn"><a href="#" onclick="return false"><i class="icon-share"></i> <spring:message
                            code="SHARE"/></a></li>
                    <li id="exportBtn"><a href="#" onclick="return false"><i class="icon-download"></i>
                        <spring:message
                                code="EXPORT"/></a>
                    </li>
                    <li id="printBtn"><a href="#" onclick="return false"><i class="icon-print"></i> <spring:message
                            code="PRINT"/></a></li>
                    <li id="historyBtn"><a href="#" onclick="return false"><i class="icon-time"></i> <spring:message
                            code="HISTORY"/></a>
                    </li>
                </ul>
            </div>
        </div>

        <div id="foldersContainer">
            <ul class="nav nav-pills">
                <li class="nav-header"><spring:message code="FILTER_MAPS"/></li>
                <li data-filter="all" class="active"><a href="#"><i class="icon-inbox icon-white"></i> <spring:message
                        code="ALL_MAPS"/></a></li>
                <li data-filter="my_maps"><a href="#"><i class="icon-user"></i> <spring:message code="MY_MAPS"/></a>
                </li>
                <li data-filter="shared_with_me"><a href="#"><i class="icon-share"></i> <spring:message
                        code="SHARED_WITH_ME"/></a></li>
                <li data-filter="starred"><a href="#"><i class="icon-star"></i> <spring:message code="STARRED"/></a>
                </li>
                <li data-filter="public"><a href="#"><i class="icon-globe"></i> <spring:message code="PUBLIC_MAPS"/></a>
                </li>
            </ul>
        </div>

        <div id="tableActions" class="btn-toolbar">
            <div class="btn-group" id="pageButtons">
                <button class="btn" id="pPageBtn"><strong>&lt;</strong></button>
                <button class="btn" id="nPageBtn"><strong>&gt;</strong></button>
            </div>
            <div id="pageInfo"></div>
        </div>

        <div id="map-table">
            <table class="table" id="mindmapListTable"></table>
        </div>
        <div id="tableFooter" class="form-inline"></div>

    </div>
    <div class="span1" style="padding-top:25px">
        <c:if test="${requestScope['google.ads.enabled']}">
            <script type="text/javascript"><!--
            google_ad_client = "ca-pub-7564778578019285";
            /* WiseMapping Mindmap List */
            google_ad_slot = "4071968444";
            google_ad_width = 120;
            google_ad_height = 440;
            //-->
            </script>
            <div style="margin-top:5px;">
                <script type="text/javascript"
                        src="http://pagead2.googlesyndication.com/pagead/show_ads.js">
                </script>
            </div>
        </c:if>
    </div>
</div>
<jsp:include page="footer.jsp"/>

<div id="dialogsContainer">
<!-- New map dialog -->
<div id="new-dialog-modal" title="<spring:message code="ADD_NEW_MAP"/>" class="modal fade">
    <div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3><spring:message code="NEW_MAP_MSG"/></h3>
    </div>
    <div class="modal-body">
        <div class="errorMessage"></div>
        <form class="form-horizontal">
            <fieldset>
                <div class="control-group">
                    <label class="control-label" for="newTitle"><spring:message code="NAME"/>:</label>
                    <input class="control" name="title" id="newTitle" type="text" required="required"
                           placeholder="<spring:message code="MAP_NAME_HINT"/>" autofocus="autofocus" maxlength="255"/>
                </div>
                <div class="control-group">
                    <label class="control-label" for="newDec"><spring:message code="DESCRIPTION"/>:</label>
                    <input class="control" name="description" id="newDec" type="text"
                           placeholder="<spring:message code="MAP_DESCRIPTION_HINT"/>" maxlength="255"/>
                </div>
            </fieldset>
        </form>
    </div>
    <div class="modal-footer">
        <button class="btn btn-primary btn-accept" data-loading-text="<spring:message
                code="SAVING"/>"><spring:message
                code="CREATE"/></button>
        <button class="btn btn-cancel" data-dismiss="modal"><spring:message code="CANCEL"/></button>
    </div>
</div>

<!-- Duplicate map dialog -->
<div id="duplicate-dialog-modal" class="modal fade">
    <div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3 id="dupDialogTitle"></h3>
    </div>
    <div class="modal-body">
        <div class="errorMessage"></div>
        <form class="form-horizontal">
            <fieldset>
                <div class="control-group">
                    <label for="title" class="control-label"><spring:message code="NAME"/>: </label>
                    <input name="title" id="title" type="text" required="required"
                           placeholder="<spring:message code="MAP_DESCRIPTION_HINT"/>" autofocus="autofocus"
                           class="control" maxlength="255"/>
                </div>
                <div class="control-group">
                    <label for="description" class="control-label"><spring:message
                            code="DESCRIPTION"/>: </label>
                    <input name="description" id="description" type="text"
                           placeholder="<spring:message code="MAP_DESCRIPTION_HINT"/>" class="control" maxlength="255"/>
                </div>
            </fieldset>
        </form>
    </div>
    <div class="modal-footer">
        <button class="btn btn-primary btn-accept" data-loading-text="<spring:message code="SAVING"/>">
            <spring:message code="DUPLICATE"/></button>
        <button class="btn btn-cancel" data-dismiss="modal"><spring:message code="CANCEL"/></button>
    </div>
</div>

<!-- Rename map dialog -->
<div id="rename-dialog-modal" class="modal fade">
    <div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3 id="renameDialogTitle"><spring:message code="RENAME"/></h3>
    </div>
    <div class="modal-body">
        <div class="errorMessage"></div>
        <form class="form-horizontal">
            <fieldset>
                <div class="control-group">
                    <label for="renTitle" class="control-label"><spring:message code="NAME"/>: </label>
                    <input name="title" id="renTitle" required="required" autofocus="autofocus"
                           class="control" maxlength="255"/>
                </div>
                <div class="control-group">
                    <label for="renDescription" class="control-label"><spring:message
                            code="DESCRIPTION"/>:</label>
                    <input name="description" class="control" id="renDescription" maxlength="255"/>
                </div>
            </fieldset>
        </form>
    </div>
    <div class="modal-footer">
        <button class="btn btn-primary btn-accept" data-loading-text="<spring:message code="SAVING"/>"><spring:message
                code="RENAME"/></button>
        <button class="btn btn-cancel" data-dismiss="modal"><spring:message code="CANCEL"/></button>
    </div>
</div>

<!-- Delete map dialog -->
<div id="delete-dialog-modal" class="modal fade">
    <div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3><spring:message code="DELETE_MINDMAP"/></h3>
    </div>
    <div class="modal-body">
        <div class="alert alert-block">
            <h4 class="alert-heading"><spring:message code="WARNING"/>!</h4><spring:message code="DELETE_MAPS_WARNING"/>
        </div>
    </div>
    <div class="modal-footer">
        <button class="btn btn-primary btn-accept" data-loading-text="<spring:message
                code="SAVING"/> ..."><spring:message
                code="DELETE"/></button>
        <button class="btn btn-cancel" data-dismiss="modal"><spring:message code="CANCEL"/></button>
    </div>
</div>

<!-- Info map dialog -->
<div id="info-dialog-modal" class="modal fade">
    <div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3><spring:message code="INFO"/></h3>
    </div>
    <div class="modal-body">

    </div>
    <div class="modal-footer">
        <button class="btn btn-cancel" data-dismiss="modal"><spring:message code="CLOSE"/></button>
    </div>
</div>

<!-- Publish Dialog Config -->
<div id="publish-dialog-modal" class="modal fade">
    <div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3><spring:message code="PUBLISH"/></h3>
    </div>
    <div class="modal-body">

    </div>
    <div class="modal-footer">
        <button class="btn btn-primary btn-accept" data-loading-text="<spring:message code="SAVING"/>...">
            <spring:message code="ACCEPT"/></button>
        <button class="btn btn-cancel" data-dismiss="modal"><spring:message code="CANCEL"/></button>
    </div>
</div>

<!-- Export Dialog Config -->
<div id="export-dialog-modal" class="modal fade">
    <div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3><spring:message code="EXPORT"/></h3>
    </div>
    <div class="modal-body">

    </div>
    <div class="modal-footer">
        <button class="btn btn-primary btn-accept" data-loading-text="Exporting..."><spring:message
                code="EXPORT"/></button>
        <button class="btn btn-cancel" data-dismiss="modal"><spring:message code="CANCEL"/></button>
    </div>
</div>

<!-- Import Dialog Config -->
<div id="import-dialog-modal" class="modal fade">
    <div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3><spring:message code="IMPORT"/></h3>
    </div>
    <div class="modal-body">

    </div>
    <div class="modal-footer">
        <button class="btn btn-primary btn-accept" data-loading-text="<spring:message
                    code="IMPORTING"/>"><spring:message
                code="IMPORT"/></button>
        <button class="btn btn-cancel" data-dismiss="modal"><spring:message code="CANCEL"/></button>
    </div>
</div>

<!-- Share Dialog Config -->
<div id="share-dialog-modal" class="modal fade">
    <div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3><spring:message code="SHARE"/></h3>
    </div>
    <div class="modal-body">

    </div>
    <div class="modal-footer">
        <button class="btn btn-primary btn-accept" data-loading-text="<spring:message code="SAVING"/>">
            <spring:message code="ACCEPT"/></button>
        <button class="btn btn-cancel" data-dismiss="modal"><spring:message code="CANCEL"/></button>
    </div>
</div>

<!-- History Dialog Config -->
<div id="history-dialog-modal" class="modal fade">
    <div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3><spring:message code="HISTORY"/></h3>
    </div>
    <div class="modal-body">

    </div>
    <div class="modal-footer">
        <button class="btn btn-cancel" data-dismiss="modal"><spring:message code="CLOSE"/></button>
    </div>
</div>
</div>
</body>
</html>
