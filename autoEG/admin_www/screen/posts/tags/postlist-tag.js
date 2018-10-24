
riot.tag2('postlist-tag', '<a id="menucloser" tabindex="0"></a> <ul class="nav listbody"><virtual each="{items}"> <li class="nav-item"><a href="/screen/posts/edit/?{url}"> <div class="flex edge"> <div class="left"> <div class="card"> <div class="card-title h5">{title}</div> <div class="card-subtitle text-gray">{fmt_date_published}</div> </div> </div> <div class="right"> <figure class="avatar avatar-xl"><img riot-src="{image}"></figure> <div class="dropdown dropdown-right right"><a class="dropdown-toggle" href="#" tabindex="0" onblur="{parent.blur}"> <svg class="feather feather-more-horizontal" viewbox="0 0 24 24"> <circle cx="12" cy="12" r="1"></circle> <circle cx="19" cy="12" r="1"></circle> <circle cx="5" cy="12" r="1"></circle> </svg></a> <ul class="menu"> <li class="menu-item"><a href="/screen/posts/edit/?{url}"> <div class="flex edge"> <div class="left"> <svg class="text-gray feather feather-edit-2" viewbox="0 0 24 24"> <polygon points="16 3 21 8 8 21 3 21 3 16 16 3"></polygon> </svg> <div class="padL">Edit</div> </div> </div></a></li> <li class="menu-item"><a nohref onclick="{parent.view}"> <div class="flex edge"> <div class="left"> <svg class="text-gray feather feather-eye" viewbox="0 0 24 24"> <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path> <circle cx="12" cy="12" r="3"></circle> </svg> <div class="padL">View</div> </div> </div></a></li> <li class="menu-item"><a nohref onclick="{parent.remove}"> <div class="flex edge"> <div class="left"> <svg class="text-gray feather feather-trash-2" viewbox="0 0 24 24"> <polyline points="3 6 5 6 21 6"></polyline> <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path> <line x1="10" y1="11" x2="10" y2="17"></line> <line x1="14" y1="11" x2="14" y2="17"></line> </svg> <div class="padL">Delete</div> </div> </div></a></li> </ul> </div> </div> </div></a></li></virtual> </ul>', '', '', function(opts) {
    console.log('oh hi postlist-tag')
    this.on('*', function(evt) {
    	console.log('riot', evt)
    })
    this.items = []
    thiz = this

    this.render = function(data, isScheduled, prodUrl, callback) {

    	if (isScheduled != null)
    		thiz.isScheduled = isScheduled
    	if (prodUrl)
    		thiz.prodUrl = prodUrl
    	if (callback)
    		thiz.callback = callback

    	if(!data ) {
    		thiz.items = []
    		thiz.update()
    		return
    	}
    	else
    		thiz.data = data;

    	let cloned = JSON.parse(data)
    	thiz.publishedArr = []
    	thiz.scheduledArr = []

    	let sz = cloned.items.length
    	for(i = 0; i < sz; i++) {
    		var item = cloned.items[i]
    		item.url = ROOT + 'blog/' + item.url
    		if (item.image && item.image.indexOf('//')==-1)
    			item.image = thiz.prodUrl + item.url + '/' + item.image

    		var m = moment(item.date_published)
    		item.m_date_published = m
    		item.fmt_date_published = m.format("MM/DD, YYYY h:mm a")
    		if (moment().isBefore(m))
    			thiz.scheduledArr.push(item)
    		else
    			thiz.publishedArr.push(item)
    	}
    	switch(thiz.isScheduled){
    		case 1: thiz.items = thiz.scheduledArr.sort(function(a,b){return a.m_date_published.isBefore(b.m_date_published)})
    		default: thiz.items = thiz.publishedArr.sort(function(a,b){return a.m_date_published.isBefore(b.m_date_published)})
    	}
    	thiz.callback(thiz.publishedArr.length, thiz.scheduledArr.length)
    	thiz.update()
    }.bind(this)

    this.remove = function(e) {
    	let path = e.item.url
    	window.aSrv.removeItem('blog', path.substring(5)).then(function(resp){
    		let items = resp.data._cmd
    		thiz.render(items)
    		showSuccess('Blog entry deleted successfully!')
    	})
    }.bind(this)

    this.view = function(e)
    {
    	window.open(thiz.prodUrl+e.item.url, '_blank');
    	thiz.render(thiz.data)
    }.bind(this)
});