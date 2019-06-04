class BindSetup {
    constructor() {
        this.services = new Services(['http', 'localhost', '3100'])
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