class utils {
    static isNull(item) {
        return (typeof (item) === 'undefined' || item === null)
    }

    static isNullOrEmpty(item) {
        return (utils.isNull(item) || item === '');
    }
}