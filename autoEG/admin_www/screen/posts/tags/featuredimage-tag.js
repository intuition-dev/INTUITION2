
riot.tag2('featuredimage-tag', '<div class="card-body"> <input class="form-input" type="file" id="f1" placeholder="image" onchange="{upload}"> </div> <div class="card-image"><img class="img-responsive" id="f1img" riot-src="{src}"> <div id="f1del"><a hohref onclick="{deleteFeaturedImage}"> <svg class="feather feather-x" viewbox="0 0 24 24"> <line x1="18" y1="6" x2="6" y2="18"></line> <line x1="6" y1="6" x2="18" y2="18"></line> </svg></a></div> </div>', '', '', function(opts) {
    console.log('featuredimage-tag')
    thiz = this

    this.render = function() {
    	this.src = ''
    	this.update()
    }.bind(this)

    this.upload = function(e) {
    	let files = e.target.files;
    	if (files && files[0]) {
    		thiz = this
    		var reader = new FileReader();
    		reader.readAsDataURL(files[0]);
    		reader.onload = function(e) {
    			thiz.src = e.target.result
    			thiz.update()
    			$('#featuredimage .card-body').hide();
    			$('#f1del').show();
    		}
    	}
    }.bind(this)

    this.read = function(callback) {
    	alert('read')
    	let f1 = $('#f1')[0].files[0];
    	if (f1)
    	{
    		alert('found file')

    		let reader = new FileReader();
    		reader.readAsDataURL(f1);
    		reader.onload = function(e) {
    			let b64 = e.target.result
    			callback(b64, f1.name)
    		}
    	}
    	else
    		callback()
    }.bind(this)

    this.deleteFeaturedImage = function() {
    	depp.require(['style'], function(){
    		$('#f1').val('')
    		thiz.src = ''
    		thiz.update()
    		$('#f1del').hide();
    		$('#featuredimage .card-body').show();
    	})
    }.bind(this)
});