(function($) {

$.fn.drawing = function(options) {
    var paper = Raphael(this[0], 500, 500),
        canvas = $(paper.canvas),
        tools = {},
        objectFromId = {},
        objects = [];

    var tool;

    // Event handlers for the Raphael elements' events
    var elementEvents = {
        drag: function(dx, dy, x, y, e) {
            if (!tool) return;
            if (tool.objDrag) tool.objDrag(this, dx, dy, x, y, e);
        },
        dragStart: function(x, y, e) {
            if (!tool) return;
            if (tool.objDragStart) tool.objDragStart(this, x, y, e);
        },
        dragStop: function(e) {
            if (!tool) return;
            if (tool.objDragStop) tool.objDragStop(this, e);
        },
        dragOver: function(over, e) {
            if (!tool) return;
            if (tool.objDragOver) tool.objDragOver(this, over, e);
        },
        click: function(e) {
            if (!tool) return;
            if (tool.objClick) tool.objClick(this, e);
        },
        dblclick: function(e) {
            if (!tool) return;
            if (tool.objDblClick) tool.objDblClick(this, e);
        },
        hoverIn: function(e) {
            if (!tool) return;
            if (tool.objHoverIn) tool.objHoverIn(this, e);
        },
        hoverOut: function(e) {
            if (!tool) return;
            if (tool.objHoverOut) tool.objHoverOut(this, e);
        },
        mouseDown: function(e) {
            if (!tool) return;
            if (tool.objMouseDown) tool.objMouseDown(this, e);
        },
        mouseUp: function(e) {
            if (!tool) return;
            if (tool.objMouseUp) tool.objMouseUp(this, e);
        },
        mouseOver: function(e) {
            if (!tool) return;
            if (tool.objMouseOver) tool.objMouseOver(this, e);
        },
        mouseOut: function(e) {
            if (!tool) return;
            if (tool.objMouseOut) tool.objMouseOut(this, e);
        },
        mouseMove: function(e) {
            if (!tool) return;
            if (tool.objMouseMove) tool.objMouseMove(this, e);
        },
        touchStart: function(e) {
            if (!tool) return;
            if (tool.objTouchStart) tool.objTouchStart(this, e);
        },
        touchEnd: function(e) {
            if (!tool) return;
            if (tool.objTouchEnd) tool.objTouchEnd(this, e);
        },
        touchMove: function(e) {
            if (!tool) return;
            if (tool.objTouchMove) tool.objTouchMove(this, e);
        },
        touchCancel: function(e) {
            if (!tool) return;
            if (tool.objTouchCancel) tool.objTouchCancel(this, e);
        },
    };

    $.each(Drawing, function(toolName, constructor) {
        tools[toolName] = new constructor(paper);
    });

    canvas.mousedown(function(e) {
        if (!tool) return;
        if (tools[tool].mousedown)
            tools[tool].mousedown(e);
    });
    
    canvas.mouseup(function(e) {
        if (!tool) return;
        if (tools[tool].mouseup)
            tools[tool].mouseup(e);
    });
    
    canvas.mousemove(function(e) {
        if (!tool) return;
        if (tools[tool].mousemove)
            tools[tool].mousemove(e);
    });

    canvas.bind('drawing.begin', function(e,f) {
        // Raphael creates an ID for each thing, so set the DOM ID to that.
        $(f.element.node).data('tool', tool).attr('id', f.element.id);
    });

    canvas.bind('drawing.change', function(e){
    });

    canvas.bind('drawing.end', function(e,f){
        objects.push(f.element);
        f.element.drag(elementEvents.drag, elementEvents.dragStart,
            elementEvents.dragStop);
        f.element.click(elementEvents.click);
        f.element.dblclick(elementEvents.dblclick);
        f.element.hover(elementEvents.hoverIn, elementEvents.hoverOut);

        f.element.mousedown(elementEvents.mouseDown);
        f.element.mouseup(elementEvents.mouseUp);
        f.element.mouseover(elementEvents.mouseOver);
        f.element.mouseout(elementEvents.mouseOut);
        f.element.mousemove(elementEvents.mouseMove);

        f.element.touchstart(elementEvents.touchStart);
        f.element.touchend(elementEvents.touchEnd);
        f.element.touchmove(elementEvents.touchMove);
        f.element.touchcancel(elementEvents.touchCancel);
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
