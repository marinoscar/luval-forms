class forms {
    constructor(model) {
        this.model = model;
        forms.sanitizeModel(this.model, 'action', '/');
        forms.sanitizeModel(this.model, 'method', 'post');
        forms.sanitizeModel(this.model, 'title');
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

    renderForm() {
        var formFields = this.renderFields();
        var commands = this.renderCommands();
        var template = _.template(
            `<form id="<%= id %>" method:"<%= method %>" action="<%= action %>" >
                <%= formFields %>
                <%= commands %>
            </form >`
        );
        var result = template(
            {
                id: this.model.id,
                method: this.model.method,
                action: this.model.action,
                formFields: formFields,
                commands: commands,
            }
        );
        return result;
    }

    renderCommands() {
        forms.sanitizeModel(this.model, 'commands', []);
        var result = '';
        for (var i = 0; i < this.model.commands.length; i++) {
            var command = this.model.commands[i];
            forms.sanitizeModel(command, 'type', 'submit');
            forms.sanitizeModel(command, 'classType', 'primary');
            forms.sanitizeModel(command, 'text', 'Submit');
            var template = _.template(`<button type="<%= type %>" class="btn btn-<%= classType %>"><%= text %></button>`);
            result += template(command);
        }
        return result;
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
            `<textarea class="form-control" id="<%= id %>" rows="<%= rows %>"></textarea>`
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
            if (item.value == field.value)
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

class lists {
    constructor(model, list) {
        this.model = model;
        this.list = list;
        forms.sanitizeModel(this.model, "keyColumnName", "Id");
        forms.sanitizeModel(this.model, "commands", []);
        forms.sanitizeModel(this.model, "columns", []);
        forms.sanitizeModel(this.model, "id", "table-0001");
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
            <table id="<%= id %>" class="table" data-table-luval="true" data-column-key="<%= keyColumnName %>">
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
            if (typeof (cellValue) == 'undefined' || cellValue == null)
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
        if (isVisible == "false")
            result = 'style="display:none;"';
        return result;
    }

}