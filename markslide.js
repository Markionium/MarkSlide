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
        
        //set css for parent
        $(this).css("overflow", "hidden");
    }
    
    
    function MarkSlide(slider, options){
            
        //process options
        this.processoptions(options);

        //get slides
        this._slides = $(slider).children(".slide");
        
        //getslidewidth
        this._slidewidth = $(slider).children().first().innerWidth();
        
        //get slide count
        this._slidecount = this._slides.length;
        
        //set maxwidth of slider TODO this seems shitty but i don't know why yet
        this._maxwidth = (this._slidecount - 2 ) * this._slidewidth
        
        
        //set css for slides
        this._slides.css("float", "left");
        this._slides.css("position", "absolute");
        
        //wrap child elements in a wrapper
        this._slides.wrapAll('<div class="slideholder" />');
        
        //set wrapper css
        $(slider).children().first().css("width", this._maxwidth).css('position', "relative");
        
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
            
            if(this._options.instaPause == true){
                
                var toGo = 0;
        
                this._slides.clearQueue();
                this._slides.each(function(index, item){
                    
                    if(parseFloat($(item).position().left) > this._maxwidth){
                    
                        console.log ( "item" + this._slides[index] );
                    
                        toGo = this._slidewidth - (parseFloat($(item).position().left) - this._maxwidth);
                        this._remaining = this._slidewidth - toGo;
                        toGo = this._slidewidth + toGo;
                    
                        $(item).css("left", "-"+toGo+"px")
                    
                        console.log ( "index" + index );
                        console.log ( "left" + $(item).position().left );
                        console.log ("toGo" + toGo );
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
        _options: new Object(),
        _slides: null,
    
        //active = 1. paused = 0
        _state: 1,
    
        _slidewidth: 0,
        _maxwidth: 0,
        _slidecount: 0,
        
        _remaining: 0,         
         
        //methods
        /* Function to process the options given to the slider
     *
     * @param Object|undefined option object with options or undefined if no options were given
     */
        processoptions: function(options){
            
            this._options.instaPause = false;
            this._options.speed = 1500;
            this._options.pause = 5000;
            
            if(options !== undefined){
                this._options = options;
                this._options.instaPause = true;
            }
        
        },
        setup: function(index, item){
            
            var _left = index * parseInt($(item).innerWidth());
            
            $(item).css("left", "-"+_left+"px");
            
        },
        /*
     * Loop that does the animating and relocation of the items
     * 
     * @param int index Index of the item in the list
     * @param string item html representation of the item
     */
        loop:  function (index, item){
            
            if(parseFloat($(item).css("left")) > this._maxwidth)
                $(item).css("left", "-"+this._slidewidth+"px");
            
            if(this._state == 0){
                //$(item).clearQueue();
                //$(item).stop();
            }else{
                $(item).delay(0).animate({
                    left: "+="+this._slidewidth+"px"
                }, this._options.speed, function(){
                    this.loop(index, item);
                }.bind(this)).delay(this._options.pause);
            }
        }
   
    }

})(jQuery);