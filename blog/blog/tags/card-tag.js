
riot.tag2('card-tag', '<div class="blog columns blog-preview"><virtual each="{items}"> <virtual if="{publish}"> <div class="blog-item col-4 col-sm-6 col-xs-12"> <div class="blog-item__inside" href="{url}"><a class="img" href="{url}"><img class="img__inside" riot-src="{image}"></a> <div class="desc"> <div class="post-header d-flex"><a class="category" href="#">{category}</a> <div class="share"><a class="icon-wrap" href="https://www.facebook.com/sharer/sharer.php?u=http://liz-blog-seo-test.s3-website-us-east-1.amazonaws.com/{url}" target="_blank"><?xml version="1.0" encoding="iso-8859-1"?> <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"> <svg class="icon__cnt fb"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#ei-sc-facebook-icon"><svg id="ei-sc-facebook-icon" viewbox="0 0 50 50" width="100%" height="100%"><path d="M26 20v-3c0-1.3.3-2 2.4-2H31v-5h-4c-5 0-7 3.3-7 7v3h-4v5h4v15h6V25h4.4l.6-5h-5z"></path></svg></use></svg></a></div> </div> <div class="post-body"> <h6 class="title">{title}</h6> </div> <div class="post-footer d-flex"><a class="avatar" href="{url}"><img class="avatar__inside" riot-src="{avatar}"></a> <div class="d-flex"><a class="name" href="{url}">{name}</a> <div class="divider">/</div> <time class="date">{date}</time> </div> </div> </div> </div> </div></virtual> </virtual> </div><br>', '', '', function(opts) {
    console.log('oh hi tag')
    this.on('*', function(evt) {
       console.log('riot', evt)
    })
    this.items = []
    thiz = this

    this.render = function(data) {
       console.log(data)
       if(!data ) {
          thiz.items = []
          thiz.update()
          return
       }
       console.log(Object.keys(data[0]))

       let cloned = JSON.parse(JSON.stringify(data))
       thiz.items = cloned

      let sz = thiz.items.length
      for(i = 0; i < sz; i++) {
          var item = thiz.items[i]

          item.image = ROOT + 'blog/' + item.url + '/who.jpg'
          item.url = ROOT + 'blog/' + item.url
          console.log(item.url)
       }

       thiz.update()

    }.bind(this)
});