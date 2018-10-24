
riot.tag2('editor-tag', '<textarea id="cms1"></textarea>', '', '', function(opts) {
    thiz = this

    depp.require('style', function () {
    	depp.define({'editorjs': [
    		'//cdn.jsdelivr.net/npm/codemirror@5.40.2/lib/codemirror.css'
    		,'//cdn.jsdelivr.net/npm/codemirror@5.40.2/lib/codemirror.min.js'
    		,'//cdn.jsdelivr.net/npm/codemirror@5.40.2/mode/markdown/markdown.js'
    	]})
    })

    this.render = function(text) {
    	thiz = this
    	depp.require('editorjs', function () {
    		thiz.cm = CodeMirror.fromTextArea(
    		document.querySelector('#cms1') ,
    			{
    				mode: 'markdown'
    				, lineWrapping: true
    				, cursorHeight: 0.85
    			}
    		)
    		thiz.cm.setSize('100%', '100%')
    		if (text) {
    			thiz.cm.getDoc().setValue(text)
    		}

    		depp.done('editor')
    	})
    }.bind(this)

    this.text = function(text) {
    	if (text) {
    		thiz.cm.getDoc().setValue(text)
    		return text
    	}
    	return thiz.cm.getDoc().getValue()
    }.bind(this)
});