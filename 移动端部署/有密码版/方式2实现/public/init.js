function getJs(){
$.ajax({
       type:'GET',
       url:'./getJs',
       data:{user:user,pwd:pwd},
       dataType:'text',
       async:'true',
       success:function(datas){
         if(!datas.indexOf('msg:')){
          alert(datas.replace('msg:',''));
          location.reload(true);
}else if(!datas.indexOf('error:')){
        alert(datas.replace('error:',''));
        location.reload(true);
}else if(!datas.indexOf('link:')){
// eval(要运行的JS文本代码)
/*
 $.getScript()，请求并加载JS文件
第一个参数请求指定链接的JS文件，第二个参数即加载成功后执行的代码(如调用函数等)
原生JS代码是：
创建script元素（例元素名为script）
script.onload = function(){
   script元素加载完毕执行的JS代码
}
*/
        $.getScript(datas.replace('link:',''), function() {  // 加载后端响应的JS文件链接，并执行函数
           getInfor();
});

}
},
      error:function (err){
           console.log(err);
}
})
}