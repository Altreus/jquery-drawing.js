var Drawing = Drawing || {};

Drawing.Select = function(paper) {
    var canvas = $(paper.canvas),
        boundingBox = paper.rect(0,0,1,1),
        selectedElement,
        _x, _y;

    boundingBox.hide();

    this.mousedown = function(e) {
        if (e.srcElement == paper || e.srcElement == boundingBox) {
            deselect();
        }
        else {
            selectedElement = e.srcElement;
            startDrag(e.offsetX, e.offsetY);
        }
    };

    this.mouseup = function(e) {
        endDrag();
    };

    this.mousemove = function(e) {
        move(e.offsetX, e.offsetY);
    };

    this.settings = function() {
        return {};
    };

    // Start drag + end drag with no move = select
    function startDrag(x, y) {
        _x = x;
        _y = y;
        boundingBox.attr({
            x: selectedElement.attr('x'),
            y: selectedElement.attr('y'),
            width: selectedElement.attr('width'),
            height: selectedElement.attr('height')
        });

        boundingBox.show();
    }

    function move(x,y) {
        selectedElement.transform('T' + (x - _x) + ',' + (y - _y));
    }

    function endDrag() {
    }

    function deselect() {
        selectedElement = null;
        boundingBox.hide();
    }
    
    this.set = function(setting, value) {};
};
