webpackJsonp([1],{"1GB8":function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=r("Dd8w"),n=r.n(o),a=r("NYxO"),i=r("eRBi"),s=r("yDUC"),c={data:function(){return{loading:!1,activeStore:{user:"",newUser:"",proxy:{host:"default",port:80,cache:!1,start:!1}}}},props:["store"],computed:n()({},Object(a.c)(["storeList"]),{proxy:function(){return this.activeStore.proxy}}),beforeRouteUpdate:function(t,e,r){this.init(t.params.store),r()},created:function(){},mounted:function(){this.init(this.store)},mixins:[s.a],methods:{init:function(t){var e=this.storeList.filter(function(e){return e.store===t})[0];e&&(this.activeStore=Object(i.a)(e))},submit:function(){var t=this;this.test(this.activeStore)&&this.post("/setting/updateStore",this.activeStore).then(function(e){t.tip("修改成功！"),t.dispatch("getStoreList")})},deleteStore:function(){var t=this,e={user:this.activeStore.user};this.test(e)&&this.$confirm("此操作将永久删除该仓库, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(r){t.post("/setting/rmStore",e).then(function(e){t.tip("删除成功")}),t.dispatch("getStoreList")})}}},l={render:function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"container-set"},[r("el-form",{ref:"form",staticClass:"container",attrs:{"label-width":"80px"}},[r("el-form-item",{attrs:{label:"仓库"}},[r("el-input",{attrs:{clearable:"",placeholder:"仓库名称"},model:{value:t.activeStore.newUser,callback:function(e){t.$set(t.activeStore,"newUser",e)},expression:"activeStore.newUser"}})],1),t._v(" "),r("el-form-item",{attrs:{label:"proxyHost"}},[r("el-input",{attrs:{clearable:"",placeholder:"代理仓库名称"},model:{value:t.proxy.host,callback:function(e){t.$set(t.proxy,"host",e)},expression:"proxy.host"}})],1),t._v(" "),r("el-form-item",{attrs:{label:"运行端口"}},[r("el-input",{attrs:{clearable:"",placeholder:"默认80"},model:{value:t.proxy.port,callback:function(e){t.$set(t.proxy,"port",e)},expression:"proxy.port"}})],1),t._v(" "),r("el-form-item",{attrs:{label:"proxyCache"}},[r("el-switch",{attrs:{"active-color":"#13ce66"},model:{value:t.proxy.cache,callback:function(e){t.$set(t.proxy,"cache",e)},expression:"proxy.cache"}}),t._v(" "),r("span",[t._v(" 代理请求成功后是否缓存数据")])],1),t._v(" "),r("el-form-item",{attrs:{label:"运行"}},[r("el-switch",{attrs:{"active-color":"#13ce66"},model:{value:t.proxy.start,callback:function(e){t.$set(t.proxy,"start",e)},expression:"proxy.start"}})],1),t._v(" "),r("el-form-item",[r("el-button",{attrs:{type:"primary"},on:{click:t.submit}},[t._v("提交修改")]),t._v(" "),r("el-button",{directives:[{name:"show",rawName:"v-show",value:"default"!==t.activeStore.user,expression:"activeStore.user !=='default' "}],attrs:{type:"danger"},on:{click:t.deleteStore}},[t._v("删除仓库")])],1)],1)],1)},staticRenderFns:[]};var u=r("VU/8")(c,l,!1,function(t){r("9y4J")},"data-v-911f996a",null);e.default=u.exports},"9y4J":function(t,e){},eRBi:function(t,e,r){"use strict";function o(t,e){var r=null,a=n(t),i=["array","object"].indexOf(a);if(-1!==i){switch(i){case 0:r=[],t.forEach(function(t,n){var a=o(t,e);r[n]=a});break;case 1:for(var s in r={},t)if(t.hasOwnProperty(s)){var c=o(t[s],e);"underscore2camelCase"===e&&(s=s.replace(/_(\w)/g,function(t,e){return e.toUpperCase()})),r[s]=c}}return r}return-1!==["number","string","null","undefined","boolean"].indexOf(n(t))&&(r=t),r}function n(t){return Object.prototype.toString.call(t).slice(8,-1).toLowerCase()}function a(t){var e="";try{e=JSON.parse(t)}catch(e){return t}return e}r.d(e,"a",function(){return o}),r.d(e,"b",function(){return a})}});
//# sourceMappingURL=1.c81ad9f138bd177f59cc.js.map