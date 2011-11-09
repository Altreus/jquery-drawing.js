(function() {

function Paintbrush(paper) {
    var path,
        canvas = $(paper.canvas);

    this.click = function() {};

    this.mousedown = function(e) {
        beginDraw([e.offsetX-0.5, e.offsetY-0.5]);
    };

    this.mouseup = function(e) {
        stopDraw([e.offsetX-0.5, e.offsetY-0.5]);
    };

    this.mousemove = function(e) {
        addPoint([e.offsetX-0.5, e.offsetY-0.5]);
    };

    function beginDraw(point) {
        path = paper.path('M' + point[0] + ' ' + point[1]);
        canvas.trigger('drawing.begin', { element: path });
    }

    function stopDraw(point) {
        if (! path) return;

        path.attr({ 
            path: path.attr('path') + "Z"
        });
        
        canvas.trigger('drawing.end', { element: path });
        path = null;
    }

    function addPoint(point) {
        if (! path) return;

        var diff = " " + point[0] + " " + point[1]
        path.attr({ 
            path: path.attr('path') + diff
        });
        canvas.trigger('drawing.change', { 
            element: path, 
            type: 'path',
        });
    }
}

$.fn.drawing = function() {
    var paper = Raphael(this[0], 500, 500),
        canvas = $(paper.canvas),
        tools = {
            'paintbrush': new Paintbrush(paper)
        };

    var tool = 'paintbrush';

    canvas.mousedown(function(e) {
        tools[tool].mousedown(e);
    });
    
    canvas.mouseup(function(e) {
        tools[tool].mouseup(e);
    });
    
    canvas.mousemove(function(e) {
        tools[tool].mousemove(e);
    });

    canvas.bind('drawing.change', function(e){
    });

    return this;
};

})();
