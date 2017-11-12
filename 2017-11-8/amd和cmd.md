# amd
- 对于模块的依赖，amd是提前执行。从代码的方式来看就是引入是提前写好的。

``` JavaScript
define(['./a','./b'],function(a,b){
      a.dosomething();
      //中间有其他的操作
      b.dosomething();
  })
```
- 这里是说明amd规范对于引用js是需要提前加载进来。
- amd中，模块内部和加载引用全部都是使用的require来加载。

# cmd
- 在cmd中模块内部的引入是使用的require。而在外部加载时使用的是seajs.use()来实现。
- cmd中使用的是就近加载原则。即在使用的时候才加载

``` JavaScript
define(function (require, exports, module) {
    var a = require('.a');
    a.dosomething();
    ...
    var b = require('.b');
    b.dosomething();
})
```

### cmd和amd在使用上没有其他明显的差异。只是实现思想上有些区别。
