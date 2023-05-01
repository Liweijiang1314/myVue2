/*
 * @Author: zhouzhishou
 * @Date: 2023-04-23 15:15:06
 * @Description: 
 */

function Vue(option) {
    const vm = this
    
    // proxy
    let data = vm._data = typeof option.data  === 'function' ?
    option.data.call(vm) : option.data
    Object.keys(data).forEach(key=>{
        var code = key.charCodeAt(0)
        if(code===36 || code===95) return
        proxy(vm, "_data", key)
    })
    
    //observe
    observe(data)

}

function proxy(vm, sourceKey, key) {
    Object.defineProperty(vm, key, {
        configurable: true, 
        enumerable: false,
        get(){
            return vm[sourceKey][key]
        },
        set (newVal){
            vm[sourceKey][key] = newVal
        }
    })
}
function observe(data) {
    if(!isObject(data)) return;
    if(Array.isArray(data)){
        const arrayPF = ['push','unshift'] // 还有什么方法在这里加
        const obj = Object.create(Array.prototype)
        arrayPF.forEach(key=>{
            obj[key] = function (...args) {
                [][key].apply(data,args)
                switch (key) {
                    case 'push':
                    case 'unshift':
                        // 更新视图
                        // code...
                        break;
                
                    default:
                        break;
                }
                observe(args)
            }
        })
        data.__proto__ =  obj 
        data.forEach(e=>observe(e))
        return
    }
    Object.keys(data).forEach(key=>{
        let val = data[key]
        observe(val)
        Object.defineProperty(data,key,{
            configurable: true,
            enumerable: true,
            get(){
                return val
            },
            set(newVal){
                val = newVal
                // 更新视图
                // code...
                observe(val)
            }
        })
    })
}

function isObject(obj){
    return typeof obj === 'object' && obj!=null
}

export default Vue