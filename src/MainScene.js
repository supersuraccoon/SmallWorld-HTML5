// MainScene.js
cc.SPRITE_DEBUG_DRAW = 0;

var MainSceneLayer = cc.Layer.extend({
	init:function() {
		this._super();
		WIN_SIZE = cc.Director.getInstance().getWinSize();

		cc.SpriteFrameCache.getInstance().addSpriteFrames(plist_explosion);
		cc.SpriteFrameCache.getInstance().addSpriteFrames(plist_character);
		cc.SpriteFrameCache.getInstance().addSpriteFrames(plist_sprites);
		cc.SpriteFrameCache.getInstance().addSpriteFrames(plist_action);

		this.tiledLayer = cc.TMXTiledMap.create(tmx_tile);
		this.addChild(this.tiledLayer);

		MAP_SIZE_WIDTH = this.tiledLayer.getContentSize().width;
		MAP_SIZE_HEIGHT = this.tiledLayer.getContentSize().height;

        this.mapBatch = cc.SpriteBatchNode.create(png_sprites);
        this.tiledLayer.addChild(this.mapBatch);
        MapObjectManager.getInstance().bulletBatch = this.mapBatch;

		this.initMap();
		
		// add hero
		this.heroObject = MapObjectManager.getInstance().createMapObject(MAP_OBJECT_CATE_FIGHTER, FIGHTER_TYPE_HERO, this.tiledLayer);
		this.heroObject.setDelegate(this);

        var followAction = cc.Follow.create(this.heroObject, cc.rect(0, 0, MAP_SIZE_WIDTH, MAP_SIZE_HEIGHT));
        this.tiledLayer.runAction(followAction);
		
	    // enable keyboard
	    this.allKeys = [];
	    if( 'keyboard' in sys.capabilities ) {
            this.setKeyboardEnabled(true);
        }
        this.mJoypad = Joypad.create(this);
		this.addChild(this.mJoypad, 999999);

        for (var i = 0; i < 20; i ++) {
			MapObjectManager.getInstance().createMapObject(MAP_OBJECT_CATE_FIGHTER, FIGHTER_TYPE_ROBOT, this.tiledLayer);
        }

		// update
        this.scheduleUpdate();
		return true;
	},
	// joypad delegate
	addKey:function(key) {
		if (this.allKeys[key] == undefined || this.allKeys[key] == false)
			this.allKeys[key] = true;
	},
	removeKey:function(key) {
		if (this.allKeys[key] == undefined || this.allKeys[key] == true)
			this.allKeys[key] = false;
	},
	update:function(dt) {
		// hero walk logic
		var newDirection = DIRECTION_NULL;
		if (this.allKeys[KEY_UP]) {
			newDirection = DIRECTION_UP;	
		}
		if (this.allKeys[KEY_LEFT]) {
			newDirection = DIRECTION_LEFT;
		}
		if (this.allKeys[KEY_DOWN]) {
			newDirection = DIRECTION_DOWN;
		}
		if (this.allKeys[KEY_RIGHT]) {
			newDirection = DIRECTION_RIGHT;
		}
		if (newDirection == DIRECTION_NULL) {
			this.heroObject.stopWalk();
		}
		else {
			if (this.heroObject._walkDirection != newDirection) {
				this.heroObject.stopWalk();
			}
			this.heroObject.walk(newDirection);
		}
		// hero shoot logic
		if (this.allKeys[KEY_ATTACK]) {
			this.heroObject.shoot();
		}
		else {
			this.heroObject.stopShoot();
		}
		// do robot ai
		var robotArray = MapObjectManager.getInstance()._fighterArray;
		for (var i = 0, length = robotArray.length; i < length; i++) {
			if (Math.floor(Math.random() * 100) < 50)
                continue;
			var robot = robotArray[i];
			if (!robot.isHero())
				robot.doAI();
		}

		MapObjectManager.getInstance().checkCollision();
		MapObjectManager.getInstance().checkShooting();
	},
	//
	initMap:function() {
		// add some buildings
		for (var i = 0; i < 20; i ++) {
			if (i < 5) 
				MapObjectManager.getInstance().createMapObject(MAP_OBJECT_CATE_BUILDING, BUILDING_TYPE_CANNON_TOWER, this.tiledLayer);
			else
				MapObjectManager.getInstance().createMapObject(MAP_OBJECT_CATE_BUILDING,BUILDING_TYPE_ARROW_TOWER, this.tiledLayer);
		}
		for (var i = 0; i < 10; i ++) {
			MapObjectManager.getInstance().createMapObject(MAP_OBJECT_CATE_FLOWER, FLOWER_TYPE_COMMON, this.mapBatch);
		}
		for (var i = 0; i < 30; i ++) {
			MapObjectManager.getInstance().createMapObject(MAP_OBJECT_CATE_TREE, TREE_TYPE_COMMON, this.tiledLayer);
		}
	},
    // keyboard
    onKeyUp:function(key) {
    	this.allKeys[key] = false;
    },
    onKeyDown:function(key) {
    	this.allKeys[key] = true;
    }
});

var MainScene = cc.Scene.extend({
	onEnter:function() {
		this._super();
		// add layer
		var mainSceneLayer = new MainSceneLayer();
		mainSceneLayer.init();
		this.addChild(mainSceneLayer);
	}
});