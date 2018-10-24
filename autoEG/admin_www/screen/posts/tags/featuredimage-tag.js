
riot.tag2('featuredimage-tag', '<div class="card-body"> <input class="form-input" type="file" id="f1" placeholder="image" onchange="{upload}"> </div> <div class="card-image"><img class="img-responsive" id="f1img" riot-src="{src}" alt="{filename}"> <div id="f1del"><a hohref onclick="{deleteFeaturedImage}"> <svg class="feather feather-x" viewbox="0 0 24 24"> <line x1="18" y1="6" x2="6" y2="18"></line> <line x1="6" y1="6" x2="18" y2="18"></line> </svg></a></div> </div>', '', '', function(opts) {
    console.log('featuredimage-tag')
    thiz = this

    this.render = function() {
    	this.src = ''
    	this.filename = ''
    	this.update()
    }.bind(this)

    this.upload = function(e) {
    	let files = e.target.files;
    	if (files && files[0]) {
    		thiz = this
    		var reader = new FileReader();
    		reader.readAsDataURL(files[0]);
    		reader.onload = function(e) {
    			thiz.setImg(files[0].name, e.target.result)
    		}
    	}
    }.bind(this)

    this.deleteFeaturedImage = function(){
    	this.setImg()
    }.bind(this)

    this.setImg = function(filename, src){
    	this.filename = filename||(src?src.substring(src.lastIndexOf('/')+1):'')
    	this.src = src||''
    	this.update()
    	if (src)
    	{
    		$('#featuredimage .card-body').hide();
    		$('#f1del').show();
    	}
    	else
    	{
    		$('#f1').val('')
    		$('#featuredimage .card-body').show();
    		$('#f1del').hide();
    	}
    }.bind(this)
});