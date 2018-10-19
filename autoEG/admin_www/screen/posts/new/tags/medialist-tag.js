
riot.tag2('medialist-tag', '<div class="card" id="media"> <div class="card-body"><virtual each="{items}"> <div class="tile"> <div class="tile-content"> <div class="flex edge"> <div class="left"> <div class="card"> <div class="card-title h6">{filename}</div> </div> </div> <div class="right"> <figure class="avatar avatar-xl"><img></figure> </div> </div> </div> <div class="tile-action"><a nohref onclick="alert(\'delete image\')"> <svg class="feather feather-x" viewbox="0 0 24 24"> <line x1="18" y1="6" x2="6" y2="18"></line> <line x1="6" y1="6" x2="18" y2="18"></line> </svg></a></div> </div></virtual> </div> </div>', '', '', function(opts) {
    console.log('oh hi medialist-tag')
    this.on('*', function(evt) {
    	console.log('riot', evt)
    })
    this.items = []
    thiz = this

    this.render = function(data) {
    	if(!data ) {
    		thiz.items = []
    		thiz.update()
    		return
    	}

    	let cloned = JSON.parse(data)
    	thiz.items = cloned.items

    	thiz.update()
    }.bind(this)
});