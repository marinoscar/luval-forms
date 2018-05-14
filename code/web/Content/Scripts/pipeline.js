class projectHelper {
    constructor(formModel, resourceList, modalModel, onModalAccept) {
        this.formModel = formModel;
        this.resourceList = resourceList;
        this.modalModel = modalModel;
        this.onModalAccept = onModalAccept;
    }

    render(id) {
        var builder = new forms(this.formModel);
        var listHelper = new listBuilder(this.resourceList, {
            hideCommands: true, getData: false, data: [],
            dataTables: { searching: false, lengthChange: false, ordering: false }
        });
        document.listBuilder = listHelper;
        var context = this;
        if (utils.isNullOrEmpty(id)) {
            builder.render('render-div', function (data) {
                //on complete
                conte.whenRenderComplete(context);
            });
        }
        else {
            builder.renderWithData('render-div', id, function (data) {
                //on complete
                context.whenRenderComplete(context);
                if (!utils.isNullOrEmpty(data["record"]) && !utils.isNullOrEmpty(data["record"]["-ResourceArray"])) {
                    document.resources = data["record"]["-ResourceArray"];
                    var first = _.first(document.resources);
                    if (!utils.isNullOrEmpty(first)) {
                        document.PipelineId = Number(first["PipelineId"]);
                        var localContext = context;
                        context.pipeHelper.loadAllRanks(function(ranks){
                           localContext.pipeHelper.refreshTable(); 
                        });
                    }
                }
            });
        }
    }

    whenRenderComplete(context) {
        $('#' + context.formModel.id + '-commands').hide();
        document.listBuilder.render('resource-div', function (data) {
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
    }

    extractModalData() {
        var obj = utils.extractInputData(this.modalModel.id);
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

    onSubmit() {
        var formData = utils.extractInputData('pipeline-form');
        var arrayData = utils.arrayToFormCollection(document.resources);
        var data = _.extend(formData, arrayData);
        var url = '';
        if (this.isEdit) url = '/Pipeline/Edit';
        else url = url
        $.ajax({
            url: url,
            method: 'POST',
            data: data,
            success: function (data, status, jqxhr) {
                console.log('Pipeline status: ' + status);
                location.href = '/Pipeline/'
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('Status: ' + textStatus + ' Error: ' + errorThrown);
                alert('Failed to process transaction ' + errorThrown);
            }
        });
    }

    renderSummary(elementId) {
        var element = document.getElementById(elementId);
        var builder = new forms(pipeSummary);
        element.innerHTML = builder.renderFields();
        $('#pipe-summary-div').find('input').prop('readonly', true);
    }

    onModalAccept(project, onComplete) {
        var rowid = this.pipeHelper.getMaxResourceCount();
        var data = project.extractModalData();
        var pipelineId = 0;
        if (!utils.isNullOrEmpty(document.PipelineId))
            pipelineId = document.PipelineId;
        document.resources.push({
            "-RowId": rowid, Id: data['Id'], RankId: data['RankId'], RankIdText: data['-RankId-Text'], PipelineId: pipelineId, HourlyRate: data['HourlyRate'], Hours: data['Hours']
        });

        this.pipeHelper.refreshTable();

        if (!utils.isNull(onComplete))
            onComplete();
    }

    refreshTable() {
        var vals = this.convertResourcesForTable();
        this.addRowsToTable(vals);
    }

    convertResourcesForTable() {
        return _.map(document.resources, function (i) {
            return [i.RankIdText, i.HourlyRate, i.Hours]
        });
    }

    getMaxResourceCount() {
        var rowid = 1;
        if (utils.isNull(document.resources))
            document.resources = [];
        var max = _.max(document.resources, function (item) { if (!utils.isNull(item)) return item['-RowId']; });
        if (max === -Infinity) rowid = 1;
        else rowid += max['-RowId'];
        return rowid;
    }

    addRowsToTable(items) {
        var table = $('.table').DataTable();
        table.clear();
        table.rows.add(items);
        table.draw();
        this.calculateSummary();
    }

    calculateSummary() {
        var res = document.resources;
        var total = 0;
        var totalStandardBillRate = 0;
        var totalCost = 0;
        var hours = 0;
        for (var i = 0; i < res.length; i++) {
            var item = res[i];
            var rank = _.find(this.ranks, function (r) {
                return r.Id === Number(item.RankId);
            });
            total += item.HourlyRate * item.Hours;
            totalStandardBillRate += rank.StandardBillRate * item.Hours;
            totalCost += rank.CostRate * item.Hours;
            hours += item.Hours;
        }
        var margin = (1 - (totalCost / total)) * 100;
        var erp = (total / totalStandardBillRate) * 100;
        var formattedTotal = numeral(total).format('0,0.00');
        $('#pipe-summary-totalamount').val(formattedTotal);
        $('#pipe-summary-margin').val(margin.toFixed(2));
        $('#pipe-summary-erp').val(erp.toFixed(2));
        var formData = utils.arrayToFormCollection(document.resources);
    }

    deleteSelectedRow() {
        var index = document.listBuilder.getSelectedRowElementIndex();
        if (utils.isNullOrEmpty(index) || index < 0) {
            alert('Please select a row to delete');
            return;
        }
        if (!confirm('Are you sure you want to delete the selected row')) return;
        document.resources.splice(index, 1);
        var vals = this.convertResourcesForTable();
        this.addRowsToTable(vals);
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
        $('#resource-remove').on('click', function (e) {
            context.deleteSelectedRow();
        });
        $('#command-submit').on('click', function (e) {
            context.onSubmit();
        });
        $('#command-cancel').on('click', function (e) {
            if (!confirm('Are you sure you want to cancel?')) return;
            location.href = '/Pipeline/';
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