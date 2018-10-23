
riot.tag2('editor-tag', '<textarea id="cms1" riot-value="{value}"></textarea>', '', '', function(opts) {
    console.log('editor-tag')
    thiz = this

    depp.require('style', function () {
    	depp.define({'editorjs': [
    		'//cdn.jsdelivr.net/npm/codemirror@5.40.2/lib/codemirror.css'
    		,'//cdn.jsdelivr.net/npm/codemirror@5.40.2/lib/codemirror.min.js'
    		,'//cdn.jsdelivr.net/npm/codemirror@5.40.2/mode/markdown/markdown.js'
    	]})
    })

    this.render = function(text) {
    	depp.require('editorjs', function () {
    		this.value = text
    		this.cm = CodeMirror.fromTextArea(
    		document.querySelector('#cms1') ,
    			{
    				mode: 'markdown'
    				, lineWrapping: true
    				, cursorHeight: 0.85
    			}
    		)
    		this.cm.setSize('100%', '100%')

    		this.update()
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