/****************************************************************************
 *                                                                          *
 *      _____                   __      _________.__   .__     .___         *
 *     /     \  _____  _______ |  | __ /   _____/|  |  |__|  __| _/ ____    *
 *    /  \ /  \ \__  \ \_  __ \|  |/ / \_____  \ |  |  |  | / __ |_/ __ \   *
 *   /    Y    \ / __ \_|  | \/|    <  /        \|  |__|  |/ /_/ |\  ___/   *
 *   \____|__  /(____  /|__|   |__|_ \/_______  /|____/|__|\____ | \___  >  *
 *           \/      \/             \/        \/                \/     \/   *
 *                                                                          *
 *                                                                          *
 * @author Mark Polak (markionium.com)                                      *
 * @version 0.1                                                             *
 * @description Slide anything inside the container in ltr or btt direction *
 ***************************************************************************/
(function($){
    
    var _sliders = new Object;
    
    $.fn.markslide = function(options){
        
        slider= new MarkSlide(this, options);
        
        _sliders[$(this).attr("id")] = slider;
        
        //create hover events for pause on hover
        $(this).hover(slider.pause, slider.resume);
        
        console.log ( slider );

    }
    
    
    function MarkSlide(slider, options){
        
        //process options
        this.instaPause = false;
        this.speed = 1500;
        this.wait = 5000;
        this.vertical = false;
        this.display = 1;
        this.direction = "left";
        this.measurement = "width";
            
        for (var key in options) {
            if (options.hasOwnProperty(key)) {                
                this[key] = options[key];
            }
        }
        
        if(this.vertical == true){
            this.direction = "top";
            this.measurement = "height";
        }
        
        //set css for parent
        $(slider).css("overflow", "hidden");

        //get slides
        this._slides = $(slider).children(".slide");
        
        if(this.vertical == true){
            this._slidesize = $(slider).children().first().innerHeight();
            //set slider width to fix mouse events from the left
            $(slider).css("width", $(slider).children().first().innerWidth()+"px");
        }else{      
            //getslidewidth
            this._slidesize = $(slider).children().first().innerWidth();
        }
        
        //get slide count
        this._slidecount = this._slides.length;
        
        //max is maximum width or height depending on direction
        this._max = (this._slidecount - 2) * this._slidesize;
        
        //maxwidth of the sliderwrapper to still properly display
        if(this.display > (this._slidecount - 1)){
            $(slider).css(this.measurement, (this._max + this._slidesize)+"px");
        }
        else{
            $(slider).css(this.measurement, this.display * this._slidesize);
        }
        
        //wrap child elements in a wrapper
        this._slides.wrapAll('<div class="slideholder" />');
        
        //set wrapper css
        $(slider).children().first().css(this.measurement, this._max).css('position', "relative");
        
        //do initialization for the slides
        this._slides.each(function(index, item){
            this.setup(index, item);
        }.bind(this));
        
        //animate the slides
        this._slides.each(function(index, item){
            this.loop(index, item);
        }.bind(this));
        
        /*
     * Pause the slider
     */
        this.pause = function(){
        
            this._state = 0;
            
            if(this.instaPause == true){
                
                var toGo = 0;
        
                this._slides.clearQueue();
                this._slides.each(function(index, item){
                    
                    if(parseFloat($(item).position().left) > this._max){
                    
                        //console.log ( "item" + this._slides[index] );
                    
                        toGo = this._slidesize - (parseFloat($(item).position().left) - this._max);
                        this._remaining = this._slidesize - toGo;
                        toGo = this._slidesize + toGo;
                    
                        $(item).css("left", "-"+toGo+"px")
                    /*
                        console.log ( "index" + index );
                        console.log ( "left" + $(item).position().left );
                        console.log ("toGo" + toGo );
                        */
                    }
                    $(item).clearQueue();
                    $(item).stop();
                
                }.bind(this)); 
            }
        }.bind(this)
        
        /*
     * Resume slider after pause
     */
        this.resume = function(){
            this._state = 1;
            
            this._slides.each(function(index, item)
            {
                this.loop(index, item);
            }.bind(this));
            
        }.bind(this)
    }
    
    MarkSlide.prototype = { 
         
        //variables
        _slides: null,
    
        //active = 1. paused = 0
        _state: 1,
    
        _slidesize: 0,
        _max: 0,
        _slidecount: 0,
        
        _remaining: 0,         
         
        //methods
        /* Function to process the options given to the slider
        *
        * @param Object|undefined option object with options or undefined if no options were given
        */
        
        setup: function(index, item){
            
            if(this.vertical == true){
                
                var height = parseInt($(item).innerHeight());
                var top = (index * height) - height;
                $(item).css(this.direction, top+"px");
                console.log( top );
            }
            else{
                $(item).css("float", "left");
                var width =  parseInt($(item).innerWidth());
                var left = ((index * width) - width );  
                $(item).css(this.direction, (left)+"px");
            }
            
            //set css for slides
            $(item).css("position", "absolute");
            
        },
        
        /*
        * Loop that does the animating and relocation of the items
        * 
        * @param int index Index of the item in the list
        * @param string item html representation of the item
        */
        loop:  function (index, item){
            
            if(this._state == 0){
                $(item).clearQueue();
                $(item).stop();
            }else{
                if(this.vertical == true){
                
                    if(parseFloat($(item).css(this.direction)) < 0)
                        $(item).css(this.direction, (this._max + this._slidesize)+"px");
                
                    $(item).delay(0).animate({
                        top: "-="+this._slidesize+"px"
                    }, this.speed, function(){
                        this.loop(index, item);
                    }.bind(this)).delay(this.wait);
                }else{
                    if(parseFloat($(item).css(this.direction)) > this._max)
                        $(item).css(this.direction, "-"+this._slidesize+"px");
                
                    $(item).delay(0).animate({
                        left: "+="+this._slidesize+"px"
                    }, this.speed, function(){
                        this.loop(index, item);
                    }.bind(this)).delay(this.wait);
                }
            }
        }
   
    }

})(jQuery);