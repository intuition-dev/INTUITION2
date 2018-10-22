
riot.tag2('medialist-tag', '<div class="card" id="media"> <div class="card-body"><virtual each="{items}"> <div class="tile"> <div class="tile-content"> <div class="flex edge"> <div class="left"> <div class="card"> <div class="card-title text-ellipsis">{filename}</div> <div class="card-subtitle"><a nohref alt="{&quot;filename&quot;:&quot;/home/admin/Metabake-Admin/autoEG/admin_www/screen/posts/.&quot;}" onclick="{parent.copyToClipboard}"> <div class="chip">Copy Path</div></a></div> </div> </div> <div class="right"><a nohref alt="{&quot;filename&quot;:&quot;/home/admin/Metabake-Admin/autoEG/admin_www/screen/posts/.&quot;}" onclick="deleteMedia(\'{filename}\')"> <figure class="avatar avatar-xl badge" data-badge="X"><img riot-src="{src}"></figure></a></div> </div> </div> </div></virtual> </div> </div> <textarea id="copy" readonly></textarea>', 'medialist-tag #copy,[data-is="medialist-tag"] #copy{ position: absolute; left: -9999px; }', '', function(opts) {
    console.log('medialist-tag')
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

    this.copyToClipboard = function(e) {
    	let str = e.item.filename
    	$('#copy').val(str)
    	$('#copy').select()
    	document.execCommand('copy');
    }.bind(this)

    this.upload = function(files) {

    	if (files){
    		let len = files.length
    		for (var i = 0; i < len; i++)
    		{
    			let f = files[i]
    			if(!f.type.match('image.*')) continue
    			let fname = f.name
    			let dup = false, sz = thiz.items.length
    			for(j = 0; j < sz; j++) {
    				if(thiz.items[j].filename === fname) {dup = true; break}
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
    	let sz = thiz.items.length
    	let clone = []
    	for(i = 0; i < sz; i++) {
    		var item = thiz.items[i]
    		if (item.filename != filename) clone.push(item)
    	}
    	thiz.items = clone
    	thiz.update()
    }.bind(this)
});