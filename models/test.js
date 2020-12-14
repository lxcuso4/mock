/**
 * @功能名称:
 * @文件名称: test.js
 * @Date: 2020-03-04 20:07.
 * @Author: liux
 * @Copyright（C）: liux   All rights reserved.
 */

const model = {
    a:1,
    f(n,b){
        console.log(n,b)
        return this.a+n+b
    }
}
const model1 = {
    a:2,
    f(n){
        return this.a+n
    }
}
class A {
    constructor(model){
        this.model =  model
    }
    create(n,b){
        return this.model.f(n,b)
    }
}
class B extends A{
    constructor(model){
       super(model);
        // this.model = model1
    }
    create(n,a,b){
        return super.create(n+a, b)
    }
}
const log = console.log.bind(console)



async function f() {
    var a= await Promise.resolve({code:0})
    console.log(1,a)
    var b = await Promise.reject({code:-1})
    console.log(2,b)
    var c = await Promise.resolve({code:1})
    console.log(3,c)
    return {code:5}
}

async function sub(){
   return  await  f()
}



sub().then(json=>{
    console.log(4,json)
},json=>{
    console.log(5,json)

})
