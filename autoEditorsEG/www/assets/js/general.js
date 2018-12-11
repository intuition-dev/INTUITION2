'use strict';

let apiService = new ApiService(window.env == 'isProd' ? window.DEV_API[0] : window.LOCAL_API[0]);

class Posts {
	constructor(apiService) {
      this.showDirs = this.showDirs.bind(this);
      this.showMd = this.showMd.bind(this);
   }
   showDirs() {
      // render posts list
		let listTemp = '';
      apiService.getDirsList()
      	.then(posts => {
      		posts.data.forEach(el => {
                listTemp += '<div class="blog-item"><svg xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns="http://www.w3.org/2000/svg" height="24" width="24" version="1.1" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/"><g transform="translate(0 -1028.4)"><path d="m2 4v13.531 2.469c0 1.105 0.8954 2 2 2h4 8l6-6v-12h-20z" transform="translate(0 1028.4)" fill="#fff"/><path d="m22 1044.4-6 6v-4c0-1.1 0.895-2 2-2h4z" fill="#a7f076" class="hover"/><path d="m4 2c-1.1046 0-2 0.8954-2 2v1 1h20v-1-1c0-1.1046-0.895-2-2-2h-4-8-4z" transform="translate(0 1028.4)" fill="#fff"/><g fill="#a7f076" class="hover"><rect height="2" width="14" y="1034.4" x="5"/><rect height="2" width="14" y="1038.4" x="5"/><rect height="2" width="9" y="1042.4" x="5"/></g></g></svg><span>'+el+'</span></div>';
            });
      		$('.blog-list-wrap').append(listTemp);
      	});
   }

   showMd(id) {
   	// render .md file content in textarea
   	apiService.getPostMd(id)
   		.then(post => {
   			console.log('data', post.data);
   			myCodeMirror.setValue(post.data);
   		});
   }

   saveMd(id, md) {
   	// render .md file content in textarea
   	apiService.savePostMd(id, md)
   		.then(post => {
   			console.log('data', post.data);
   			myCodeMirror.setValue(post.data);
   		});
   }
}