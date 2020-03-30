/*! modernizr 3.6.0 (Custom Build) | MIT *
 * https://modernizr.com/download/?-prefixes-setclasses !*/
 !function(e,n,s){function o(e,n){return typeof e===n}function a(){var e,n,s,a,i,l,r;for(var c in f)if(f.hasOwnProperty(c)){if(e=[],n=f[c],n.name&&(e.push(n.name.toLowerCase()),n.options&&n.options.aliases&&n.options.aliases.length))for(s=0;s<n.options.aliases.length;s++)e.push(n.options.aliases[s].toLowerCase());for(a=o(n.fn,"function")?n.fn():n.fn,i=0;i<e.length;i++)l=e[i],r=l.split("."),1===r.length?Modernizr[r[0]]=a:(!Modernizr[r[0]]||Modernizr[r[0]]instanceof Boolean||(Modernizr[r[0]]=new Boolean(Modernizr[r[0]])),Modernizr[r[0]][r[1]]=a),t.push((a?"":"no-")+r.join("-"))}}function i(e){var n=r.className,s=Modernizr._config.classPrefix||"";if(c&&(n=n.baseVal),Modernizr._config.enableJSClass){var o=new RegExp("(^|\\s)"+s+"no-js(\\s|$)");n=n.replace(o,"$1"+s+"js$2")}Modernizr._config.enableClasses&&(n+=" "+s+e.join(" "+s),c?r.className.baseVal=n:r.className=n)}var t=[],f=[],l={_version:"3.6.0",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,n){var s=this;setTimeout(function(){n(s[e])},0)},addTest:function(e,n,s){f.push({name:e,fn:n,options:s})},addAsyncTest:function(e){f.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=l,Modernizr=new Modernizr;var r=n.documentElement,c="svg"===r.nodeName.toLowerCase(),u=l._config.usePrefixes?" -webkit- -moz- -o- -ms- ".split(" "):["",""];l._prefixes=u,a(),i(t),delete l.addTest,delete l.addAsyncTest;for(var p=0;p<Modernizr._q.length;p++)Modernizr._q[p]();e.Modernizr=Modernizr}(window,document);