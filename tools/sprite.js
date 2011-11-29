var Drawing = Drawing || {};

Drawing.Sprite = function(paper) {
    var canvas = $(paper.canvas),
        settings = {
            image: {
                type: 'text'
            },
            width: {
                type: 'number',
                value: 50
            },
            height: {
                type: 'number',
                value: 50
            }
        },
        img;

    this.mousemove = function(e) {
        if (!img && settings.image.value) {
            console.log(settings);
            img = paper.image(settings.image.value, 0, 0,
                settings.width.value, settings.height.value);
            canvas.trigger('drawing.begin', { element: img });
        }

        // if we haven't created it by now we couldn't.
        if (!img) return;

        img.attr({
            x: e.offsetX - 0.5 - (settings.width.value / 2),
            y: e.offsetY - 0.5 - (settings.width.value / 2)
        });
    };

    this.mouseleave = function() {
        img.remove();
        img = null;
    };

    this.click = function(e) {
        canvas.trigger('drawing.end', { element: img });
        img = null;
    };

    this.settings = function() {
        return settings;
    };

    this.set = function(setting, value) {
        settings[setting].value = value;
    };
};
