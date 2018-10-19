
riot.tag2('medialist-tag', '<div class="card" id="media"> <div class="card-body"><virtual each="{items}"> <div class="tile"> <div class="tile-content"> <div class="flex edge"> <div class="left"> <div class="card"> <div class="card-title text-ellipsis">{filename}</div> <div class="card-subtitle"><a nohref alt="{filename}" onclick="copyToClipboard(\'{filename}\')"> <div class="chip">Copy Path</div></a></div> </div> </div> <div class="right"><a nohref alt="{filename}" onclick="deleteMedia(\'{filename}\')"> <figure class="avatar avatar-xl badge" data-badge="X"><img riot-src="{src}"></figure></a></div> </div> </div> </div></virtual> </div> </div>', '', '', function(opts) {
    console.log('medialist-tag')
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
    	let cloned = $.map(data, function (obj) {
    		return $.extend(true, {}, obj);
    	});
    	thiz.items = cloned
    	thiz.update()
    }.bind(this)
});