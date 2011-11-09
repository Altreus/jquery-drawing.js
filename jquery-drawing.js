(function() {

function Paintbrush(canvas) {
    var context = canvas[0].getContext('2d'),
        started = false;

    this.click = function() {};

    this.mousedown = function(e) {
        beginDraw([e.offsetX, e.offsetY]);
    };

    this.mouseup = function(e) {
        stopDraw();
    };

    this.mousemove = function(e) {
        addPoint([e.offsetX, e.offsetY]);
    };

    function beginDraw(point) {
        context.beginPath();
        context.moveTo(point[0], point[1]);
        started = true;
        canvas.trigger('drawing.begin');
    }

    function stopDraw() {
        started = false;
        canvas.trigger('drawing.end');
    }

    function addPoint(point) {
        if (! started) return;
        context.lineTo(point[0], point[1]);
        context.stroke();
        canvas.trigger('drawing.change');
    }
}

$.fn.drawing = function() {
    var tools = {
        'paintbrush': new Paintbrush(this)
    };

    var tool = 'paintbrush';

    this.mousedown(function(e) {
        tools[tool].mousedown(e);
    });
    
    this.mouseup(function(e) {
        tools[tool].mouseup(e);
    });
    
    this.mousemove(function(e) {
        tools[tool].mousemove(e);
    });

    this.bind('drawing.change', function(e){
    });

    return this;
};

})();
