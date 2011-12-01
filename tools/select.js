var Drawing = Drawing || {};

Drawing.Select = function(paper) {
    var canvas = $(paper.canvas),
        boundingBox = paper.rect(0,0,1,1),
        selectedElement,
        tx;

    boundingBox.hide();
    boundingBox.attr({
        'stroke': '#8CCAEC',
        'stroke-dasharray': '-'
    });

    this.settings = function() {
        return {};
    };

    this.objClick = function(e) {
        select(e);
    };

    this.objDrag = function(obj, dx, dy) {
        var tf = 't' + (tx[1] + dx) + ',' + (tx[2] + dy);
        obj.transform(tf);
        select(obj);

        canvas.trigger('drawing.change', {
            element: obj,
            type: 'move',
            diff: tf,
        });
    };

    this.objDragStop = function(e) {
        tx = null;
    };

    this.objDragStart = function(obj) {
        tx = obj.transform();
        if (! tx.length) {
            tx = [null, 0, 0];
        }
        else {
            tx = tx[0];
        }
    };

    this.click = function(e) {
        if (e.srcElement != selectedElement.node) {
            deselect();
        }
    };

    function select(e) {
        selectedElement = e;

        boundingBox.attr(e.getBBox());

        boundingBox.show();
    }

    function deselect() {
        selectedElement = null;
        boundingBox.hide();
    }
    
    this.set = function(setting, value) {};

    this.alterObject = function(object, tf) {
        object.transform(tf);
    };
};
