class BindSetup {
    constructor() {
        this.services = new Services(['http', 'localhost', '9081'])
    }

    createConfig(form) {
        console.info("--form:", form)
        let serialised = $(form).serializeArray();
        console.info("--serialised:", serialised)
        this.services.createConfig(serialised)
    }

    deleteTable() {
        this.services.deleteTables()
    }
}