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
        for (var i = 0, len = this.model.fields.length; i < len; i++) {
            forms.sanitizeModel(this.model.fields[i], 'help');
            forms.sanitizeModel(this.model.fields[i], 'value');
            forms.sanitizeModel(this.model.fields[i], 'placeholder');
            forms.sanitizeModel(this.model.fields[i], 'attributes', []);
            forms.sanitizeModel(this.model.fields[i], 'row', 1);
        }
    }

    render(elementId, onComplete) {
        var el = document.getElementById(elementId);
        var form = this.renderForm();
        el.innerHTML = form;
        if (!utils.isNull(onComplete))
            onComplete(el);
    }

    loadValues(id) {
        var url = '/' + this.model.controllerName + '/GetEntity/' + id;
        var context = this;
        $.getJSON(url, function (data) {
            for (var i = 0; i < context.model.fields.length; i++) {
                var field = context.model.fields[i];
                var value = '';

                if (!utils.isNullOrEmpty(data[field.name]))
                    value = data[field.name];
                $('#' + field.fieldId).val(value);
            }
        });
    }

    renderForm() {
        var formFields = this.renderFields();
        var commands = this.renderCommands();
        var template = _.template(
            `<form id="<%= id %>" method="<%= method %>" action="<%= action %>" >
                <%= formFields %>
                <%= commands %>
            </form >`
        );
        var action = '/' + this.model.controllerName + '/Create'
        if (this.model.isEditMode)
            action = '/' + this.model.controllerName + '/Edit'
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
            `
                <button type="submit" class="btn btn-primary"><%= text %></button>
            `
        );
        return template({ text: "Submit" })
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
        var fieldId = formId + "-" + field.id;
        var helpElement = null;
        if (!utils.isNull(field.help))
            helpElement = this.renderHelpElement(fieldId, field);

        field["fieldId"] = fieldId;
        switch (field.type) {
            case "hidden":
                return this.renderHidden(fieldId, field);
            case "textarea":
                field["input"] = this.renderTextArea(fieldId, field);
                break;
            case "select":
                field["input"] = this.renderSelect(fieldId, field);
                break;
            default:
                field["input"] = this.renderInput(fieldId, helpElement, field);
        }
        field["helpElement"] = helpElement;
        field["colClass"] = "col-md-12";
        var template = _.template(
            `
            <div class="form-row">
                <div data-row="<%= row %>" class="form-group <%= colClass %>">
                    <label for="<%= fieldId %>"><%= label %></label>
                    <%= input %>
                    <%= helpElement %>
                </div>
            </div>
            `
        );
        var result = template(field);
        return result;
    }

    renderInput(fieldId, helpElementTag, field) {
        var template = _.template(
            `
            <input class="form-control" id="<%= fieldId %>" name="<%= name %>" type="<%= type %>" value="<%= value %>" <% helpElementTag %> placeholder="<%= placeholder %>">
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
            <select class="form-control" id="<%= fieldId %>" name="<%= name %>">
                <%= options %>
            </select>
            `
        );
        var options = '';
        for (var i = 0; i < field.items.length; i++) {
            var item = field.items[i];
            forms.sanitizeModel(item, 'text');
            forms.sanitizeModel(item, 'value');
            var selected = '';
            if (item.value === field.value)
                selected = "selected";
            options += '<option ' + selected + ' value="' + item.value + '">' + item.text + '</option>\n';
        }
        var result = template({ fieldId: fieldId, name: field.name, options: options });
        return result;
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
        //forms.sanitizeModel(this.model, "commands", []);
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
    constructor(model) {
        this.model = model;
    }

    render(elementId, onComplete) {
        var el = document.getElementById(elementId);
        var template = _.template(
            `
            <div class="row">
                <div class="col-md-12">
                    <%= table %>
                </div>
            </div>
            <div class="row">
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

        var localModel = this.model;
        var context = this;
        this.getData(function (data) {
            var table = new tables(localModel, data).renderTable();
            el.innerHTML = template({ table: table });
            $('#' + localModel.id).DataTable();

            //attach other events
            context.attachEvents();
            if (!utils.isNull(onComplete)) {
                onComplete(el);
            }
        });
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
        var el = $('#' + this.model.id + ' tbody .table-active');
        if (utils.isNull(el)) return 0;
        return el.data('row-key');
    }

    getData(onComplete) {
        $.getJSON('/' + this.model.controllerName + '/ListAll', function (data) {
            onComplete(data)
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
                        window.location.href = '/' + modelVal.controllerName
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