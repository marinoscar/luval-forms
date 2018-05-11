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
        var listHelper = new listBuilder(this.resourceList, {
            hideCommands: true, getData: false, data: []
        });
        var context = this;
        builder.render('render-div', function (data) {
            //on complete
            $('#' + locFormModel.id + '-commands').hide();

            listHelper.render('resource-div', function (data) {
                $('.table').DataTable({
                    searching: false, lengthChange: false
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
        var inputs = $('#' + this.modalModel.id).find('input, textarea, select');
        for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i];
            obj[$(input).prop('name')] = $(input).val();
            if ($(input).is('select'))
                obj[$(input).prop('name') + '_text'] = $(input).find('option:selected').text();
        }
        return obj;
    }

    cleanModal() {
        $('#' + this.modalModel.id).find('input, textarea, select').val('');
    }

    buttonEvent() {
        var context = this;
        $('#resource-add').on('click', function () {
            $('#' + context.modalModel.id).modal('show');
        });
        $('#' + context.modalModel.id + '-accept-btn').on('click', function () {
            $('#' + context.modalModel.id).modal('hide');
            if (!utils.isNull(context.onModalAccept))
                context.onModalAccept(context, function () {
                    context.cleanModal();
                });
            else
                context.cleanModal();
        });
    }
}

class pipelineHelper {
    constructor() {
    }

    renderSummary(elementId) {
        var element = document.getElementById(elementId);
        var builder = new forms(pipeSummary);
        element.innerHTML = builder.renderFields();
    }

    onModalAccept(project, onComplete) {
        var rowid = 1;
        var data = project.extractModalData();
        var table = $('.table').DataTable();
        if (utils.isNull(this.resources))
            this.resources = [];
        var max = _.max(this.resources, function (item) { if (!utils.isNull(item)) return item.__RowId; });
        if (max === -Infinity) rowid = 1;
        else rowid += max.__RowId;
        this.resources.push({
            __RowId: rowid, Id: data['Id'], RankId: data['RankId'], PipelineId: data['PipelineId'], HourlyRate: data['HourlyRate'], hours: data['Hours']
        });
        table.row.add([
            data['RankId_text'],
            data['HourlyRate'], data['Hours']
        ]).draw(false);
        if (!utils.isNull(onComplete))
            onComplete();
    }

    initialize(onComplete) {
        var context = this;
        this.loadAllRanks(onComplete);
        $('#pipeline-resource-model-form-rankid').on('change', function (e) {
            var val = this.value;
            var item = _.find(context.ranks, function (i) {
                i.Id == Number(val);
            });
            if (utils.isNullOrEmpty(item)) return;
            $('#pipeline-resource-model-form-hourlyrate').val(item.BillRate);
        });
    }

    loadAllRanks(onComplete) {
        var context = this;
        $.getJSON('/Pipeline/GetAllRanks', function (data) {
            context.ranks = data;
            if (!utils.isNull(onComplete))
                onComplete(data);
        });
    }

}