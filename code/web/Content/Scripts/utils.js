class utils {
    static isNull(item) {
        return (typeof (item) === 'undefined' || item === null)
    }

    static isNullOrEmpty(item) {
        return (utils.isNull(item) || item === '');
    }

    static arrayToFormCollection(array) {
        var obj = {};
        for (var i = 0; i < array.length; i++) {
            var item = array[i];
            var keys = Object.keys(item);
            for (var j = 0; j < keys.length; j++) {
                var key = keys[j];
                var name = key + '[' + i + ']';
                obj[name] = item[key];
            }
        }
        return obj;
    }

    static extractInputData(rootElementId) {
        var obj = {};
        var inputs = utils.getAllInputs(rootElementId);
        for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i];

            if ($(input).is('textarea')) obj[$(input).prop('name')] = $(input).text();
            else obj[$(input).prop('name')] = $(input).val();

            if ($(input).is('select'))
                obj['-' + $(input).prop('name') + '-Text'] = $(input).find('option:selected').text();
        }
        return obj;
    }

    static clearAllInputs(rootElementId) {
        var inputs = utils.getAllInputs(rootElementId);
        for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i];
            if ($(input).is('textarea')) $(input).text('');
            else if($(input).prop('type') != 'hidden') $(input).val('');
        }
    }

    static getAllInputs(rootElementId) {
        return $('#' + rootElementId).find('input, textarea, select');
    }
}