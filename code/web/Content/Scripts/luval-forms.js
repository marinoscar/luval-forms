class forms {
    constructor(model) {
        this.model = model;
        forms.sanitizeModel(this.model, 'controllerName', '');
        forms.sanitizeModel(this.model, 'title');
        forms.sanitizeModel(this.model, 'description');
    }

    static sanitizeModel(model, attribute, defaultValue) {
        if (utils.isNull(defaultValue))
            defaultValue = "";

        if (utils.isNull(model[attribute]))
            model[attribute] = defaultValue;
    }

    sanitizeFields() {
        this.sanitizeFieldsFromArray(this.model.fields);
    }

    sanitizeFieldsFromArray(fields) {
        for (var i = 0, len = fields.length; i < len; i++) {
            forms.sanitizeModel(fields[i], 'help');
            forms.sanitizeModel(fields[i], 'value');
            forms.sanitizeModel(fields[i], 'placeholder');
            forms.sanitizeModel(fields[i], 'attributes', []);
            forms.sanitizeModel(fields[i], 'required', false);
            forms.sanitizeModel(fields[i], 'isRequired', '');
        }
    }

    applyFormatToSelect() {
        $('select').select2({
            theme: "bootstrap4"
        });
    }

    render(elementId, onComplete) {
        return this.renderAs(elementId, false, onComplete);
    }

    renderAs(elementId, isEditMode, onComplete) {
        var el = document.getElementById(elementId);
        var form = this.renderForm(isEditMode);
        el.innerHTML = form;
        //assign events
        this.applyFormatToSelect();

        if (!utils.isNull(onComplete))
            onComplete(el);
    }

    renderWithData(elementId, recordId, onComplete) {
        var context = this;
        return this.renderAs(elementId, true, function (renderData) {
            context.loadValues(recordId, function (recordData) {
                if (!utils.isNull(onComplete))
                    onComplete({ render: renderData, record: recordData });
            });
        });
    }

    loadValues(id, onComplete) {
        var url = '/' + this.model.controllerName + '/GetEntity/' + id;
        var context = this;
        $.getJSON(url, function (data) {
            context.updateFields(context.model.fields, data);
            if (!utils.isNull(onComplete))
                onComplete(data);
        });
    }

    updateFields(fields, data) {
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            if (!utils.isNullOrEmpty(field["fields"])) {
                this.updateFields(field["fields"], data);
                continue;
            }
            var elementId = '#' + field.fieldId;
            var value = '';

            if (!utils.isNullOrEmpty(data[field.name]))
                value = data[field.name];
            if ($(elementId).is('select')) {
                $(elementId).val(value);
                $(elementId).trigger('change');
            }
            if (!$(elementId).is(':checkbox'))
                $(elementId).val(value);
            else if (value)
                $(elementId).prop('checked', true);
        }
    }

    renderForm(isEditMode) {
        var formFields = this.renderFields();
        var commands = this.renderCommands();
        var template = _.template(
            `<form id="<%= id %>" method="<%= method %>" action="<%= action %>" >
                <%= formFields %>
                <%= commands %>
            </form >`
        );
        var action = '/' + this.model.controllerName + '/Create';
        if (isEditMode)
            action = '/' + this.model.controllerName + '/Edit';
        var result = template(
            {
                id: this.model.id,
                method: 'post',
                action: action,
                formFields: formFields,
                commands: commands
            }
        );
        return result;
    }

    renderCommands() {
        var template = _.template(
            `   <div id="<%= id %>-commands" class="form-group">
                    <button id="<%= submitId %>" data-luval-action="submit" type="submit" class="btn btn-primary">Submit</button>
                    <button id="<%= cancelId %>" data-luval-action="cancel" type="button" class="btn btn-default" onclick="location.href='<%= url %>'">Cancel</button>
                </div>
            `
        );
        return template(
            {
                id: this.model.id,
                submitId: this.model.id + '-submit',
                cancelId: this.model.id + '-cancel',
                url: '/' + this.model.controllerName
            });
    }

    renderFields() {
        this.sanitizeFields();
        var fields = _.sortBy(this.model.fields, 'row');
        var result = "";
        for (var i = 0, len = fields.length; i < len; i++) {
            result = result + this.renderField(this.model.id, fields[i]) + '\n';
        }
        return result;
    }

    renderField(formId, field) {
        var res = '';
        var template = _.template(
            `<div class="form-row">
                <%= fields %>
             </div>
            `
        );
        if (utils.isNullOrEmpty(field.fields))
            res = this.renderFieldColumn(formId, field, "col-md-12");
        else {
            this.sanitizeFieldsFromArray(field.fields);
            var colIndex = 12;
            if (field.fields.length <= 4)
                colIndex = 12 / field.fields.length;
            for (var i = 0; i < field.fields.length; i++) {
                res += this.renderFieldColumn(formId, field.fields[i], 'col-sm-12 col-md-' + colIndex);
            }
        }
        return template({ fields: res });
    }

    renderFieldColumn(formId, field, columnClass) {
        var fieldId = formId + "-" + field.id;
        var helpElement = null;
        if (!utils.isNull(field.help))
            helpElement = this.renderHelpElement(fieldId, field);

        if (field.required) field["isRequired"] = "required";
        field["fieldId"] = fieldId;
        field["helpElement"] = helpElement;
        field["colClass"] = columnClass;
        field["formGroupClass"] = "form-group";
        field["labelClass"] = "";

        switch (field.type) {
            case "hidden":
                return this.renderHidden(fieldId, field);
            case "textarea":
                field["input"] = this.renderTextArea(fieldId, field);
                break;
            case "select":
                field["input"] = this.renderSelect(fieldId, field);
                break;
            case "checkbox":
                field["input"] = this.renderCheck(fieldId, field);
                field["formGroupClass"] = "form-check";
                field["labelClass"] = "form-check-label";
                field["colClass"] = "";
                break;
            default:
                field["input"] = this.renderInput(fieldId, helpElement, field);
        }

        var labelTemplate = _.template(`<label for="<%= fieldId %>" class="<%= labelClass %>" ><%= label %></label>`);
        var labelText = labelTemplate(field);

        if (field.type === "checkbox") {
            field["inputLabel"] = '';
            field["checkLabel"] = labelText;
        }
        else {
            field["inputLabel"] = labelText;
            field["checkLabel"] = '';
        }

        var template = _.template(
            `<div class="<%= formGroupClass %> <%= colClass %>">
                <%= inputLabel %>
                <%= input %>
                <%= helpElement %>
                <%= checkLabel %>
              </div>
            `
        );
        var result = template(field);
        return result;
    }

    renderCheck(fieldId, field) {
        if (field.value === 0) field.value = false;
        if (field.value === 'false') field.value = false;
        if (field.value === 1) field.value = true;
        if (field.value === 'true') field.value = true;

        var template = _.template(
            `
            <input  data-luval-check="true" class="form-check-input" id="<%= fieldId %>" name="<%= name %>" type="checkbox" value="true" >
            <input id="_meta_<%= fieldId %>" name="_<%= name %>" type="hidden" value="checkbox">
            `
        );

        field["fieldId"] = fieldId;
        var result = template(field);
        return result;
    }

    renderInput(fieldId, helpElementTag, field) {
        var template = _.template(
            `
            <input class="form-control" id="<%= fieldId %>" name="<%= name %>" type="<%= type %>" value="<%= value %>" <% helpElementTag %> placeholder="<%= placeholder %>" <%= isRequired %> >
            <input id="_meta_<%= fieldId %>" name="_<%= name %>" type="hidden" value="<%= type %>">
            `
        );
        field["fieldId"] = fieldId;
        if (!utils.isNull(helpElementTag))
            field["helpElementTag"] = 'aria-describedby="' + fieldId + '-help"';
        var result = template(field);
        return result;
    }

    renderTextArea(fieldId, field) {
        forms.sanitizeModel(field, 'rows', '3');
        var template = _.template(
            `
            <textarea class="form-control" id="<%= id %>" name="<%= name %>" rows="<%= rows %>"></textarea>
            <input id="_meta_<%= id %>" name="_<%= name %>" type="hidden" value="text">
            `
        );
        field.id = fieldId;
        return template(field);
    }

    renderHidden(fieldId, field) {
        var template = _.template('<input type="hidden" id="<%= id %>" name="<%= name %>" value="<%= value %>">');
        return template({ id: fieldId, value: field.value, name: field.name });
    }

    renderSelect(fieldId, field) {
        forms.sanitizeModel(field, 'items', []);
        var template = _.template(
            `
            <select class="form-control"  data-luval-select="<%= name %>"  id="<%= fieldId %>" name="<%= name %>">
                <%= options %>
            </select>
            <input id="_meta_<%= fieldId %>" name="_<%= name %>" type="hidden" value="number">
            `
        );
        var restItems = null;
        if (!utils.isNullOrEmpty(field.selectServiceUrl)) {
            $.ajax({
                async: false,
                url: field.selectServiceUrl,
                success: function (data) {
                    restItems = data;
                }
            });
            if (!utils.isNullOrEmpty(restItems))
                field.items = restItems;
        }
        var options = this.renderSelectOptions(field, field.items);
        var result = template({ fieldId: fieldId, name: field.name, options: options });
        return result;
    }

    renderSelectOptions(field, items) {
        var options = '';
        for (var i = 0; i < items.length; i++) {
            var item = field.items[i];
            forms.sanitizeModel(item, 'text');
            forms.sanitizeModel(item, 'value');
            var selected = '';
            if (item.value === field.value)
                selected = "selected";
            options += '<option ' + selected + ' value="' + item.value + '">' + item.text + '</option>\n';
        }
        return options;
    }

    renderHelpElement(fieldId, field) {
        var template = _.template(
            `
                <small id="<%= fieldId %>-help" data-help-field="<%= id %>" class="form-text text-muted"><%= help %></small>
            `
        );
        var result = template({ fieldId: fieldId, id: field.id, help: field.help });
        return result;
    }

}

