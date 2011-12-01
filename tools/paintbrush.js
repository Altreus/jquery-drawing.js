var Drawing = Drawing || {};

Drawing.Paintbrush = function(paper) {
    var path,
        canvas = $(paper.canvas),
        settings = {
            stroke: {
                type: 'colour',
                value: '#000000'
            },
            'stroke-width': {
                type: 'number',
                range: [1, 32],
                value: 1
            }
        };

    this.click = function() {};

    this.mousedown = function(e) {
        console.log(e);
        beginDraw([e.layerX-0.5, e.layerY-0.5]);
    };

    this.mouseup = function(e) {
        stopDraw([e.layerX-0.5, e.layerY-0.5]);
    };

    this.mousemove = function(e) {
        addPoint([e.layerX-0.5, e.layerY-0.5]);
    };

    this.createObject = function(data) {
        return paper.path(data);
    };

    this.alterObject = function(object, diff) {
        object.attr('path', object.attr('path') + diff);
    };

    this.settings = function() {
        return settings;
    };

    this.set = function(setting, value) {
        settings[setting].value = value;
    };

    function beginDraw(point) {
        path = paper.path('M' + point[0] + ' ' + point[1]);
        $.each(settings, function(s, obj) {
            path.attr(s, obj.value);
        });
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
            diff: diff,
        });
    }
};
