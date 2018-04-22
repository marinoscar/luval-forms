class forms {
    constructor(model) {
        this.model = model;
        forms.sanitizeModel(this.model, 'action', '/');
        forms.sanitizeModel(this.model, 'method', 'post');
        forms.sanitizeModel(this.model, 'title');
    }

    static sanitizeModel(model, attribute, defaultValue) {
        if (typeof (defaultValue) == 'undefined' || defaultValue == null)
            defaultValue = "";

        if (typeof (model[attribute]) == 'undefined' || model[attribute] == null)
            model[attribute] = defaultValue;
    }

    sanitizeFields() {
        for (var i = 0, len = this.model.fields.length; i < len; i++) {
            forms.sanitizeModel(this.model.fields[i], 'help');
            forms.sanitizeModel(this.model.fields[i], 'value');
            forms.sanitizeModel(this.model.fields[i], 'placeholder');
            forms.sanitizeModel(this.model.fields[i], 'attributes', []);
        }
    }

    render(elementId) {
        var el = document.getElementById(elementId);
        var form = this.renderForm();
        el.innerHTML = form;
    }

    renderForm() {
        var formBody = this.renderFields();
        var template = _.template(
            `<form id="<%= id %>" method:"<%= method %>" action="<%= action %>" >
                <%= formBody %>
            </form >`
        );
        var result = template({ id: this.model.id, method: this.model.method, action: this.model.action, formBody: formBody });
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
        if (typeof (field.help) != 'undefined' && field.help != null)
            helpElement = this.renderHelpElement(fieldId, field);

        field["fieldId"] = fieldId;
        switch (field.type) {
            case "select":
                field["input"] = this.renderSelect(fieldId, field);
                break;
            default:
                field["input"] = this.renderInput(fieldId, helpElement, field);
        }
        field["helpElement"] = helpElement;

        var template = _.template(
            `
            <div data-row="<%= row %>" class="form-group">
                <label for="<%= fieldId %>"><%= label %></label>
                <%= input %>
                <%= helpElement %>
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
        if (typeof (helpElementTag) != 'undefined' && helpElementTag != null)
            field["helpElementTag"] = 'aria-describedby="' + fieldId + '-help"';
        var result = template(field);
        return result;
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