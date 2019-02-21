/**
 * Version v1.0
*/

/**
* CRUD .md files and post creation from blog mounted app
*/
class ApiService {

    /**
    * @param baseURL_ base api url (example: http://0.0.0.0:3030/)
    */
    constructor(baseURL_) {
        let token = sessionStorage.getItem('idToken');
        if (token === null) {
            auth
                .signOut()
                .then(function() {
                    if (window.location.pathname !== '/' && window.location.pathname !== '') {
                        window.location = ('/');
                    }
                }).catch(function(error) {
                    alert('An error happened.');
                    console.info('Something went wrong:', error);
                });
        }
        this.service = axios.create({
            baseURL: baseURL_,
            headers: {
                'fb-auth-token': token
            },
            responseType: 'json'
        });

        this.service.interceptors.response.use(function(response) {
            // Do something with response data
            console.info('response', response);
            return response;
        }, function(error) {
            // With response error redirect
            if (401 === error.response.status) {
                // wrong token -- access denied
                auth
                .signOut()
                .then(function() {
                    window.location = ('/');
                }).catch(function(error) {
                    alert('An error happened.');
                    console.info('Something went wrong:', error);
                });
            }
            return Promise.reject(error);
        });
   }

    /**
    * get list of posts directories
    */
    getDirsList() {
        return this.service.get('/editors/posts');
    }

    /**
    * get posts directories' subdirectories list
    * @param id path to post, eg: 'blog/post-2'
    */
    getSubDirsList(id) {
        return this.service.get('/editors/files', {
            params: {
                post_id: id
            }
        });
    }

    /**
    * get .md files
    * @param id .md file name, eg: '/title.md'
    * @param pathPrefix path to .md file, eg: 'blog/post-4'
    */
    getPostMd(id, pathPrefix) {
        return this.service.get('/editors/post', {
            params: {
                post_id: id,
                pathPrefix: pathPrefix
            }
        });
    }

    /**
    * save .md and mbake after edit
    * @param id .md file name, eg: '/title.md'
    * @param md .md file content, eg: '###### Lorem ipsum dd dolor sit {.title}'
    * @param pathPrefix path to .md file, eg: 'blog/post-4'
    */
    savePostMd(id, md, pathPrefix) {
        return this.service.put('/editors/post', md, {
            headers: { 'Content-Type': 'text/plain' },
            params: {
                post_id: id,
                pathPrefix: pathPrefix
            }
        });
    }

    /**
    * create new post
    * @param id new post folder name, eg: 'post-cpv'
    * @param pathPrefix path to .md file, eg: 'blog/post-4'
    */
    createPost(id, pathPrefix) {
        console.info('post_id', id);
        return this.service.post('/editors/new-post', {}, {
            params: {
                post_id: id,
                pathPrefix: pathPrefix
            }
        });
    }

}