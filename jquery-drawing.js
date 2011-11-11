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

    this.createObject = function(data) {
        return paper.path(data);
    };

    this.alterObject = function(object, data) {
        object.attr('path', data);
    };

    function beginDraw(point) {
        path = paper.path('M' + point[0] + ' ' + point[1]);
        canvas.trigger('drawing.begin', { element: path });
    }

    function stopDraw(point) {
        if (! path) return;

        path.attr({ 
            path: path.attr('path')
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
        },
        objectFromId = {},
        objects = [];

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

    canvas.bind('drawing.begin', function(e,f) {
        $(f.element.node).data('tool', tool);
    });

    canvas.bind('drawing.change', function(e){
    });

    canvas.bind('drawing.end', function(e,f){
        objects.push(f.element);
    });

    var api = {};

    api.createObject = function(spec) {
        var object = tools[spec.tool].createObject(spec.data);
        object.node.id = spec.id;
        objectFromId[spec.id] = object;
    };

    api.updateObject = function(spec) {
        var object = objectFromId[spec.id];
        tools[spec.tool].alterObject(object, spec.data);
    };

    this.data('drawing', api);

    return this;
};

})();
