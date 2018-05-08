class projectHelper {
    constructor(formModel, resourceList, modalModel, onModalAccept) {
        this.formModel = formModel;
        this.resourceList = resourceList;
        this.modalModel = modalModel;
        this.onModalAccept = onModalAccept;
    }

    render() {
        var locFormModel = this.formModel;
        var builder = new forms(this.formModel);
        var listHelper = new tables(this.resourceList, []);
        var context = this;
        builder.render('render-div', function (data) {
            //on complete
            $('#' + locFormModel.id + '-commands').hide();

            listHelper.render('resource-div', function (data) {
                $('.table').DataTable({
                    searching: false, lengthChange:false
                });
                //on table complete
                var modalForm = new forms(context.modalModel);
                var modalHelper = new modal({
                    id: context.modalModel.id,
                    title: "Resource",
                    body: modalForm.renderFields()
                });
                modalHelper.renderModal('form-modal');
                context.buttonEvent();
            });
        });
    }

    extractModalData() {
        var obj = {};
        var inputs = $('#' + this.modalModel.id).find('input');
        for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i];
            obj[$(input).prop('name')] = $(input).val();
        }
        var selects = $('#' + this.modalModel.id).find('select');
        for (var i = 0; i < selects.length; i++) {
            var select = selects[i];
            obj[$(select).prop('name')] = $(select).val();
            obj[$(select).prop('name') + '_text'] = $(select).find('option:selected').text();
        }
        return obj;
    }

    buttonEvent() {
        var context = this;
        $('#resource-add').on('click', function () {
            $('#' + context.modalModel.id).modal('show');
        });
        $('#' + context.modalModel.id + '-accept-btn').on('click', function () {
            $('#' + context.modalModel.id).modal('hide');
            if (!utils.isNull(context.onModalAccept))
                context.onModalAccept(context);
        });
    }
}

class pipelineHelper {
    constructor() {
    }

    onModalAccept(project) {
        var data = project.extractModalData();
        var table = $('.table').DataTable();
        if (utils.isNull(this.resources))
            this.resources = [];
        this.resources.push({
            rowid: 1, Id: data['Id'], RankId: data['RankId'], PipelineId: data['PipelineId'], HourlyRate: data['HourlyRate'], hours: data['Hours']
        });
        table.row.add([
            data['RankId_text'],
            data['HourlyRate'], data['Hours']
        ]).draw(false);
    }

}