class tables {
    constructor(model, list) {
        this.model = model;
        this.list = list;
        forms.sanitizeModel(this.model, "keyColumnName", "Id");
        forms.sanitizeModel(this.model, "columns", []);
        forms.sanitizeModel(this.model, "id", "table-0001");
        forms.sanitizeModel(this.model, "controllerName");
    }

    render(elementId, onComplete) {
        var el = document.getElementById(elementId);
        var table = this.renderTable();
        el.innerHTML = table;
        if (!utils.isNull(onComplete))
            onComplete(el);
    }

    renderTable() {
        var header = this.renderTableHeader();
        var body = this.renderTableBody();
        var template = _.template(
            `
            <table id="<%= id %>" class="table table-hover table-striped" data-table-luval="true" data-column-key="<%= keyColumnName %>">
                <thead>
                    <%= tableHeader %>
                </thead>
                <tbody>
                    <%= tableBody %>
                </tbody>
            </table>
            `
        );
        return template({ id: this.model.id, keyColumnName: this.model.keyColumnName, tableHeader: header, tableBody: body });
    }

    renderTableHeader() {
        var result = '<tr>';
        for (var i = 0; i < this.model.columns.length; i++) {
            var col = this.model.columns[i];
            var visible = this.getVisibilityStyle(col.visible);
            result += '<th scope="col" ' + visible + ' >' + col.caption + '</th>';
        }
        result += '</tr>';
        return result;
    }

