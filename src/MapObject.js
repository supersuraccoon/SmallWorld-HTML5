// MapObject.js

/* 
	MAP_OBJECT_TYPE
*/
MAP_OBJECT_CATE_NULL = 10000;
MAP_OBJECT_CATE_BUILDING = 10001;
MAP_OBJECT_CATE_TREE = 10002;
MAP_OBJECT_CATE_FLOWER = 10003;
MAP_OBJECT_CATE_FIGHTER = 10004;
MAP_OBJECT_CATE_BULLET = 10005;

/* 
	MAP_OBJECT_STATE
*/
MAP_OBJECT_STATE_NORMAL = (1 << 0);
MAP_OBJECT_STATE_SELECTED = (1 << 1);
MAP_OBJECT_STATE_TARGETED = (1 << 2);
MAP_OBJECT_STATE_UNDER_ATTACK = (1 << 3);
MAP_OBJECT_STATE_FADE = (1 << 4);
MAP_OBJECT_STATE_DESTORY = (1 << 5);

/* 
	MAP_OBJECT_ACTION
*/
MAP_OBJECT_ACTION_BLINK = 200001;
MAP_OBJECT_ACTION_SCALE = 200002;


/*
	BUILDING_TYPE
*/
BUILDING_TYPE_CANNON_TOWER = 300001;
BUILDING_TYPE_ARROW_TOWER = 300002;

FLOWER_TYPE_COMMON = 400001;

TREE_TYPE_COMMON = 500001;

FIGHTER_TYPE_HERO = 600001;
FIGHTER_TYPE_ROBOT = 600002;


var BulletObject = cc.Sprite.extend({
	_objectCate: MAP_OBJECT_CATE_NULL,
	_objectState: MAP_OBJECT_STATE_NORMAL,
	_direction: 0,
	_character: 0,
	init:function(objectCate, objectImage) {
		if (this.initWithSpriteFrameName(objectImage)) {
			this._objectSize = this.getContentSize(); 
			this._objectCate = objectCate;
			return true;
		}
		return false;
	}
});
BulletObject.create = function(objectCate, objectImage) {
	var bulletObject = new BulletObject();
	if (bulletObject && bulletObject.init(objectCate, objectImage)) {
		return bulletObject;
	}
	return null;
};

/* 
	MapObject
*/

