(function($) {

$.fn.drawing = function(options) {
    var paper = Raphael(this[0], 500, 500),
        canvas = $(paper.canvas),
        tools = {},
        objectFromId = {},
        objects = [];

    var tool;

    $.each(Drawing, function(toolName, constructor) {
        tool = tool || toolName;
        tools[toolName] = constructor(paper);
    });

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

    api.setTool = function(t) {
        if (tools[t])
            tool = t;
    };

    this.data('drawing', api);

    if (options.controls) {
        $.each(tools, function(name, object) {
            $('<button>')
                .addClass('control')
                .addClass(name)
                .click(function() {
                    api.setTool(name);
                })
                .appendTo(options.controls);
        });
    }

    return this;
};

})(jQuery);
