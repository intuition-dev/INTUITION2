
riot.tag2('editor-tag', '<textarea id="cms1"></textarea>', '', '', function(opts) {
    thiz = this

    depp.require('style', function () {
    	depp.define({'editorjs': [
    		'//cdn.jsdelivr.net/npm/codemirror@5.40.2/lib/codemirror.css'
    		,'//cdn.jsdelivr.net/npm/codemirror@5.40.2/lib/codemirror.min.js'
    		,'//cdn.jsdelivr.net/npm/codemirror@5.40.2/mode/markdown/markdown.js'
    	]})
    })

    this.render = function() {
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

    		depp.done('editor')
    	})
    }.bind(this)

    this.text = function(text) {
    	if (text) {
    		this.cm.getDoc().setValue(text)
    		return text
    	}
    	return this.cm.getDoc().getValue().trim()
    }.bind(this)
});