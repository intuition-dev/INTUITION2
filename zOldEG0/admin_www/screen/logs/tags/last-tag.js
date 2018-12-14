
riot.tag2('last-tag', '<p>Last response</p> <p>{last}</p>', '', '', function(opts) {
    let thiz = this
    this.showLast = function() {
       console.log('show ')

       window.aSrv.getLast().then(function(resp) {
          console.log( JSON.stringify(resp.data._msg ))
          console.log( Object.keys(resp.data._msg ))
          let msg =  resp.data._code + ' : ' + resp.data._cmd
          thiz.update({last: msg } )
       }).catch(function (error) {
           console.log(window.aSrv.getError(error))
       })

    }.bind(this)
});