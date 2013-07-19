<%@page pageEncoding="UTF-8" %>
<%@include file="/jsp/init.jsp" %>

<style type="text/css">
    #wizardContainer input {
        width: 50px;
        height: 25px;
        display: inline-block;
    }
</style>

<form method="post" id="dialogMainForm" action="#" class="well form-inline">
    <fieldset>
        <div class="control-group">
            <label for="renTitle" class="control-label"><spring:message code="NAME"/>: </label>
            <input name="title" id="renTitle" required="required" autofocus="autofocus"
                   class="control" maxlength="255"/>
        </div>
        <div class="control-group" style="display: none">
            <label for="renDescription" class="control-label"><spring:message
                    code="DESCRIPTION"/>:</label>
            <input name="description" class="control" id="renDescription" maxlength="255"/>
        </div>
    </fieldset>
</form>

<script type="text/javascript">
    // Save status on click ...
    $('#dialogMainForm').submit(function (event) {
        var formData = {};
        $('#dialogMainForm input').each(function (index, elem) {
            formData[elem.name] = elem.value;
        });

        jQuery.ajax("service/maps/${mindmap.id}", {
            async:false,
            dataType:'json',
            data: JSON.stringify(formData),
            type:'POST',
            contentType:"application/json; charset=utf-8",
            success:function (data, textStatus, jqXHR) {
                var resourceId = jqXHR.getResponseHeader("ResourceId");
                var redirectUrl = "c/maps/{header.resourceId}/edit";
                redirectUrl = redirectUrl.replace("{header.resourceId}", resourceId);
                // Hack: IE ignore the base href tag ...
                var baseUrl = window.location.href.substring(0, window.location.href.lastIndexOf("c/maps/"));
                window.parent.open(baseUrl + redirectUrl, '_self');
                $('.modalDialog').modal('hide');
            },
            error:function (jqXHR, textStatus, errorThrown) {
                alert(textStatus);
            }
        });
        event.preventDefault();
    });

    // Hook for interaction with the main parent window ...
    var submitDialogForm = function () {
        $('#dialogMainForm').submit();
    }
</script>