var MapObject = cc.Sprite.extend({
	_objectCate: MAP_OBJECT_CATE_NULL,
	_objectState: MAP_OBJECT_STATE_NORMAL,
	_objectHP: 100,
	_objectSize: null,
	_objectMaxHP: 100,
	_delegate: null,
	// for quad tree
	qTreePositionX: 0,
	qTreePositionY: 0,
	qTreeSizeWidth: 0,
	qTreeSizeHeight: 0,
	init:function(objectCate, objectImage) {
		if (this.initWithSpriteFrameName(objectImage)) {
			// this._objectSprite = cc.Sprite.createWithSpriteFrameName(objectImage);
			this._objectSize = this.getContentSize(); 
			// this.addChild(this._objectSprite);
			this._objectCate = objectCate;
			this.initAnimation();
			this.addHPBar();

			this.canCollidable = true;

			return true;
		}
		return false;
	},
	initAnimation:function() {
		this.explosionFrame = cu.createAnimFrame("explosion", 7, 0.05);
    },
	addHPBar:function() {
		// this._barSprite = HpBarObject.create(60, 10);
		// this._barSprite.setPositionY(-this._objectSprite.getContentSize().height / 1.8);
		// this.addChild(this._barSprite);
	},
    setDelegate:function(delegate) {
        this._delegate = delegate;
    },
	// overide 
	isCollidable:function() {
		return true;
	},
	isTouchable:function() {
		return true;
	},
	getObjectHP:function() {
		return this._objectHP;
	},
	increaseHP:function(value) {
		this._objectHP += value;
		if (this._objectHP > this._objectMaxHP)
			this._objectHP = _objectMaxHP;
		return this._objectHP;
	},
	decreaseHP:function(value) {
		this._objectHP -= value;
		if (this._objectHP < 0)
			this._objectHP = 0;
		return this._objectHP;
	},
	showHPBar:function() {
		// this._barSprite.setVisible(true);
	},
	hideHPBar:function() {
		// this._barSprite.setVisible(false);
	},
	// action 
	runActionForState:function(state) {
		this.addState(state);
		if (state == MAP_OBJECT_STATE_NORMAL) {

		}
		if (state == MAP_OBJECT_STATE_SELECTED) {
			var action = cc.RepeatForever.create(cc.Sequence.create(cc.ScaleTo.create(1.0, 1.2), cc.ScaleTo.create(1.0, 0.8)));
			action.setTag(MAP_OBJECT_ACTION_SCALE);
			this.runAction(action)
		}
		if (state == MAP_OBJECT_STATE_TARGETED) {
			// this._objectSprite.setColor(cc.RED);
			this.showHPBar();
		}
		if (state == MAP_OBJECT_STATE_UNDER_ATTACK) {

		}
		if (state == MAP_OBJECT_STATE_FADE) {
			this.setOpacity(100);
		}
	},
	restoreActionForState:function(state) {
		this.removeState(state);
		if (state == MAP_OBJECT_STATE_NORMAL) {

		}
		if (state == MAP_OBJECT_STATE_SELECTED) {
			this.stopActionByTag(MAP_OBJECT_ACTION_SCALE);
			this.setScale(1.0);
		}
		if (state == MAP_OBJECT_STATE_TARGETED) {
			// this._objectSprite.setColor(cc.WHITE);
			// this.hideHPBar();
		}
		if (state == MAP_OBJECT_STATE_UNDER_ATTACK) {
			
		}
		if (state == MAP_OBJECT_STATE_FADE) {
			this.setOpacity(255);
		}	
	},
	runHitAction:function(hp) {
		if (this.isInState(MAP_OBJECT_STATE_DESTORY))
			return;
		var currentHp = this.decreaseHP(hp);
		if (this._barSprite) {
			this._barSprite.setPercentage(currentHp / this._objectMaxHP);
			if (currentHp <= 0) {
				this._barSprite.setVisible(false);
			}
		}
		if (!this.getActionByTag(MAP_OBJECT_ACTION_BLINK)) {
			var blinkAction = cc.Blink.create(0.1, 1);
			blinkAction.setTag(MAP_OBJECT_ACTION_BLINK);
			this.runAction(blinkAction);
		}
	},
	runDestoryAction:function() {
		this.addState(MAP_OBJECT_STATE_DESTORY);
		this.setColor(cc.WHITE);
		var explosionAnimation = cc.Animation.create(this.explosionFrame, 0.05);
        var explosionAction = cc.Animate.create(explosionAnimation);
        this.runAction(cc.Sequence.create(explosionAction, cc.CallFunc.create(this.removeSelf, this)));
	},
	removeSelf:function(node) {
		this.removeFromParent(true);
	},
	// set && get
	getZOrderOnMap:function() {
		return MAP_SIZE_HEIGHT - (this.getPositionY() - this.getContentSize().height / 2);
	},
	getObjectCate:function() {
		 return this._objectCate;
	},
	// rect
	updateAllRect:function() {
		this.setCollisionRect();
		this.setTouchRect();
		this.setReorderRect();
		this.setHitRect();
		this.qTreePositionX = this.getPositionX() - this._objectSize.width * 0.4;
		this.qTreePositionY = this.getPositionY() - this._objectSize.height * 0.4;
		this.qTreeSizeWidth = this._objectSize.width * 0.8;
		this.qTreeSizeHeight = this._objectSize.height * 0.8;
	},
	setCollisionRect:function() {
		this._collisionRect = cc.rect(this.getPositionX() - this._objectSize.width * 0.4,
									   this.getPositionY() - this._objectSize.height * 0.4,
									   this._objectSize.width,
									   this._objectSize.height * 0.4);
	},
	getCollisionRect:function() {
		return this._collisionRect;
	},
	setTouchRect:function() {
		this._touchRect	= cc.rect(this.getPositionX() - this._objectSize.width / 2,
								   this.getPositionY() - this._objectSize.height / 2,
								   this._objectSize.width,
								   this._objectSize.height);
	},
	getTouchRect:function() {
		return this._touchRect;
	},
	setReorderRect:function() {
		this._reorderRect = cc.rect(this.getPositionX() - this._objectSize.width / 2,
								   this.getPositionY() - this._objectSize.height / 2,
								   this._objectSize.width,
								   this._objectSize.height);
	},
	getReorderRect:function() {
		return this._reorderRect;
	},
	setHitRect:function() {
		this._hitRect = cc.rect(this.getPositionX() - this._objectSize.width * 0.5,
					   			this.getPositionY() - this._objectSize.height * 0.5,
					   			this._objectSize.width,
					   			this._objectSize.height * 0.6);
	},
	getHitRect:function() {
		return this._hitRect;
	},
	getState:function() {
		return this._objectState;
	},
	isInState:function(state) {
		var bitState = this._objectState & state;
		if (bitState == 0)
			return false;
		else
			return true;
	},
	addState:function(state) {
		this._objectState = (this._objectState | state);
	},
	removeState:function(state) {
		this._objectState = (this._objectState & ~ state);
	}
});

// building
var BuildingObject = MapObject.extend({
	init:function(objectCate, objectImage) {
		if (this._super(objectCate, objectImage)) {
			return true;
		}
		return false;
	}
});

var CannonTowerObject = BuildingObject.extend({
	init:function(objectCate, objectImage) {
		if (this._super(objectCate, objectImage)) {
			return true;
		}
		return false;
	}
});
CannonTowerObject.create = function(objectCate, objectImage) {
	var buildingObject = new CannonTowerObject();
	if (buildingObject && buildingObject.init(objectCate, objectImage)) {
		return buildingObject;
	}
	return null;
};

var ArrowTowerObject = BuildingObject.extend({
	init:function(objectCate, objectImage) {
		if (this._super(objectCate, objectImage)) {
			return true;
		}
		return false;
	}
});
ArrowTowerObject.create = function(objectCate, objectImage) {
	var buildingObject = new ArrowTowerObject();
	if (buildingObject && buildingObject.init(objectCate, objectImage)) {
		return buildingObject;
	}
	return null;
};

// flower
var FlowerObject = MapObject.extend({
	init:function(objectCate, objectImage) {
		if (this._super(objectCate, objectImage)) {
			this.hideHPBar();
			return true;
		}
		return false;
	},
	addHPBar:function() {
	},
	// override
	// isCollidable:function() {
	// 	return false;
	// },
	isTouchable:function() {
		return false;
	}
});
FlowerObject.create = function(objectCate, objectImage) {
	var flowerObject = new FlowerObject();
	if (flowerObject && flowerObject.init(objectCate, objectImage)) {
		return flowerObject;
	}
	return null;
};

// tree
var TreeObject = MapObject.extend({
	init:function(objectCate, objectImage) {
		if (this._super(objectCate, objectImage)) {
			return true;
		}
		return false;
	}
});
TreeObject.create = function(objectCate, objectImage) {
	var treeObject = new TreeObject();
	if (treeObject && treeObject.init(objectCate, objectImage)) {
		return treeObject;
	}
	return null;
};

