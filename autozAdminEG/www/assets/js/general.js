class Editors {
    constructor(apiService) {
        this.drawTable = this.drawTable.bind(this);
        this.save = this.save.bind(this);
        this.remove = this.remove.bind(this);
        this.apiService = apiService;
        this.table = null;
    }
    drawTable() {
        // render editors table
        this.apiService.getEditorsList()
            .then(editors => {
                this.table = new Tabulator("#editors-table", {
                    data:editors.data,      // assign data to table
                    layout:"fitColumns",    // fit columns to width of table
                    columns:[               // Define Table Columns
                        {title:"id", field:"id", visible:false},
                        {title:"Email", field:"email", align:"left"},
                        {title:"Name", field:"name", align:"left"}
                    ],
                    rowClick:function(e, row){ // fill the form fields
                        var row = row.getData();
                        window.rowUid = row.id;
                        $('input[name="name"]').val(row.name);
                        $('input[name="email"]').val(row.email);

                        $('html, body').animate({ // scroll to form
                            scrollTop: $("#editor-form").offset().top
                        }, 500);
                    },
                });

            })
            .then(this.initActionButtons);
    }

    // add & edit user
    save(id) {
        let password = $("#editor-form input[name='password']").val();
        let email = $("#editor-form input[name='email']").val();
        let name = $("#editor-form input[name='name']").val();
        if (id) { // edit user
            return this.apiService.editEditor(id, name)
                .then(() => {
                    console.log('user was successfully updated');
                    $('.notification').removeClass('d-hide').text('user was successfully updated');
                    setTimeout(function() {
                        $('.notification').addClass('d-hide').text('');
                    }, 10000);
                    // table refresh
                    this.table
                        .updateOrAddData([{id:documentRef.data.id ,email: email, name: name}])
                        .then(function(){
                            console.log('table updated');
                        })
                        .catch(function(error){
                            console.log('unable update table', error);
                        });
                });
        } else { // add user
            return this.apiService.addEditor(name, email, password)
                .then((documentRef) => {
                    console.log('new user was created', documentRef.data.id);
                    $('.notification').removeClass('d-hide').text('new user was created');
                    setTimeout(function() {
                        $('.notification').addClass('d-hide').text('');
                    }, 10000);
                    // table refresh
                    this.table
                        .updateOrAddData([{id:documentRef.data.id ,email: email, name: name}])
                        .then(function(){
                            console.log('table updated');
                        })
                        .catch(function(error){
                            console.log('unable update table', error);
                        });
                })
                .catch(err => {
                    if (typeof err.response.data.error !== 'undefined') {
                        alert("Unable to create user: " + err.response.data.error);
                    }
                    console.log('err: ', err);
                    $('.notification').removeClass('d-hide').addClass('error-msg').text('an error occured, user wasn\'t created', err);
                    setTimeout(function() {
                        $('.notification').addClass('d-hide').removeClass('error-msg').text('');
                    }, 10000);
                });
        }
    }

    remove(id) {
        return this.apiService.deleteEmployee(id)
            .then(function () {
                console.log('deleted...')
            })
            .then(function () {
                window.location.reload();
            })
            .catch(function (e) {
                alert('Unable to delete user: ' + e);
            });
    }
}

// admin basic auth
function getApiService() {
    let username = sessionStorage.getItem('username');
    let password = sessionStorage.getItem('password');
    if ((username === null || password === null) &&
        window.location.pathname !== '/'
    ) {
        console.log('unauthorized, redirecting to login page');
        window.location = '/';
    } else {
        return new ApiService(username, password);
    }
}