    renderTableBody() {
        var body = '';
        for (var i = 0; i < this.list.length; i++) {
            body += this.renderTableRow(i);
        }
        return body;
    }

    renderTableRow(index) {
        var row = this.list[index];
        var cells = '';
        var keyValue = row[this.model.keyColumnName];
        var template = _.template(
            `
            <tr data-row-key="<%= keyValue %>">
            <%= cells %>
            </tr>
            `
        );
        for (var i = 0; i < this.model.columns.length; i++) {
            var col = this.model.columns[i];
            var cellValue = row[col.name];
            if (utils.isNull(cellValue))
                cellValue = "";
            cells += this.renderTableCell(col.visible, cellValue);

        }
        return template({ keyValue: keyValue, cells: cells });
    }

    renderTableCell(isVisible, text) {
        return '<td ' + this.getVisibilityStyle(isVisible) + ' >' + text + '</td>';
    }

    getVisibilityStyle(isVisible) {
        var result = '';
        if (isVisible === "false")
            result = 'style="display:none;"';
        return result;
    }

}

class listBuilder {
    constructor(model, options) {
        this.model = model;
        if (utils.isNullOrEmpty(options)) this.options = {};
        else this.options = options;

        forms.sanitizeModel(this.options, 'hideCommands', false);
        forms.sanitizeModel(this.options, 'getData', true);
        forms.sanitizeModel(this.options, 'data', []);
        forms.sanitizeModel(this.options, 'dataTables', {});
    }

    render(elementId, onComplete) {
        var el = document.getElementById(elementId);
        var localModel = this.model;
        var context = this;

        if (this.options.getData) {
            this.getData(function (data) {
                context.configureTable(el, data, context, onComplete);
            });
        }
        else
            context.configureTable(el, this.options.data, context, onComplete);
    }

