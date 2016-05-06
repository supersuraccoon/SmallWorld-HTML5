// Joypad.js

KEY_UP = 87;
KEY_LEFT = 65;
KEY_RIGHT = 68;
KEY_DOWN = 83;
KEY_ATTACK = 75;

var Joypad = cc.Layer.extend({
	_delegate: null,
	init:function(delegate){
		var bRet = false;
		if (this._super()) {
			this._delegate = delegate;

			this.directionButton = cc.Sprite.create(png_moveButton);
			this.directionButton.setPosition(cc.p(WIN_SIZE.width * 0.1, 100));
            this.directionButton.setOpacity(100);
            this.directionArea = this.directionButton.getBoundingBox();
            this.addChild(this.directionButton);

	        var backgroundButton = cc.Scale9Sprite.create(png_shootButton);
	        var backgroundHighlightedButton = backgroundButton.setColor(cc.RED);
	        var titleButton = cc.LabelTTF.create("", "Marker Felt", 24);
	        titleButton.setOpacity(100);
	        var controlButton = cc.ControlButton.create(titleButton, backgroundButton);
	        controlButton.setPosition(cc.p(WIN_SIZE.width * 0.9, 100));
	        controlButton.setOpacity(100);
	        controlButton.setAdjustBackgroundImage(false);
	        this.addChild(controlButton);
	        controlButton.addTargetWithActionForControlEvents(this, this.touchDownAction, cc.CONTROL_EVENT_TOUCH_DOWN);
            controlButton.addTargetWithActionForControlEvents(this, this.touchDragOutsideAction, cc.CONTROL_EVENT_TOUCH_DRAG_OUTSIDE);
            controlButton.addTargetWithActionForControlEvents(this, this.touchUpInsideAction, cc.CONTROL_EVENT_TOUCH_UP_INSIDE);
            controlButton.addTargetWithActionForControlEvents(this, this.touchUpOutsideAction, cc.CONTROL_EVENT_TOUCH_UP_OUTSIDE);
            controlButton.addTargetWithActionForControlEvents(this, this.touchCancelAction, cc.CONTROL_EVENT_TOUCH_CANCEL);
            
            this.setTouchEnabled(true);            
            this.direction = DIRECTION_NULL;

			bRet = true;
		}
		return bRet;
	},
	touchDownAction:function (sender, controlEvent) {
        this._delegate.addKey(KEY_ATTACK);
    },
    touchUpInsideAction:function (sender, controlEvent) {
        this._delegate.removeKey(KEY_ATTACK);
    },
    touchUpOutsideAction:function (sender, controlEvent) {
      	this._delegate.removeKey(KEY_ATTACK);  
    },
    touchDragOutsideAction:function (sender, controlEvent) {
      	this._delegate.removeKey(KEY_ATTACK);  
    },
    touchCancelAction:function (sender, controlEvent) {
        this._delegate.removeKey(KEY_ATTACK);
    },
	getArea:function(touch) {
		var touchPosition = touch.getLocation();
		if (cc.rectContainsPoint(this.directionArea, touchPosition)) {
			return 1;
		}
		return 0;
	},
	directionForTouch:function(touch) {
		var touchPosition = touch.getLocation();
		var angleRadians = Math.atan2(touchPosition.x - this.directionButton.getPositionX(), touchPosition.y - this.directionButton.getPositionY());
		var angleDegrees = angleRadians * 180.0 / Math.PI;
		angleDegrees -= 90;
		angleDegrees *= -1;
		if ((angleDegrees > 0 && angleDegrees <= 45) ||
			(angleDegrees > -45 && angleDegrees <= 0)) {
			return KEY_RIGHT;
		}
		if (angleDegrees > 45 && angleDegrees <= 135) {
			return KEY_UP;
		}
		if (angleDegrees > 135 && angleDegrees <= 225) {
			return KEY_LEFT;
		}
		if ((angleDegrees > 225 && angleDegrees <= 270) ||
			(angleDegrees > -90 && angleDegrees <= -45)) {
			return KEY_DOWN;
		}
		return null;
	},
	onTouchesBegan:function (touches, event) {
		var area = this.getArea(touches[0]);
		if (area == 1) {
			var key = this.directionForTouch(touches[0]);
			if (key) {
				this.direction = key;
				this._delegate.addKey(key);
			}
		}
	},
	onTouchesMoved:function (touches, event) {
		var area = this.getArea(touches[0]);
		if (area == 1) {
			var key = this.directionForTouch(touches[0]);
			if (this.direction != key) {
				this._delegate.removeKey(this.direction);
			}
			this._delegate.addKey(key);
			this.direction = key;
		}
		else {
			this._delegate.removeKey(key);
		}
	},
	onTouchesEnded:function (touches, event) {
		if (touches.length > 0) {
			var area = this.getArea(touches[0]);
			if (area == 1) {
				var key = this.directionForTouch(touches[0]);
				if (key) {
					this._delegate.removeKey(key);
					this.direction = DIRECTION_NULL;
				}
			}
			else {
				if (this.direction != DIRECTION_NULL) {
					this._delegate.removeKey(this.direction);
					this.direction = DIRECTION_NULL;	
				}
			}
		}
	}
});

Joypad.create = function(delegate) {
	var joypad = new Joypad();
	if (joypad && joypad.init(delegate)) {
		return joypad;
	}
	return null;
};
