declare let httpRPC
declare let firebase;

class Services {
    service
    serviceRPC
    baseUrl

    token: string
    companyId: string
    user: string

    constructor(baseURL_) {
        console.info("--baseURL_:", baseURL_[1])
        this.baseUrl = baseURL_

        this.serviceRPC = new httpRPC(baseURL_[0], baseURL_[1], baseURL_[2])

    }
    createConfig() {
        this.serviceRPC.invoke('/setup', 'setup')
            .then((result) => {
                console.info('test api: ', result);
                return result;
            }).catch((error) => {
                console.info("--error:", error)
            })
    }
    deleteTables() {
        this.serviceRPC.invoke('/delete', 'delete')
            .then((result) => {
                console.info('test api: ', result);
                return result;
            }).catch((error) => {
                console.info("--error:", error)
            })
    }
}
