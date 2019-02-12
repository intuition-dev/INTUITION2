var bglog = function(obj) {
	if(chrome && chrome.runtime) {
		chrome.runtime.sendMessage({type: "bglog", obj: obj});
	}
}

document.addEventListener('DOMContentLoaded', function() {

   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
         tabs.forEach(element => {       
            var url = new URL(element.url);
            var domain = url.hostname;
            var map = 'http://' + domain + '/map.yaml';
            chrome.extension.getBackgroundPage().console.log('map ------>', map);
            $.get(map, function(data) {
               alert(data);
               chrome.extension.getBackgroundPage().console.log('data ------>', data);
            },function(data) {
               alert(data);
               chrome.extension.getBackgroundPage().console.log('error ------>', data);
            });
         });
      });
   });

}, false);