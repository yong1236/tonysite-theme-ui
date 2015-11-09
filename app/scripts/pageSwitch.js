/**
 * Created by Tony on 2015/10/28.
 */
(function($){
  //
  var _prefix = (function(el){
    var aPrefix = ["webkit","Moz","o","ms"],
      props = "";
    for(var i=0; i<aPrefix.length; i++){
      props = aPrefix[i] + "Transition";
      if(el.style[props] !== undefined){
        return "-" + aPrefix[i].toLowerCase() + "-";
      }
    }
    return false;
  })(document.createElement(PageSwitch));

  var PageSwitch = (function(){
    function PageSwitch(element, options){
      this.settings = $.extend(true, $.fn.PageSwitch.defaults, options||{});
      this.element = element;
      this.init();
    }

    //曝露插件方法
    PageSwitch.prototype = {
      init: function(){
        var me = this;
        me.selectors = me.settings.selectors;
        me.sections = me.element.find(me.selectors.sections);
        me.section = me.sections.find(me.selectors.section);
        me.direction = me.settings.direction;

        me.isHorizontal = me.settings.direction == "horizontal";
        me.pagesCount = me.pageCount();
        me.index = (me.settings.index>=0 && me.settings.index < me.pagesCount) ? me.settings.index : 0;

        me.canScroll = true;

        if(me.isHorizontal){
          me._initLayout();
        }

        if(me.settings.pagination){
          me._initPaging();
        }

        me._initEven();
      },
      pageCount: function(){
        return this.section.length;
      },
      switchLength: function(){
        return this.isHorizontal ? this.element.height() : this.element.width();
      },
      prev: function(){
        var me = this;
        if(me.index>0){
          me.index--;
        }else if(me.settings.loop){
          me.index = me.pagesCount - 1;
        }
        me._scrollPage();
      },
      next: function(){
        var me = this;
        if(me.index < me.pagesCount){
          me.index++;
        }else if(me.settings.loop){
          me.index = 0;
        }
        me._scrollPage();
      },
      _initLayout: function(){
        var me = this;
        var width = (me.pagesCount * 100) + "%",
          cellWidth = (100 / me.pagesCount).toFixed(2) + "%";
        me.sections.width(width);
        me.section.width(cellWidth).css("float", "left");
      },
      _initPaging: function(){
        var me = this;
        var pagesClass = me.selectors.page.substring(1);
        me.activeClass = me.selectors.active.substring(1);
        var pageHtml = "<ul class='"+ pagesClass +"'>";
        for(var i=0; i<me.pagesCount; i++){
          pageHtml += "<li></li>";
        }
        pageHtml += "</ul>";
        me.element.append(pageHtml);

        var pages = me.element.find(me.selectors.page);
        me.pageItem = pages.find("li");
        me.pageItem.eq(me.index).addClass(me.activeClass);

        if(me.isHorizontal){
          pages.addClass("horizontal");
        }else{
          pages.addClass("vertical");
        }
      },
      _initEven: function(){
        var me = this;
        //分页事件
        me.element.on("click", me.selectors.pages + "li", function(){
          me.index = $(this).index();
          me._scrollPage();
        });

        me.element.on("mousewheel DOMMouseScroll", function(e){
          if(!me.canScroll){
            return;
          }
          var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;
          if(delta > 0  && (me.index/*不为0*/ && !me.settings.loop || me.settings.loop)){
            me.prev();
          }else if (delta < 0 && (me.index < (me.pagesCount - 1) && !me.settings.loop || me.settings.loop)){
            me.next();
          }
        });

        if(me.settings.keyboard){
          $(window).on("keydown", function(e){
            var keyCode = e.keyCode;
            if(keyCode==37 || keyCode==38){
              me.prev();
            }else if(keyCode==39 || keyCode==40){
              me.next();
            }
          });
        }

        $(window).on("resize", function(){
          var currentLength = me.switchLength(),
            offset = me.isHorizontal ? me.section.eq(me.index).offset().top : me.section.eq(me.index).offset().left;
          if(Math.abs(offset) > currentLength/2 && me.index<(me.pagesCount - 1)){
            me.index++;
          }
          if(me.index>0){
            me._scrollPage();
          }
        });

        me.sections.on("transitionend webkitTransitionEnd oTransitionEnd otransitionend", function(){
          me.canScroll = true;
          if(me.settings.callback && $.type(me.settings.callback)=="function"){
            me.settings.callback();
          }
        });
      },
      _scrollPage: function(){
        var me = this;
        var dest = me.section.eq(me.index).position();
        if(!dest){
          return;
        }
        me.canScroll = false;

        if(_prefix){
          me.sections.css(_prefix+"transition", "all "+me.settings.duration+"ms "+me.settings.easing);
          var translate = me.isHorizontal ? "translateX(-"+dest.left+"px)":"translateY(-"+dest.top+"px)";
          me.sections.css(_prefix+"transform", translate);
        }else{
          var animateCss = !me.isHorizontal ? {left: -dest.left}:{top: -dest.top};
          me.sections.animate(animateCss, me.settings.duration, function(){
            me.canScroll = true;
            if(me.settings.callback && $.type(me.settings.callback)=="function"){
              me.settings.callback();
            }
          });
        }

        if(me.settings.pagination){
          me.pageItem.eq(me.index).addClass(me.activeClass).siblings().remove(me.activeClass);
        }
      }
    };

    return PageSwitch;
  })();
  $.fn.PageSwitch = function(options){
    return this.each(function(){
      //插件单例模式的实现
      var me = $(this),
        instance = me.data("PageSwitch");
      if(!instance){
        instance = new PageSwitch(me, options);
        me.data("PageSwitch", instance);
      }

      //实现对象方法的调用
      if($.type(options) === "string"){
        return instance[options];
      }
    });
  };

  $.fn.PageSwitch.defaults = {
    selectors: {
      sections: ".sections",
      section: ".section",
      page: ".pages",
      active: ".active"
    },
    index: 0,
    easing: "ease",
    duration: 500,
    loop: false,
    pagination: true,
    keyboard: true,
    direction: "vertical",
    callback: ""
  };
  $(function(){
    $("[data-PageSwitch]").PageSwitch({
      loop: true,
      direction: "horizontal"
    });
  });
})(jQuery);
