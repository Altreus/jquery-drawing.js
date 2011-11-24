var Drawing = Drawing || {};

Drawing.Select = function(paper) {
    var canvas = $(paper.canvas),
        boundingBox = paper.rect(0,0,1,1),
        selectedElement;

    boundingBox.hide();

    this.settings = function() {
        return {};
    };

    this.objClick = function() {
    };

    // Start drag + end drag with no move = select
    this.objDrag = function(obj, dx, dy) {
        console.log(dx + "," + dy);
        obj.transform('t' + (dx) + ',' + (dy));
    }

    function endDrag() {
    }

    function select(e) {
        selectedElement = e;

        boundingBox.attr({
            x: selectedElement.attr('x'),
            y: selectedElement.attr('y'),
            width: selectedElement.attr('width'),
            height: selectedElement.attr('height')
        });

        boundingBox.show();
    }

    function deselect() {
        selectedElement = null;
        boundingBox.hide();
    }
    
    this.set = function(setting, value) {};
};
