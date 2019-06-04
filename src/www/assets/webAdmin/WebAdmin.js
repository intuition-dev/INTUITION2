/**
     * 
     * All rights reserved by Metabake (Metabake.org), licensed under LGPL 3.0
     *
*/

/**
* CRUD .md files and post creation from blog mounted app
*/
class WebAdmin {

    /**
    * @param apiProtocol api protocol (example: http)
    * @param apiHost api host (example: 0.0.0.0)
    * @param apiPort api port (example: 9081)
    */
    constructor(apiProtocol, apiHost, apiPort) {
        console.info("--apiPort:", apiPort)
        console.info("--apiHost:", apiHost)
        console.info("--apiProtocol:", apiProtocol)

        this.serviceRPC = new httpRPC(apiProtocol, apiHost, apiPort);

        // this.token = sessionStorage.getItem('idToken');

        // if (this.token === null) {
        //     auth
        //         .signOut()
        //         .then(function () {
        //             if (window.location.pathname !== '/' && window.location.pathname !== '') {
        //                 window.location = ('/');
        //             }
        //         }).catch(function (error) {
        //             console.info('Something went wrong:', error);
        //         });
        // }

    }

    checkEditor(email, pass) {
        let _this = this
        return this.serviceRpc.invoke('/api/editors/checkEditor', 'check-editor', { editor_email: email, editor_pass: pass })
            .then(function () {
                _this.serviceRpc.setUser(email, pass);
                return true
            })
    }

    /**
    * get list of directories
    *  @param token Firebase authentication token
    */
    getDirsList() {
        return this.serviceRPC.invoke('/api/editors/posts', 'get', {
            // 'fb-auth-token': this.token
            editor_email: window.sessionStorage.getItem('username'), editor_pass: window.sessionStorage.getItem('pass')
        });
    }

    /**
    * get directories' subdirectories list
    * @param id path to post, eg: 'blog/post-2'
    * @param token Firebase authentication token
    */
    getSubDirsList(id) {
        return this.serviceRPC.invoke('/api/editors/files', 'get', {
            post_id: id,
            // 'fb-auth-token': this.token,
            editor_email: window.sessionStorage.getItem('username'), editor_pass: window.sessionStorage.getItem('pass')
        });
    }

    /**
    * get files
    * @param id file name, eg: '/title.md'
    * @param pathPrefix path to file, eg: 'blog/post-4'
    * @param token Firebase authentication token
    */
    getPostMd(id, pathPrefix) {
        return this.serviceRPC.invoke('/api/editors/post-get', 'get', {
            post_id: id,
            pathPrefix: pathPrefix,
            editor_email: window.sessionStorage.getItem('username'), editor_pass: window.sessionStorage.getItem('pass')
            // 'fb-auth-token': this.token
        });
    }

    /**
    * save file and run mbake
    * @param id file name, eg: '/title.md'
    * @param md file content, eg: '###### Lorem ipsum dd dolor sit {.title}'
    * @param pathPrefix path to file, eg: 'blog/post-4'
    * @param token Firebase authentication token
    */
    savePostMd(id, md, pathPrefix) {
        return this.serviceRPC.invoke('/api/editors/post-put', 'put', {
            post_id: id,
            pathPrefix: pathPrefix,
            content: btoa(md),
            editor_email: window.sessionStorage.getItem('username'), editor_pass: window.sessionStorage.getItem('pass')
            // 'fb-auth-token': this.token
        });
    }

    /**
    * run mbake
    * @param id file name, eg: '/title.md'
    * @param md file content, eg: '###### Lorem ipsum dd dolor sit {.title}'
    * @param pathPrefix path to file, eg: 'blog/post-4'
    * @param token Firebase authentication token
    */
    build(id, md, pathPrefix) {
        return this.serviceRPC.invoke('/api/editors/post-build', 'put', {
            post_id: id,
            pathPrefix: pathPrefix,
            content: btoa(md),
            editor_email: window.sessionStorage.getItem('username'), editor_pass: window.sessionStorage.getItem('pass')
            // 'fb-auth-token': this.token
        }).then(function (response) {
            return response;
        }).catch(function (error) {
            return error;
        });
    }

    /**
    * clone page
    * @param id new page folder name, eg: 'post-cpv'
    * @param pathPrefix path to file, eg: 'blog/post-4'
    * @param token Firebase authentication token
    */
    createPost(id, pathPrefix) {
        return this.serviceRPC.invoke('/api/editors/new-post', 'post', {
            post_id: id,
            pathPrefix: pathPrefix,
            editor_email: window.sessionStorage.getItem('username'), editor_pass: window.sessionStorage.getItem('pass')
            // 'fb-auth-token': this.token
        });
    }

    /**
    * file upload
    * @param data FormData
    * @param pathPrefix path to file, eg: 'blog/post-4'
    * @param token Firebase authentication token
    */
    // TODO formData file upload
    upload(data, pathPrefix) {
        return this.serviceRPC.invoke('/api/editors/upload', 'post', {
            pathPrefix: pathPrefix,
            fileupload: data,
            editor_email: window.sessionStorage.getItem('username'), editor_pass: window.sessionStorage.getItem('pass')
            // 'fb-auth-token': this.token
        })
            .then(function (response) {
                console.info(response);
            })
            .catch(function (error) {
                console.info(error);
            });
    }

    /**
    * set publishDate field to dat.yaml
    * @param publish_date epoch date format, eg: '1602288000'
    * @param pathPrefix post path file, eg: 'blog/post-4'
    * @param token Firebase authentication token
    */
    setPublishDate(publish_date, pathPrefix) {
        return this.serviceRPC.invoke('/api/editors/set-publish-date', 'put', {
            publish_date: publish_date,
            post_id: pathPrefix,
            editor_email: window.sessionStorage.getItem('username'), editor_pass: window.sessionStorage.getItem('pass')
            // 'fb-auth-token': this.token
        });
    }

    /**
    * get mbake version
    * @param token Firebase authentication token
    */
    getMbakeVersion() {
        return this.serviceRPC
            .invoke('/api/editors/mbake-version', 'get', {
                editor_email: window.sessionStorage.getItem('username'), editor_pass: window.sessionStorage.getItem('pass')
                // 'fb-auth-token': this.token
            })
            .then(function (response) {
                console.info('Base.js mbake version:', response);
            });
    }

}