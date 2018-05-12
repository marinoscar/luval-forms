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
            hideCommands: true, getData: false, data: [],
            dataTables: { searching: false, lengthChange: false, ordering: false }
        });
        document.listBuilder = listHelper;
        var context = this;
        builder.render('render-div', function (data) {
            //on complete
            $('#' + locFormModel.id + '-commands').hide();

            listHelper.render('resource-div', function (data) {
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
        var rowid = this.pipeHelper.getMaxResourceCount();
        var data = project.extractModalData();

        document.resources.push({
            __RowId: rowid, Id: data['Id'], RankId: data['RankId'], RankIdText: data['RankId_text'], PipelineId: data['PipelineId'], HourlyRate: data['HourlyRate'], Hours: data['Hours']
        });

        var vals = this.pipeHelper.convertResourcesForTable();
        this.pipeHelper.addRowsToTable(vals);

        if (!utils.isNull(onComplete))
            onComplete();
    }

    convertResourcesForTable(){
        return _.map(document.resources, function (i) {
            return [i.RankIdText, i.HourlyRate, i.Hours]
        });
    }

    getMaxResourceCount() {
        var rowid = 1;
        if (utils.isNull(document.resources))
            document.resources = [];
        var max = _.max(document.resources, function (item) { if (!utils.isNull(item)) return item.__RowId; });
        if (max === -Infinity) rowid = 1;
        else rowid += max.__RowId;
        return rowid;
    }

    addRowsToTable(items) {
        var table = $('.table').DataTable();
        table.clear();
        table.rows.add(items);
        table.draw();
        this.calculateSummary();
    }

    calculateSummary(){
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
        var margin = (1-(totalCost / total)) * 100;
        var erp = (total / totalStandardBillRate) * 100;
        $('#pipe-summary-totalamount').val(total.toFixed(2));
        $('#pipe-summary-margin').val(margin.toFixed(2));
        $('#pipe-summary-erp').val(erp.toFixed(2));
    }

    deleteSelectedRow() {
        var index = document.listBuilder.getSelectedRowElementIndex();
        if(utils.isNullOrEmpty(index) || index < 0) {
            alert('Please select a row to delete');
            return;
        }
        if(!confirm('Are you sure you want to delete the selected row')) return;
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