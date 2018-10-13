
riot.tag2('postlist-tag', '<ul class="nav listbody"><virtual each="{items}"> <li class="nav-item"><a href="/screen/posts/#"> <div class="flex edge"> <div class="left"> <div class="card"> <div class="card-title h5">{title}</div> <div class="card-subtitle text-gray">{fmt_date_published}</div> </div> </div> <div class="right"> <figure class="avatar avatar-xl"><img riot-src="{image}"></figure> <div class="dropdown dropdown-right right"><a class="dropdown-toggle" href="#" tabindex="0"> <svg class="feather feather-more-horizontal" viewbox="0 0 24 24"> <circle cx="12" cy="12" r="1"></circle> <circle cx="19" cy="12" r="1"></circle> <circle cx="5" cy="12" r="1"></circle> </svg></a> <ul class="menu"> <li class="menu-item active"><a href="/screen/posts/#"> <div class="flex edge"> <div class="left"> <svg class="text-gray feather feather-edit-2" viewbox="0 0 24 24"> <polygon points="16 3 21 8 8 21 3 21 3 16 16 3"></polygon> </svg> <div class="padL">Edit</div> </div> </div></a></li> <li class="menu-item active"><a href="/screen/posts/#"> <div class="flex edge"> <div class="left"> <svg class="text-gray feather feather-copy" viewbox="0 0 24 24"> <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect> <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path> </svg> <div class="padL">Clone</div> </div> </div></a></li> <li class="menu-item active"><a href="/screen/posts/#"> <div class="flex edge"> <div class="left"> <svg class="text-gray feather feather-eye" viewbox="0 0 24 24"> <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path> <circle cx="12" cy="12" r="3"></circle> </svg> <div class="padL">View</div> </div> </div></a></li> <li class="menu-item"><a href="/screen/posts/#"> <div class="flex edge"> <div class="left"> <svg class="text-gray feather feather-trash-2" viewbox="0 0 24 24"> <polyline points="3 6 5 6 21 6"></polyline> <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path> <line x1="10" y1="11" x2="10" y2="17"></line> <line x1="14" y1="11" x2="14" y2="17"></line> </svg> <div class="padL">Trash</div> </div> </div></a></li> </ul> </div> </div> </div></a></li></virtual> </ul>', '', '', function(opts) {
    console.log('oh hi postlist-tag')
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

    	let sz = thiz.items.length
    	for(i = 0; i < sz; i++) {
    		var item = thiz.items[i]
    		item.url = ROOT + 'blog/' + item.url
    		item.fmt_date_published = moment(item.date_published).format("MM/DD, YYYY h:mm a")
    	}
    	thiz.update()
    }.bind(this)
});