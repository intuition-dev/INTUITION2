
riot.tag2('medialist-tag', '<div class="card" id="media"> <div class="card-body"><virtual each="{items}"> <div class="tile"> <div class="tile-content"> <div class="flex edge"> <div class="left"> <div class="card"> <div class="card-title text-ellipsis">{filename}</div> <div class="card-subtitle"><a nohref alt="{filename}" onclick="{parent.copyToClipboard}"> <div class="chip">Copy Path</div></a></div> </div> </div> <div class="right"><a nohref alt="{filename}" onclick="deleteMedia(\'{filename}\')"> <figure class="avatar avatar-xl badge" data-badge="X"><img riot-src="{src}"></figure></a></div> </div> </div> </div></virtual> </div> </div> <textarea id="copy" readonly></textarea>', 'medialist-tag #copy,[data-is="medialist-tag"] #copy{ position: absolute; left: -9999px; }', '', function(opts) {
    console.log('medialist-tag')
    this.items = []

    this.render = function(data, abs_url) {
    	if(!data ) {
    		this.items = []
    		this.update()
    		return
    	}

    	if (abs_url)
    	{
    		let len = data.length
    		for (var i = 0; i < len; i++)
    		{
    			if (!data[i].src)
    				data[i].src = abs_url + '/' + data[i].filename
    		}
    	}
    	this.items = data
    	this.update()
    }.bind(this)

    this.copyToClipboard = function(e) {
    	let str = e.item.filename
    	$('#copy').val(str)
    	$('#copy').select()
    	document.execCommand('copy');
    }.bind(this)

    this.upload = function(files) {

    	if (files){
    		thiz = this
    		let len = files.length
    		for (var i = 0; i < len; i++)
    		{
    			let f = files[i]
    			if(!f.type.match('image.*')) continue
    			let fname = f.name
    			let dup = false, sz = this.items.length
    			for(j = 0; j < sz; j++) {
    				if(this.items[j].filename === fname) {dup = true; break}
    			}
    			if (dup) continue;
    			let reader = new FileReader();
    			reader.readAsDataURL(f);
    			reader.onload = function(e) {
    				thiz.items.push({filename: fname, src: e.target.result})
    				thiz.update()
    			}
    		}
    	}
    }.bind(this)

    this.deleteItem = function(filename) {
    	let sz = this.items.length
    	let clone = []
    	for(i = 0; i < sz; i++) {
    		var item = this.items[i]
    		if (item.filename != filename) clone.push(item)
    	}
    	this.items = clone
    	this.update()
    }.bind(this)
});