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
        tools[toolName] = new constructor(paper);
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
        var buttons = $('<div>');
        var settings = $('<div>');

        function populateSettings(config) {
            $.each(config, function(name, obj) {
                var input = $('<input/>');
                input.attr('type', obj.type);
                input.val(obj.value);

                if (obj.range) {
                    input.attr('min', obj.range[0]);
                    input.attr('max', obj.range[1]);
                }

                input.change(function() {  
                    tools[tool].set(name, $(this).val());
                });

                settings.append(input);
            });
        }

        $.each(tools, function(name, object) {
            $('<button>')
                .addClass('control')
                .addClass(name)
                .click(function() {
                    api.setTool(name);
                    populateSettings(object.settings());
                })
                .appendTo(buttons);
        });
        options.controls.append(buttons).append(settings);

    }

    return this;
};

})(jQuery);
