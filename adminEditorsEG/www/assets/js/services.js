class ApiService {
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
      //this.isLoading = this.isLoading.bind(this);

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

   // get list of directories on the left
   getDirsList() {
      return this.service.get('/editors/posts');
   }

   // get sub list of directories on the left
   getSubDirsList(id) {
      return this.service.get('/editors/files', {
         params: {
            post_id: id
         }
      });
   }

   // get .md file
   getPostMd(id, pathPrefix) {
      return this.service.get('/editors/post', {
         params: {
            post_id: id,
            pathPrefix: pathPrefix
         }
      });
   }

   // save .md and mbake after edit
   savePostMd(id, md, pathPrefix) {
      return this.service.put('/editors/post', md, {
         headers: { 'Content-Type': 'text/plain' },
         params: {
            post_id: id,
            pathPrefix: pathPrefix
         }
      });
   }

   // create new post
   createPost(id) {
      console.info('post_id', id);
      return this.service.post('/editors/new-post', {}, {
         params: {
            post_id: id
         }
      });
   }

}