    configureTable(element, data, context, onComplete) {
        var template = _.template(
            `
            <div class="row">
                <div class="col-md-12">
                    <%= table %>
                </div>
            </div>
            <div id="<%= commandId %>" class="row" data-luval-table-commands="<%= commandId %>">
                <div class="col-md-12">
                    <div class="btn-group" role="group" aria-label="Toolbar">
                      <button data-luval-action="create" type="button" class="btn btn-success" style="width: 100px;"><i class="fas fa-plus" style="padding-right: 10px;"></i>Add</button>
                      <button data-luval-action="edit" type="button" class="btn btn-secondary" style="width: 100px;"><i class="fas fa-edit" style="padding-right: 10px;"></i>Edit</button>
                      <button data-luval-action="remove" type="button" class="btn btn-danger" style="width: 100px;"><i class="fas fa-trash" style="padding-right: 10px;"></i>Delete</button>
                    </div>
                </div>
            </div>
            `
        );
        var commandId = context.model.id + '-commands';
        var table = new tables(context.model, data).renderTable();
        element.innerHTML = template({ table: table, commandId: commandId });
        $('#' + context.model.id).DataTable(context.options.dataTables);
        if (context.options.hideCommands)
            $('#' + commandId).hide();

        //attach other events
        context.attachEvents();
        if (!utils.isNull(onComplete)) {
            onComplete(element);
        }
    }

    attachEvents() {
        this.addSelectRowFunc();
        this.addButtonEventsFunc();
    }

    addSelectRowFunc() {
        var el = $('#' + this.model.id);
        var table = el.DataTable();

        $('#' + this.model.id + ' tbody').on('click', 'tr', function () {
            if ($(this).hasClass('table-active')) {
                $(this).removeClass('table-active');
            }
            else {
                table.$('tr.table-active').removeClass('table-active');
                $(this).addClass('table-active');
            }
        });
    }

    getSelectedId() {
        var el = this.getSelectedRowElement();
        if (utils.isNull(el)) return 0;
        return el.data('row-key');
    }

    getSelectedRowElement() {
        var el = $('#' + this.model.id + ' tbody .table-active');
        if (utils.isNull(el)) return null;
        return el;
    }

    getSelectedRowElementIndex() {
        var el = this.getSelectedRowElement();
        if (utils.isNull(el)) return 0;
        return el.index();
    }

    getData(onComplete) {
        $.getJSON('/' + this.model.controllerName + '/ListAll', function (data) {
            onComplete(data);
        });
    }

    addButtonEventsFunc() {
        this.addCreateFunc();
        this.addEditFunc();
        this.addDeleteFunc();
    }

    addCreateFunc() {
        var modelVal = this.model;
        $('*[data-luval-action="create"]').on('click', function () {
            window.location.href = '/' + modelVal.controllerName + '/Create';
        });
    }

    addEditFunc() {
        var modelVal = this.model;
        var context = this;
        $('*[data-luval-action="edit"]').on('click', function () {
            var id = context.getSelectedId();
            if (!utils.isNullOrEmpty(id) && id > 0)
                window.location.href = '/' + modelVal.controllerName + '/Edit/' + id;
            else
                alert('Please select a row before clicking on edit');
        });
    }

    addDeleteFunc() {
        var modelVal = this.model;
        var context = this;
        $('*[data-luval-action="remove"]').on('click', function () {
            var id = context.getSelectedId();
            if (!utils.isNullOrEmpty(id) && id > 0) {
                var res = confirm("Are you sure you want to delete the selected record?");
                if (res) {
                    context.deleteRecord(id, function () {
                        window.location.href = '/' + modelVal.controllerName;
                    });
                }
            }
            else
                alert('Please select a row before clicking on delete');
        });
    }

    deleteRecord(id, onComplete) {
        var url = '/' + this.model.controllerName + '/Delete/' + id;
        $.ajax({
            method: 'POST',
            url: url
        }).done(function (msg) {
            onComplete(msg);
        });
    }

}

class modal {
    constructor(model) {
        this.model = model;
        forms.sanitizeModel(this.model, 'id', 'modal-dialog');
        forms.sanitizeModel(this.model, 'title', 'Dialog Title');
        forms.sanitizeModel(this.model, 'body', '<p>Dialog Body Goes Here</p>');
        forms.sanitizeModel(this.model, 'acceptText', 'Ok');
        forms.sanitizeModel(this.model, 'cancelText', 'Cancel');
    }

    renderModal(elementId) {
        var template = _.template(
            `
<div id="<%= id %>" class="modal" tabindex="-1" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title"><%= title %></h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <%= body %>
      </div>
      <div class="modal-footer">
        <button id="<%= id %>-accept-btn" type="button" class="btn btn-primary"><%= acceptText %></button>
        <button id="<%= id %>-cancel-btn"type="button" class="btn btn-secondary" data-dismiss="modal"><%= cancelText %></button>
      </div>
    </div>
  </div>
</div>
`
        );

        var el = document.getElementById(elementId);
        el.innerHTML = template(this.model);
    }
}