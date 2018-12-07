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
                        $('input[name="name"]').val(row.name);
                        $('input[name="email"]').val(row.email);

                        $('html, body').animate({ // scroll to form
                            scrollTop: $("#editor-form").offset().top
                        }, 500);
                    },
                });


                // $('#employees-table').DataTable({
                //     data: employees.data,
                //     select: true,
                //     createdRow: function (row, data, dataIndex) {
                //         $(row).find('#btn-remove').on('click', function (ev) {
                //             ev.preventDefault();
                //             $(this).attr("disabled", "disabled");
                //             _this
                //                 .remove(data.id) //update project with active flag
                //                 .then(() => $(this).removeAttr("disabled"));
                //         });
                //         $(row).find('#btn-edit').on('click', function (ev) {
                //             ev.preventDefault();
                //             $(this).attr("disabled", "disabled");
                //             _this
                //                 .edit(data.id) //update project with active flag
                //                 .then(() => $(this).removeAttr("disabled"));
                //         });
                //     },
                //     rowId: function (doc) {
                //         return doc.id;
                //     },
                //     columns: [{
                //         title: 'Email',
                //         className: 'email',
                //         data: function (doc) {
                //             return doc.email || '';
                //         }
                //     }, {
                //         title: 'Name',
                //         className: 'name',
                //         data: function (doc) {
                //             return doc.name || '';
                //         }
                //     }, {
                //         title: '',
                //         className: 'actions',
                //         data: function (doc) {
                //             return '<div class="btn-row end"><a id="edit-employee" class="edit-company-link btn-secondary thin btn" href="/auth/employees/employee-edit/?company=' + companyId + '&button=edit&name=' + doc.name + '&email=' + doc.email + '&employee=' + doc.id + '&companyname=' + companyName+ '">Edit</a><a id="btn-remove" class="remove-company-link btn-secondary thin btn" href="#">Remove</a></div>';
                //         }
                //     }]
                // });
            })
            .then(this.initActionButtons);
    }

    // add & edit user
    save(id) {
        let password = $("#editor-form input[name='password']").val();
        let email = $("#editor-form input[name='email']").val();
        let name = $("#editor-form input[name='name']").val();
        if (id) { // edit user
            return this.apiService.editEditor(id)
                .then(() => {
                    console.log('user was successfully updated');
                    alert('user was successfully updated'); // TODO add notification msg instead
                    // TODO add table refresh
                });
        } else { // add user
            return this.apiService.addEditor(name, email, password)
                .then((documentRef) => {
                    console.log('new user was created', documentRef.data.id);
                    alert('new user was created'); // TODO add notification msg instead
                    // TODO add table refresh
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
                    alert('an error occured, user wasn\'t created', err); // TODO add notification msg instead
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