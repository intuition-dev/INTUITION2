/**
 * Version v4.2
 * 
 * All rights reserved by Metabake (Metabake.org), licensed under LGPL 3.0
 *
*/

/**
* CRUD users for Editors App
*/
class AdminWebAdmin {
    /**
    * @param username user name
    * @param password user password
    */
    constructor(username, password) {

        this.serviceRpc = new httpRPC(rpcProtocol, rpcHost, rpcPort);
        this.serviceRpc.setUser(username, password);
        
    }

    /**
    * get data for editors table
    */
    getEditorsList() {
        return this.serviceRpc.invoke('/auth/editors', 'get', {});
    }

    /**
    * add new user
    * @param name user name, eg: 'Jane Doe'
    * @param email user email, eg: 'example@example.com'
    * @param password user password, eg: 'dfgsdgdsfg' 
    */
    addEditor(name, email, password) {
        return this.serviceRpc.invoke('/auth/editors-add', 'post', {
            name: name,
            email: email,
            password: password
        });
    }

    /**
    * edit user name
    * @param uid user id, eg: 'I3fE7p5NjtV1Y1m5pWBsZlyi4W62'
    * @param name user name, eg: 'Jane Doe'
    */
    editEditor(uid, name) {
        return this.serviceRpc.invoke('/auth/editors-edit', 'put', {
            name: name,
            uid: uid
        });
    }

    /**
    * remove user 
    * @param uid user id, eg: 'I3fE7p5NjtV1Y1m5pWBsZlyi4W62'
    */
    deleteEditor(uid) {
        return this.serviceRpc.invoke('/auth/editors-delete', 'delete', {
            // params: {
                uid: uid
            // }
        });
    }

}