class projectHelper {
    constructor(formModel, resourceList, modalModel) {
        this.formModel = formModel;
        this.resourceList = resourceList;
        this.modalModel = modalModel;
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
                    title: "Resource",
                    body: modalForm.renderFields()
                });
                modalHelper.renderModal('form-modal');
                context.buttonEvent();
            });
        });
    }

    buttonEvent() {
        $('#resource-add').on('click', function () {
            $('.modal').modal('show');
        });
    }
}