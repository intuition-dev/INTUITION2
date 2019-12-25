
declare var jsyaml: any
declare var $: any
declare var depp: any
declare var disE: any
declare var loadFonts: any
declare var renderMustache: any


depp.require(['jquery', 'pagination', 'mustache', 'js-yaml', 'DOMDelayed'], function() {
console.log('loaded')

class UIBinding {   
    static sr:any
    constructor(sr:any) {
        UIBinding.sr = sr
        this.render()

        loadFonts(['Open+Sans:300,400'])

        //events
        var table = UIBinding.sr.getElementById('data-container')
        table.addEventListener('click', this.onRowClick)

        UIBinding.sr.getElementById("prevBut",UIBinding.sr).addEventListener("click", function(){
                console.log('P')
                $('#pagination-container',UIBinding.sr).pagination('previous')
            })

        UIBinding.sr.getElementById("nextBut",UIBinding.sr).addEventListener("click", function(){
            console.log('N')
            $('#pagination-container',UIBinding.sr).pagination('next')
        })//event

        window.addEventListener('resize', this.render)


    }//cons
    

    onRowClick(el) {
        const selector = '.fragTitle'
        var cel = el.target.closest(selector)
        if (!cel) return
        //console.log(cel)

        var title = cel.innerText
        //console.log(title)

        disE('titleClick', title)

    }//()

    render() {
        UIBinding._fetchD().then(function(dat:any){
            UIBinding._onFData(dat)
        })
    }//()

    static _fetchD() { 
        var path = ''

        // data
        return new Promise(function (resolve, reject) {
            fetch(path+'dat.yaml', {
                cache: 'default',
                keepalive: true
            }).then(function (fullResp) {
                if (!fullResp.ok)
                    reject(fullResp.statusText)
                return fullResp.text()
                }).then(function (ys) {
                    let y = jsyaml.safeLoad(ys)
                    resolve(y)
                })
            .catch(function (err) {
                console.log(err)
                reject(err)
            })
        })//pro
    }

    // did the data load once?
    static firstDataLoad = false

    static _onFData(data) {   
        
        if( !UIBinding.firstDataLoad) {
            UIBinding.firstDataLoad=true
            console.log('firstDataLoad')
            disE('firstDataLoad', data)
        }//

        
        // MATH:
        //var computedItems = $('.pagCont',UIBinding.sr).height() / 65   // pixels  of each row
        var heig = $('.fragCont',UIBinding.sr).height()  - 140 
        var computedItems = heig / 65   // pixels  of each row

        console.log('rendering', heig, computedItems ) 

        $('#pagination-container',UIBinding.sr).pagination({
            pageSize: computedItems,
            showPageNumbers: false,
            showPrevious: false,
            showNext: false,

            dataSource: data.frags,

            callback: function(data, pagination) { // on page
                //console.log('pagination')
                setTimeout(function(){ //pg, sz, tot
                    UIBinding.showHide(pagination.pageNumber, pagination.pageSize, pagination.totalNumber)
                },1)

                var html = renderMustache(UIBinding.sr, 'temp1', data)
                $('#data-container',UIBinding.sr).html(html)

            }//cb
        })

    }//()

    static showHide(pg, sz, tot) {

        if(pg==1)  { UIBinding._but('prevBut', false ) }
            else UIBinding._but('prevBut', true) 

        var cur = pg * sz
        //console.log('showHide', cur, tot)

        if(cur < tot) { // more 
            UIBinding._but('nextBut', true) 
        } else { // to much
            UIBinding._but('nextBut', false) 
        }
    }

    static _but(id, on) {
        var THIZ = this
        //console.log(id, on)
        let $b = $('#'+id,UIBinding.sr)
        $b.prop('disabled', !on)
        if(on) {
            $b.removeClass( "classless" )
            $b.removeClass( "butOff" )
            $b.addClass(    "btn-a" )
            $b.addClass(    "butOn" )

        } else {
            $b.removeClass( "btn-a" )
            $b.removeClass( "butOn" )
            $b.addClass(    "classless" )
            $b.addClass(    "butOff" )
        }
    }//()
    
}// class

    // template
    var cTemp = document.createElement('template')
    cTemp.innerHTML = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/INTUITION-dev/intuDesignWork@v1.0.5/src/css/main.css"/>

<div class="fragCont">
    <p></p>
    <button class="btn butOff classless" id="prevBut" disabled="disabled">Previous </button>
    <div class="topSpace"></div>
    <div class="pagCont">
        <div id="data-container"></div>
        <div id="pagination-container"></div>
    </div>
    <button class="btn butOff classless" id="nextBut" disabled="disabled">Next </button>

    <template id="temp1"><span>{{#.}}
        <div class="fragTitle">{{title}}</div>
        <hr/><br/></span><span>{{/.}}</span></template>
</div>

<style>

    .fragCont {
        width: 200px;
        margin-left: 1em;
        display: flex;
        flex-direction: column;
        height: calc(100vh - 5em);
    }
    .topSpace {
        min-height: 1.6em;
    }
    
    .pagCont {
        flex-grow: 1;
    }

    .fragTitle {
        font-weight: 400;
        
        /*clamp */
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;  
        overflow: hidden;
    }
    .fragTitle:hover, .fragTitle:focus, .fragTitle:active {
        color: blue;
        cursor: pointer;
        font-weight: 300;
        letter-spacing: .02em;
      }

    .butOn {
        font-weight: normal;
        pointer-events: auto;
    }
    .butOff {
        font-weight: lighter;
        pointer-events: none;
}
</style>`

// /////////////////////////////
window.customElements.define('fraglist-custel', class extends HTMLElement {
    sr // shadow root var
    
    constructor() {
        super()
        console.log('cons')

        this.sr = this.attachShadow({ mode: 'closed' })
        this.sr.appendChild(cTemp.content.cloneNode(true))
        new UIBinding(this.sr)

    }//cons    

})//custel


})//depp