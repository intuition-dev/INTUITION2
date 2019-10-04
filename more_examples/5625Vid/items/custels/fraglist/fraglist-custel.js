var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
depp.require(['jquery', 'pagination', 'mustache', 'js-yaml', 'DOMDelayed'], function () {
    console.log('loaded');
    var UIBinding = (function () {
        function UIBinding(sr) {
            UIBinding.sr = sr;
            this.render();
            loadFonts(['Open+Sans:300,400']);
            var table = UIBinding.sr.getElementById('data-container');
            table.addEventListener('click', this.onRowClick);
            UIBinding.sr.getElementById("prevBut", UIBinding.sr).addEventListener("click", function () {
                console.log('P');
                $('#pagination-container', UIBinding.sr).pagination('previous');
            });
            UIBinding.sr.getElementById("nextBut", UIBinding.sr).addEventListener("click", function () {
                console.log('N');
                $('#pagination-container', UIBinding.sr).pagination('next');
            });
            window.addEventListener('resize', this.render);
        }
        UIBinding.prototype.onRowClick = function (el) {
            var selector = '.fragTitle';
            var cel = el.target.closest(selector);
            if (!cel)
                return;
            var title = cel.innerText;
            disE('titleClick', title);
        };
        UIBinding.prototype.render = function () {
            UIBinding._fetchD().then(function (dat) {
                UIBinding._onFData(dat);
            });
        };
        UIBinding._fetchD = function () {
            var path = '';
            return new Promise(function (resolve, reject) {
                fetch(path + 'dat.yaml', {
                    cache: 'default',
                    keepalive: true
                }).then(function (fullResp) {
                    if (!fullResp.ok)
                        reject(fullResp.statusText);
                    return fullResp.text();
                }).then(function (ys) {
                    var y = jsyaml.safeLoad(ys);
                    resolve(y);
                })
                    .catch(function (err) {
                    console.log(err);
                    reject(err);
                });
            });
        };
        UIBinding._onFData = function (data) {
            if (!UIBinding.firstDataLoad) {
                UIBinding.firstDataLoad = true;
                console.log('firstDataLoad');
                disE('firstDataLoad', data);
            }
            var heig = $('.fragCont', UIBinding.sr).height() - 140;
            var computedItems = heig / 65;
            console.log('rendering', heig, computedItems);
            $('#pagination-container', UIBinding.sr).pagination({
                pageSize: computedItems,
                showPageNumbers: false,
                showPrevious: false,
                showNext: false,
                dataSource: data.frags,
                callback: function (data, pagination) {
                    setTimeout(function () {
                        UIBinding.showHide(pagination.pageNumber, pagination.pageSize, pagination.totalNumber);
                    }, 1);
                    var html = renderMustache(UIBinding.sr, 'temp1', data);
                    $('#data-container', UIBinding.sr).html(html);
                }
            });
        };
        UIBinding.showHide = function (pg, sz, tot) {
            if (pg == 1) {
                UIBinding._but('prevBut', false);
            }
            else
                UIBinding._but('prevBut', true);
            var cur = pg * sz;
            if (cur < tot) {
                UIBinding._but('nextBut', true);
            }
            else {
                UIBinding._but('nextBut', false);
            }
        };
        UIBinding._but = function (id, on) {
            var THIZ = this;
            var $b = $('#' + id, UIBinding.sr);
            $b.prop('disabled', !on);
            if (on) {
                $b.removeClass("classless");
                $b.removeClass("butOff");
                $b.addClass("btn-a");
                $b.addClass("butOn");
            }
            else {
                $b.removeClass("btn-a");
                $b.removeClass("butOn");
                $b.addClass("classless");
                $b.addClass("butOff");
            }
        };
        UIBinding.firstDataLoad = false;
        return UIBinding;
    }());
    var cTemp = document.createElement('template');
    cTemp.innerHTML = "\n<link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/gh/intuition-dev/intuDS@v1.0.3/src/css/min.min.css\"/>\n\n<div class=\"fragCont\">\n    <p></p>\n    <button class=\"btn butOff classless\" id=\"prevBut\" disabled=\"disabled\">Previous </button>\n    <div class=\"topSpace\"></div>\n    <div class=\"pagCont\">\n        <div id=\"data-container\"></div>\n        <div id=\"pagination-container\"></div>\n    </div>\n    <button class=\"btn butOff classless\" id=\"nextBut\" disabled=\"disabled\">Next </button>\n\n    <template id=\"temp1\"><span>{{#.}}\n        <div class=\"fragTitle\">{{title}}</div>\n        <hr/><br/></span><span>{{/.}}</span></template>\n</div>\n\n<style>\n\n    .fragCont {\n        width: 200px;\n        margin-left: 1em;\n        display: flex;\n        flex-direction: column;\n        height: calc(100vh - 5em);\n    }\n    .topSpace {\n        min-height: 1.6em;\n    }\n    \n    .pagCont {\n        flex-grow: 1;\n    }\n\n    .fragTitle {\n        font-weight: 400;\n        \n        /*clamp */\n        display: -webkit-box;\n        -webkit-line-clamp: 2;\n        -webkit-box-orient: vertical;  \n        overflow: hidden;\n    }\n    .fragTitle:hover, .fragTitle:focus, .fragTitle:active {\n        color: blue;\n        cursor: pointer;\n        font-weight: 300;\n        letter-spacing: .02em;\n      }\n\n    .butOn {\n        font-weight: normal;\n        pointer-events: auto;\n    }\n    .butOff {\n        font-weight: lighter;\n        pointer-events: none;\n}\n</style>";
    window.customElements.define('fraglist-custel', (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            var _this = _super.call(this) || this;
            console.log('cons');
            _this.sr = _this.attachShadow({ mode: 'closed' });
            _this.sr.appendChild(cTemp.content.cloneNode(true));
            new UIBinding(_this.sr);
            return _this;
        }
        return class_1;
    }(HTMLElement)));
});
