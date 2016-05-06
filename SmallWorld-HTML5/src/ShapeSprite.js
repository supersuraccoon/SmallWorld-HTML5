// ShapeSprite.js

// ShapeSprite base class
var ShapeSprite = cc.Node.extend({
    init:function () {
		if (this._super()) {
			this._color = cc.c3b(255, 255, 255);
            this._opacity = 255;
            this._draw = cc.DrawNode.create();
            this.addChild(this._draw, 999);
		    bRet = true;
		}
		return bRet;
    },
    _reset:function () {
    	cc.log("_reset");
    },
    setColor:function (color) {
    	this._color = color;
    	this._reset();
    },
    setOpacity:function (opacity) {
    	this._opacity = opacity;
    	this._reset();
    },
    getColor:function () {
    	return this._color;
    },
    getRect:function () {
        return null;
    }
});

// DotSprite
var DotSprite = ShapeSprite.extend({
    init:function (dotSize) {
		if (this._super()) {
			this._dotSize = dotSize;
            this._reset();
		    bRet = true;
		}
		return bRet;
    },
    _reset:function () {
    	this._draw.clear()
    	this._draw.drawDot(this.getPosition(), this._dotSize, cc.c4f(this._color.r / 255.0, 
    																 this._color.g / 255.0, 
    																 this._color.b / 255.0, 
    																 this._opacity / 255.0));
    },
    getRect:function () {
        return new cc.rect(this.getPositionX() - this._dotSize / 2, 
        				   this.getPositionY() - this._dotSize / 2, 
        				   this._dotSize, 
        				   this._dotSize);
    }
});

DotSprite.create = function (dotSize) {
    var dot = new DotSprite();
    if (dot && dot.init(dotSize)) 
    	return dot;
    return null;
};

//LineSprite
var LineSprite = ShapeSprite.extend({
    init:function (startPosition, endPosition, lineWidth) {
		if (this._super()) {
			this._lineWidth = lineWidth;
			this._startPosition = startPosition;
			this._endPosition = endPosition;
            this._reset();
		    bRet = true;
		}
		return bRet;
    },
    _reset:function () {
    	this._draw.clear()
    	this._draw.drawSegment(this._startPosition, this._endPosition, this._lineWidth, cc.c4f(this._color.r / 255.0,
    																				     	   this._color.g / 255.0, 
    																				     	   this._color.b / 255.0,
    																				     	   this._opacity / 255.0));
    }
});
LineSprite.create = function (startPosition, endPosition, lineWidth) {
    var line = new LineSprite();
    if (line && line.init(startPosition, endPosition, lineWidth)) 
    	return line;
    return null;
};

//
var PolygonSprite = ShapeSprite.extend({
    init:function (sides, radius) {
		if (this._super()) {
			this._sides = sides;
			this._radius = radius;
			this._reset();
		    bRet = true;
		}
		return bRet;
    },
    _reset:function () {
    	this._draw.clear()
    	this._draw.drawPoly(this._getPolygonVertArray(), cc.c4f(this._color.r / 255.0,
			     										  		this._color.g / 255.0, 
			     										  		this._color.b / 255.0,
			     										  		this._opacity / 255.0), 0, cc.c4f(0, 0, 0, 0));
    },
    _getPolygonVertArray:function() {
    	var vertArray = new Array();
    	for (var i = 0; i < this._sides; i++) {
    		vertArray.push(cc.p(this._radius * Math.cos(i / this._sides * Math.PI * 2),
    							this._radius * Math.sin(i / this._sides * Math.PI * 2)));
    		
    	}
    	return vertArray;
    }
});
PolygonSprite.create = function (sides, radius) {
    var polygon = new PolygonSprite();
    if (polygon && polygon.init(sides, radius)) 
    	return polygon;
    return null;
};

// rect
var FrameSprite = ShapeSprite.extend({
    init:function (pointArray, width) {
		if (this._super()) {
			this._pointArray = pointArray;
			this._frameWidth = width;
			this._reset();
		    bRet = true;
		}
		return bRet;
    },
    _reset:function () {
    	this._draw.clear()
    	this._draw.drawPoly(this._pointArray, cc.c4f(0, 0, 0, 0), this._frameWidth, cc.c4f(this._color.r / 255.0,
																					  	   this._color.g / 255.0, 
																						   this._color.b / 255.0,
																						   this._opacity / 255.0));	
    }
});
FrameSprite.create = function (pointArray, width) {
    var frame = new FrameSprite();
    if (frame && frame.init(pointArray, width)) 
    	return frame;
    return null;
};

FrameSprite.create = function (rect, width, offset) {
	if (offset == undefined)
		offset = 0;
    var frame = new FrameSprite();
    if (frame && frame.init([cc.p(width - offset, width - offset), 
                             cc.p(rect.width - width + offset, width - offset), 
                             cc.p(rect.width - width + offset, rect.height - width + offset), 
                             cc.p(width - offset, rect.height - width + offset)], width)) 
    	return frame;
    return null;
};
