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
    
    var _slides = null;
    
    //active = 1. paused = 0
    var _state = 1;
    
    var _slidewidth = 0;
    var _maxwidth = 0;
    var _slidecount = 0;
    
    var _options = new Object;
    
    /**
     * 
     */
    $.fn.markslide = function(option){
        
        $(this).hover(this.pause, this.resume);
        
       this.processoptions(option);
        
        console.log( _options );
        
        //set css for parent
        $(this).css("overflow", "hidden");
        
        //get slides
        _slides = $(this).children(".slide");
        
        //getslidewidth
        _slidewidth = $(this).children().first().innerWidth();
        
        //get slide count
        _slidecount = _slides.length;
        
        
        _maxwidth = (_slidecount - 2 )* _slidewidth
        
        
        //set css for slides
        _slides.css("float", "left");
        _slides.css("position", "absolute");
        
        _slides.wrapAll('<div class="slideholder" />');
        $(this).children().first().css("width", _maxwidth).css('position', "relative");
        
        _slides.each(Setup)
        
        _slides.each(Loop);
            
    }
        
    function Setup(index, item){
            
        var _left = index * parseInt($(this).innerWidth());
            
        $(this).css("left", "-"+_left+"px");
            
    }
        
    function Loop(index, item){      
        
        if(parseInt($(this).css("left")) > _maxwidth)
            $(this).css("left", "-"+_slidewidth+"px");
        
        //if it's a resume from hover then don't do the delay
        if(_state == 0){
            $(this).clearQueue();
            $(this).stop();
        }else{
            $(this).delay(0).animate({
                left: "+="+_slidewidth+"px"
            }, _options.speed, Loop).delay(_options.pause);
        }
    }
    
    $.fn.pause = function(){
        
        console.log('pause');
        
        //set state to pause
        _state = 0;

    }
    
    $.fn.resume = function(){
        
        console.log('start');
        
        //set state to active
        _state = 1;
        
        //restart animation
        _slides.each(Loop);
            
    }
    
    $.fn.processoptions = function(option){
        
        console.log( option );
        
        if(option !== undefined){
            _options = option;
        }    
        else
        {
            _options.pause = 2000;
            _options.speed = 2500;
        }
    }
    
})(jQuery)