// ORIG

// SPA router v9.3
///////////////////////////////////////////////////////////////////
// License LGPL v2.1, Copyright Metabake.org | Wolfgang | Cekvenich

// requires jquery, https://unpkg.com/axios@0.18.0/dist/axios.min.js
// and https://cdn.jsdelivr.net/npm/signals@1.0.0/dist/signals.min.js'

$(window).on('popstate', function (e) {//back/forward button
   console.log(' popstate' + e.originalEvent.state)
   let state = e.originalEvent.state
   if (state !== null) {
      e.preventDefault()
      let oldUrl = localStorage.getItem('oldUrl')
      localStorage.setItem('oldUrl', state.url)
      SPArouter.loadHtml(state.url, oldUrl, true)
   }
})

$(document).on('click', 'a', function (e) { //over-ride links
   let anchor = $(e.currentTarget)
   let href = anchor.prop('href')
   console.log(href)
   if (!href || href.length < 1) {
      return
   }
   if (anchor.is('.norouter'))
      return
   if (href.indexOf('#')>-1) //don't override link with #
      return

   //else:
   e.preventDefault()
   let fromHref = window.location.href
   localStorage.setItem('oldUrl', href)
   SPArouter.loadHtml(href, fromHref)
})

let pg = window.location.href
try {
   history.pushState({ url: pg }, '', pg)
} catch (err) { console.log('no push state on file//', err) }
localStorage.setItem('oldUrl', pg)

let SPArouter = {

   zone: '#router' //the content in your layout. The rest should be app shell from PWA.
   , NAV: '_navigation-start'
   , PAGE: '_newpage-loaded'
   , navigated: new signals.Signal()

   , onNavigate: function (foo) {
      SPArouter.navigated.add(foo)
   }

   , loadHtml: function (toHref, fromHref, back) { //triggered, but function can be called directly also
      console.log('loaded', toHref)
      if (!back) {
         try {
            history.pushState({ url: toHref }, '', toHref)
         } catch (err) { console.log('no push state on file//') }
      }

      //fire NAV event
      SPArouter.navigated.dispatch({ type: SPArouter.NAV, toHref: toHref, fromHref: fromHref, back: back })

      let url = SPArouter.appendQueryString(toHref, { 'SPArouter': "\"" + SPArouter.zone + "\"" })
      console.log(url)

      //   credentials: 'same-origin' 
      axios.get(url).then(function (txt) {
         let $html = $('<html></html>').append($(txt.data))
         let title = $html.find('title').first().text()
         document.title = title

         let newContent = $html.find(SPArouter.zone).html()
         //console.log(newContent)

         //fire new PAGE received event
         SPArouter.navigated.dispatch({ type: SPArouter.PAGE, toHref: toHref, fromHref: fromHref, newContent: newContent, $html: $html, back: back })

      }).catch(function (er) {
         console.log('error', er)
         SPArouter.navigated.dispatch({ type: SPArouter.ERR, err: er })
      })
   }

   , appendQueryString: function (url, queryVars) {
      let firstSeparator = (url.indexOf('?') == -1 ? '?' : '&')
      let queryStringParts = new Array()
      for (let key in queryVars) {
         try {
            queryStringParts.push(key + '=' + queryVars[key])
         } catch (err) { 'q', console.log(err) }
      }
      let queryString = queryStringParts.join('&')
      return url + firstSeparator + queryString;
   }
}
// default: /////////////////////////////////////////////////////////////////////////////////////
console.log('spa router')
// use | override:
SPArouter.onNavigate(function (evt) {
   if (evt.type == SPArouter.NAV) { //start
      console.log('router NAV')
      //$('#router').fadeTo(100,.2)
   }
   else if (evt.type == SPArouter.PAGE) {
      console.log('router PAGE')
      $(SPArouter.zone).html(evt.newContent)
      //$('#router').fadeTo(100,1)
      window.scrollTo(0, 0)
   }
})

// fROOT //////////////////////////////////////////////
window.fROOT = location.toString().replace(location.search, '') // magic resource fix to know the first ROOT for SPA
let ii = fROOT.lastIndexOf(':')
fROOT = fROOT.substring(ii+1)

window.isFile = window.location.protocol == 'file:'
console.log('fROOT '+ window.isFile)
if(window.isFile) fROOT = fROOT.slice(0, -11)

console.log('fROOT ', fROOT)

function fROOTfix() {
   if(!window.isFile)  {
      $('a').each(function(index, value){
         $(this).attr('href', this.href.replace('/fROOT', '') )
      })
   }//fi
   else $('a').each(function(index, value){
      $(this).attr('href', this.href.replace('/fROOT', fROOT) )

      console.log(this.href)
      
      let isSlash = this.href.slice(-1) == '/'
      if(isSlash)
         $(this).attr('href', this.href+'index.html')
      else
         $(this).attr('href', this.href+'/index.html')
   })
}//()
fROOTfix()