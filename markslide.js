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
(function ($) {

    "use strict";
    var sliders = {};

    $.fn.markslide = function (options) {

        var slider = new MarkSlide(this, options);

        sliders[$(this).attr("id")] = slider;

        //create hover events for pause on hover
        $(this).hover(slider.pause, slider.resume);

        //console.log ( slider );

    };


    function MarkSlide(slider, options) {

        //key for for loop
        var key;

        //process options
        this.instaPause = false;
        this.speed = 1500;
        this.wait = 5000;
        this.vertical = false;
        this.display = 1;
        this.direction = "left";
        this.measurement = "width";

        for (key in options) {
            if (options.hasOwnProperty(key)) {
                this[key] = options[key];
            }
        }

        if (this.vertical === true) {
            this.direction = "top";
            this.measurement = "height";
        }

        //set css for parent
        $(slider).css("overflow", "hidden");

        //get slides
        this.slides = $(slider).children(".slide");

        if (this.vertical === true) {
            this.slidesize = $(slider).children().first().innerHeight();
            //set slider width to fix mouse events from the left
            $(slider).css("width", $(slider).children().first().innerWidth() + "px");
        } else {
            //getslidewidth
            this.slidesize = $(slider).children().first().innerWidth();
        }

        //get slide count
        this.slidecount = this.slides.length;

        //max is maximum width or height depending on direction
        this.max = (this.slidecount - 2) * this.slidesize;

        //maxwidth of the sliderwrapper to still properly display
        if (this.display > (this.slidecount - 1)) {
            $(slider).css(this.measurement, (this.max + this.slidesize) + "px");
        } else {
            $(slider).css(this.measurement, this.display * this.slidesize);
        }

        //wrap child elements in a wrapper
        this.slides.wrapAll('<div class="slideholder" />');

        //set wrapper css
        $(slider).children().first().css(this.measurement, this.max).css('position', "relative");

        //do initialization for the slides
        this.slides.each(function (index, item) {
            this.setup(index, item);
        }.bind(this));

        //animate the slides
        this.slides.each(function (index, item) {
            this.loop(index, item);
        }.bind(this));

        /*
     * Pause the slider
     */
        this.pause = function () {

            this.state = 0;

            if (this.instaPause === true) {

                var toGo = 0;

                this.slides.clearQueue();
                this.slides.each(function (index, item) {

                    if (parseFloat($(item).position().left) > this.max) {

                        //console.log ( "item" + this.slides[index] );

                        toGo = this.slidesize - (parseFloat($(item).position().left) - this.max);
                        this.remaining = this.slidesize - toGo;
                        toGo = this.slidesize + toGo;

                        $(item).css("left", "-" + toGo + "px");
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
        }.bind(this);

        /*
     * Resume slider after pause
     */
        this.resume = function () {
            this.state = 1;

            this.slides.each(function (index, item) {
                this.loop(index, item);
            }.bind(this));

        }.bind(this);
    }

    MarkSlide.prototype = {

        //variables
        slides: null,

        //active = 1. paused = 0
        state: 1,

        slidesize: 0,
        max: 0,
        slidecount: 0,

        remaining: 0,

        setup: function (index, item) {

            var height,
                top,
                width,
                left;

            if (this.vertical === true) {

                height = parseInt($(item).innerHeight(), 10);
                top = (index * height) - height;

                $(item).css(this.direction, top + "px");
                //console.log( top );
            } else {
                $(item).css("float", "left");
                width =  parseInt($(item).innerWidth(), 10);
                left = ((index * width) - width);
                $(item).css(this.direction, (left) + "px");
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
        loop:  function (index, item) {

            if (this.state === 0) {
                $(item).clearQueue();
                $(item).stop();
            } else {
                if (this.vertical === true) {

                    if (parseFloat($(item).css(this.direction)) < 0) {
                        $(item).css(this.direction, (this.max + this.slidesize) + "px");
                    }
                    $(item).delay(0).animate({
                        top: "-=" + this.slidesize + "px"
                    }, this.speed, function () {
                        this.loop(index, item);
                    }.bind(this)).delay(this.wait);
                } else {
                    if (parseFloat($(item).css(this.direction)) > this.max) {
                        $(item).css(this.direction, "-" + this.slidesize + "px");
                    }
                    $(item).delay(0).animate({
                        left: "+=" + this.slidesize + "px"
                    }, this.speed, function () {
                        this.loop(index, item);
                    }.bind(this)).delay(this.wait);
                }
            }
        }

    };

}(jQuery));