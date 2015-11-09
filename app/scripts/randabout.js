/**
 * Created by Tony on 2015/11/9.
 */
(function($){

  var Randabout = (function(){

    function Randabout(element, options){
      this.settings = $.extend(true, $.fn.Randabout.defaults, options||{});
      this.element = element;
      this.init();
    }

    //曝露插件方法
    Randabout.prototype = {
      init: function(){
        var me = this;
        me.items = me.element.find(me.settings.selectors.items);
        me._initPosition();
      },
      _initPosition: function(){
        var me = this;
        var containerWidth = me.element.width(),
          containerHeight = me.element.height();
        $(me.items).each(function(i, item){
          var width = $(item).width(),
            height = $(item).height();
          var size = Math.ceil((Math.random()+1) * width);
          $(item).css({
            left: Math.ceil(Math.random() * containerWidth) + "px",
            top: Math.ceil(Math.random() * containerHeight) + "px",
            width:  size + "px",
            height: size + "px"
          });
          $(item).find("img").width(size).height(size);
        });
      }
    };

    return Randabout;
  })();

  $.fn.Randabout = function(options){
    return this.each(function(){
      //插件单例模式的实现
      var me = $(this),
        instance = me.data("Randabout");
      if(!instance){
        instance = new Randabout(me, options);
        me.data("Randabout", instance);
      }

      //实现对象方法的调用
      if($.type(options) === "string"){
        return instance[options];
      }
    });
  };
  $.fn.Randabout.defaults = {
    selectors:{
      items: ".rand-item"
    }
  };

  $(function(){
    $("[data-randabout]").Randabout({
      loop: true,
      direction: "horizontal"
    });
  });
})(jQuery);
