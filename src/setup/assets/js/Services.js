var Services = (function () {
    function Services(baseURL_) {
        console.info("--baseURL_:", baseURL_[1]);
        this.baseUrl = baseURL_;
        this.serviceRPC = new httpRPC(baseURL_[0], baseURL_[1], baseURL_[2]);
    }
    Services.prototype.createConfig = function () {
        this.serviceRPC.invoke('/setup', 'setup')
            .then(function (result) {
            console.info('test api: ', result);
            return result;
        }).catch(function (error) {
            console.info("--error:", error);
        });
    };
    Services.prototype.deleteTables = function () {
        this.serviceRPC.invoke('/delete', 'delete')
            .then(function (result) {
            console.info('test api: ', result);
            return result;
        }).catch(function (error) {
            console.info("--error:", error);
        });
    };
    return Services;
}());
