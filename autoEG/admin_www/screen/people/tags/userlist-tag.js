
riot.tag2('userlist-tag', '<a id="menucloser" tabindex="0"></a> <ul class="nav listbody"><virtual each="{items}"> <li class="nav-item"><a href="/screen/people/edit/?{url}"> <div class="flex edge"> <div class="left"> <figure class="avatar avatar-xl" data-initial="{initials}"> </figure> <div class="card padL"> <div class="card-title h6">{displayName}</div> <div class="card-subtitle text-gray">{currentRole}</div> </div> </div> <div class="right"> <div class="dropdown dropdown-right right"><a class="dropdown-toggle" href="#" tabindex="0"> <svg class="feather feather-more-horizontal" viewbox="0 0 24 24"> <circle cx="12" cy="12" r="1"></circle> <circle cx="19" cy="12" r="1"></circle> <circle cx="5" cy="12" r="1"></circle> </svg></a> <ul class="menu"> <li class="menu-item"><a href="#" onclick="alert(\'bla\');close()"> <div class="flex edge"> <div class="left"> <svg class="text-gray feather feather-edit-2" viewbox="0 0 24 24"> <polygon points="16 3 21 8 8 21 3 21 3 16 16 3"></polygon> </svg> <div class="padL">Edit</div> </div> </div></a></li> <li class="menu-item"><a nohref onclick="{parent.remove}"> <div class="flex edge"> <div class="left"> <svg class="text-gray feather feather-trash-2" viewbox="0 0 24 24"> <polyline points="3 6 5 6 21 6"></polyline> <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path> <line x1="10" y1="11" x2="10" y2="17"></line> <line x1="14" y1="11" x2="14" y2="17"></line> </svg> <div class="padL">Delete</div> </div> </div></a></li> </ul> </div> </div> </div></a></li></virtual> </ul>', '', '', function(opts) {
    console.log('oh hi postlist-tag')
    this.on('*', function(evt) {
    	console.log('riot', evt)
    })
    this.items = []
    thiz = this

    this.render = function(data, invitedFlag, prodUrl, callback) {

    	thiz = this

    	if (invitedFlag != null)
    		thiz.invitedFlag = invitedFlag
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
    	thiz.teamArr = []
    	thiz.invitedArr = []

    	let sz = cloned.items.length
    	for(i = 0; i < sz; i++) {
    		var item = cloned.items[i]
    		if (item.image)
    			item.image = thiz.prodUrl + '/team/'+item.url + '/' + item.image
    		else
    			item.image = ''

    		var v = item.emailVerified
    		if (v) {
    			thiz.teamArr.push(item)
    		}
    		else {
    			item.displayName = item.email
    			item.currentRole = ''
    			thiz.invitedArr.push(item)
    		}

    	}
    	switch(thiz.invitedFlag){
    		case 1: thiz.items = thiz.invitedArr; break;
    		default: thiz.items = thiz.teamArr
    	}
    	thiz.update()
    	thiz.callback(thiz.teamArr.length, thiz.invitedArr.length)
    }.bind(this)

    this.remove = function(e) {
    	let path = e.item.uid
    	window.aSrv.removeUser('team', path).then(function(resp){
    		let items = resp.data._cmd
    		thiz.render(items)
    		showSuccess('User deleted successfully!')
    	})
    }.bind(this)

    this.view = function(e)
    {
    	window.open(thiz.prodUrl+e.item.url, '_blank');
    	thiz.render(thiz.data)
    }.bind(this)
});