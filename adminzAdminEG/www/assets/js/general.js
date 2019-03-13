class Editors {
    constructor(apiService) {
        this.drawTable = this.drawTable.bind(this);
        this.save = this.save.bind(this);
        this.remove = this.remove.bind(this);
        this.apiService = apiService;
        this.table = null;
        this.activeRow = null;
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
                    rowClick:(e, row) => { // fill the form fields
                        this.activeRow = row;
                        var row = row.getData();
                        window.rowUid = row.id;
                        $('input[name="name"]').val(row.name);

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
                .then((documentRef) => {
                    $('.notification').removeClass('d-hide').text('user was successfully updated');
                    setTimeout(function() {
                        $('.notification').addClass('d-hide').text('');
                    }, 4000);
                    $('html, body').animate({ // scroll to form
                        scrollTop: $("#editor-form").offset().top
                    }, 500);
                    // table refresh
                    this.table
                        .updateOrAddData([{id:documentRef.data.id , name: name}])
                        .then(function(){
                            console.info('table updated');
                        })
                        .catch(function(error){
                            console.info('unable update table', error);
                        });
                });
        } else { // add user
            return this.apiService.addEditor(name, email, password)
                .then((documentRef) => {
                    $('.notification').removeClass('d-hide').text('new user was created');
                    setTimeout(function() {
                        $('.notification').addClass('d-hide').text('');
                    }, 4000);
                    $('html, body').animate({ // scroll to form
                        scrollTop: $("#editor-form").offset().top
                    }, 500);
                    // table refresh
                    this.table
                        .updateOrAddData([{id:documentRef.data.id ,email: email, name: name}])
                        .then(function(){
                            console.info('table updated');
                        })
                        .catch(function(error){
                            console.info('unable update table', error);
                        });
                })
                .catch(err => {
                    if (typeof err.response.data.error !== 'undefined') {
                        alert("Unable to create user: " + err.response.data.error);
                    }
                    console.info('err: ', err);
                    $('.notification').removeClass('d-hide').addClass('error-msg').text('an error occured, user wasn\'t created', err);
                    setTimeout(function() {
                        $('.notification').addClass('d-hide').removeClass('error-msg').text('');
                    }, 4000);
                });
        }
    }

    remove(id) {
        return this.apiService.deleteEditor(id)
            .then(() => {
                $('.notification').removeClass('d-hide').text(' The user was successfully deleted');
                setTimeout(function() {
                    $('.notification').addClass('d-hide').text('');
                }, 4000);
                $('html, body').animate({ // scroll to form
                    scrollTop: $("#editor-form").offset().top
                }, 500);
                // table refresh
                this.activeRow.delete()
                    .then(function(){
                        console.info('table updated');
                    })
                    .catch(function(error){
                        console.info('unable update table', error);
                    });
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
        console.info('unauthorized, redirecting to login page');
        window.location = '/';
    } else {
        return new ApiService(username, password);
    }
}