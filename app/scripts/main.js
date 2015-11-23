// jshint devel:true
console.log('\'Allo \'Allo!');

$(function(){

  //初始化粒子背景
  (function(){
    $('#particleground').particleground({
      dotColor: '#fff',
      lineColor: '#fff',
      density:56000, //56000
      particleRadius:10,
      directionX:'center',
      directionY:'center',
      proximity:200,

    });
    $('#particleground2').particleground({
      dotColor: '#fff',
      lineColor: '#fff',
      density:60000, //60000
      particleRadius:8,
      directionX:'center',
      directionY:'center',
      proximity:200,

    });

    $(window).on('scroll', function(){
      if($(window).scrollTop() > 100){
        $('.header').removeClass('header-large').addClass('header-default');
      } else {
        $('.header').removeClass('header-default').addClass('header-large');
      }
    });
  })();

  //初始化页面图片
  (function(){
    $("img[data-src]").each(function(i, img){
      var me = $(img);
      me.attr("src", me.data("src"));
    });
  })();

  //初始化博客菜单滚动事件
  (function(){
    $(window).scroll(function () {
      if ($(window).scrollTop()>=200){
        console.log($(window).scrollTop());
        $("#navbar-blog").addClass("navbar-blog-fixed");
      }else{
        $("#navbar-blog").removeClass("navbar-blog-fixed");
      }
    });
  })();

});
