// MapObjectManager.js
var MapObjectManager = function () {
    this.init = function() {
        this._mapObjectArray = [];
        this._fireBallArray = [];
        this._fighterArray = [];
    },
    this.addMapObject = function(mapObject, type) {
        var targetArray = null;
        if (type == MAP_OBJECT_CATE_BUILDING || type == MAP_OBJECT_CATE_TREE || type == MAP_OBJECT_CATE_FLOWER)
            targetArray = this._mapObjectArray;
        if (type == MAP_OBJECT_CATE_FIGHTER)
            targetArray = this._fighterArray;
        if (type == MAP_OBJECT_CATE_BULLET)
            targetArray = this._fireBallArray;
        if (!targetArray)
            return false;
        if (targetArray.indexOf(mapObject) != -1)
            return false;
        targetArray.push(mapObject);
        return true;
    },
    this.removeMapObject = function(mapObject, type) {
        var targetArray = null;
        if (type == MAP_OBJECT_CATE_BUILDING || type == MAP_OBJECT_CATE_TREE || type == MAP_OBJECT_CATE_FLOWER)
            targetArray = this._mapObjectArray;
        if (type == MAP_OBJECT_CATE_FIGHTER)
            targetArray = this._fighterArray;
        if (type == MAP_OBJECT_CATE_BULLET)
            targetArray = this._fireBallArray;
        if (!targetArray)
            return false;
        var objectIndex = targetArray.indexOf(mapObject);
        if (objectIndex == -1)
            return false;
        targetArray.splice(objectIndex, 1);
        return true;
    },
    this.addFireBall = function(position, direction, range, character) {
        var fireBallObject = BulletObject.create(0, "fireBall.png");
        fireBallObject._direction = direction;
        fireBallObject._character = character;
        this.bulletBatch.addChild(fireBallObject, 99999);
        this.addMapObject(fireBallObject, MAP_OBJECT_CATE_BULLET);
        if (direction == DIRECTION_UP) {
            fireBallObject.setPosition(cc.p(position.x, position.y + fireBallObject._objectSize.height));
            fireBallObject.setRotation(-90);
            fireBallObject.runAction(cc.Sequence.create(cc.MoveBy.create(0.8, cc.p(0, range)),
                                                        cc.CallFunc.create(this.removeFireBall, this)));
        }
        if (direction == DIRECTION_DOWN) {
            fireBallObject.setPosition(cc.p(position.x, position.y - fireBallObject._objectSize.height));
            fireBallObject.setRotation(90);
            fireBallObject.runAction(cc.Sequence.create(cc.MoveBy.create(0.8, cc.p(0, -range)),
                                                        cc.CallFunc.create(this.removeFireBall, this)));
        }
        if (direction == DIRECTION_LEFT) {
            fireBallObject.setPosition(cc.p(position.x - fireBallObject._objectSize.width, position.y));
            fireBallObject.setRotation(-180);
            fireBallObject.runAction(cc.Sequence.create(cc.MoveBy.create(0.8, cc.p(-range, 0)),
                                                        cc.CallFunc.create(this.removeFireBall, this)));
        }
        if (direction == DIRECTION_RIGHT) {
            fireBallObject.setPosition(cc.p(position.x + fireBallObject._objectSize.width, position.y));
            fireBallObject.runAction(cc.Sequence.create(cc.MoveBy.create(0.8, cc.p(range, 0)),
                                                        cc.CallFunc.create(this.removeFireBall, this)));
        }
    },
    this.removeFireBall = function(fireBallObject) {
        fireBallObject.removeFromParent(true);
        this.removeMapObject(fireBallObject, MAP_OBJECT_CATE_BULLET);
    },
    this.getCollidableObjectArray = function() {
        var resultArray = []
        for (var objectIndex in this._mapObjectArray) {
            var objectSprite = this._mapObjectArray[objectIndex];
            if (objectSprite.isCollidable())
                resultArray.push(objectSprite);
        }
        return resultArray;
    },
    this.getTouchableObjectArray = function() {
        var resultArray = []
        for (var objectIndex in this._mapObjectArray) {
            var objectSprite = this._mapObjectArray[objectIndex];
            if (objectSprite.isTouchable())
                resultArray.push(objectSprite);
        }
        return resultArray;
    },
    //
    this.createMapObject = function(objectCate, objectType, parentLayer) {
        var mapObject = null;
        if (objectCate == MAP_OBJECT_CATE_BUILDING) {
            if (objectType == BUILDING_TYPE_CANNON_TOWER) {
                var image = ["building1.png", "building2.png"][Math.floor(Math.random() * 2)];
                mapObject = CannonTowerObject.create(objectCate, image);
                mapObject.setPosition(this.getProperPosition());
            }
            else if (objectType == BUILDING_TYPE_ARROW_TOWER) {
                var image = ["building3.png", "building4.png"][Math.floor(Math.random() * 2)];
                mapObject = ArrowTowerObject.create(objectCate, image);
                mapObject.setPosition(this.getProperPosition());
            }
            else {
                cc.log("wrong building type: " + objectType);
                return null;
            }
        }
        else if (objectCate == MAP_OBJECT_CATE_FLOWER) {
            if (objectType == FLOWER_TYPE_COMMON) {
                var image = ["flower1.png", "flower2.png", "flower3.png"][Math.floor(Math.random() * 3)];
                mapObject = FlowerObject.create(objectCate, image);
                mapObject.setPosition(this.getProperPosition());
            }
            else {
                cc.log("wrong flower type: " + objectType);
                return null;
            }
        } 
        else if (objectCate == MAP_OBJECT_CATE_TREE) {
            if (objectType == TREE_TYPE_COMMON) {
                var image = ["tree1.png", "tree2.png", "tree3.png"][Math.floor(Math.random() * 3)];
                mapObject = TreeObject.create(objectCate, image);
                mapObject.setPosition(this.getProperPosition());
            }
            else {
                cc.log("wrong tree type: " + objectType);
                return null;
            }
        } 
        else if (objectCate == MAP_OBJECT_CATE_FIGHTER) {
            if (objectType == FIGHTER_TYPE_HERO) {
                var image = ["hero"][Math.floor(Math.random() * 1)];
                mapObject = HeroFighter.create(objectCate, image);
            }
            else if (objectType == FIGHTER_TYPE_ROBOT) {
                var image = ["kulou", "sishen", "huoshen", "shuishen", "niuwang", "heian"][Math.floor(Math.random() * 6)];
                mapObject = RobotFighter.create(objectCate, image);
            }
            else {
                cc.log("wrong fighter type: " + objectType);
                return null;
            }
        }
        else {
            cc.log("wrong object cate: " + objectCate);
        }
        mapObject.updateAllRect();
        parentLayer.addChild(mapObject, mapObject.getZOrderOnMap());
        if (objectCate != MAP_OBJECT_CATE_FLOWER) {
            this.addMapObject(mapObject, objectCate);
        }
        return mapObject;
    },
    this.checkCollision = function() {
        for (var i = 0, length = this._fighterArray.length; i < length; i++) {
            var fighterObject = this._fighterArray[i];
            if (fighterObject.isInState(FIGHTER_STATE_WALKING)) {
                var canMove = true;
                var nextPosition = fighterObject.getNextWalkPosition();
                // optimize
                if (nextPosition.x <= 50 || nextPosition.y <= 50 || nextPosition.x >= MAP_SIZE_WIDTH - 50 || nextPosition.y >= MAP_SIZE_HEIGHT - 50) {
                    // cc.log("collision over boundry");
                    continue;
                }
                var collidableObjectArray = MapObjectManager.getInstance().getCollidableObjectArray();
                for (var objectIndex in collidableObjectArray) {
                    var objectObject = collidableObjectArray[objectIndex];
                    if (cc.rectContainsPoint(objectObject.getCollisionRect(), nextPosition)) {
                        // cc.log("collision detected with type: " + objectObject.getObjectType());
                        canMove = false;
                        break;
                    }
                }
                if (canMove) {
                    fighterObject.updatePosition(nextPosition);
                    if (fighterObject.isHero()) {
                        this.reorderBuildings(fighterObject.getFighterRect(), fighterObject.getZOrder());
                    }
                }
            }
            if (fighterObject.isInState(FIGHTER_STATE_SHOOTING)) {
                fighterObject.removeState(FIGHTER_STATE_SHOOTING);
                this.addFireBall(fighterObject.getPosition(), fighterObject._faceDirection, 200, (fighterObject.isHero() ? 0 : 1));
            }
        }
        return true
    },
    this.getProperPosition = function() {
        var randomPosition = cc.p(0, 0);
        do {
            randomPosition = cc.p(50 + Math.random() * (MAP_SIZE_WIDTH - 100), 
                                  50 + Math.random() * (MAP_SIZE_HEIGHT - 100));
        } while (0);
        return randomPosition;
    },
    this.reorderBuildings = function(baseRect, baseZOrder) {
        for (var objectIndex in this._mapObjectArray) {
            var mapObject = this._mapObjectArray[objectIndex];
            if (cc.rectIntersectsRect(baseRect, mapObject.getReorderRect())) {
                if (baseZOrder < mapObject.getZOrder()) {
                    if (!mapObject.isInState(MAP_OBJECT_STATE_FADE)) {
                        mapObject.runActionForState(MAP_OBJECT_STATE_FADE);
                    }
                }
                else {
                    if (mapObject.isInState(MAP_OBJECT_STATE_FADE)) {
                        mapObject.restoreActionForState(MAP_OBJECT_STATE_FADE);
                    }   
                }
            }
            else {
                if (mapObject.isInState(MAP_OBJECT_STATE_FADE)) {
                    mapObject.restoreActionForState(MAP_OBJECT_STATE_FADE);
                }
            }
        }
    },
    this.markObjectInRange = function(targetPosition, range) {
        var touchableObjectArray = MapObjectManager.getInstance().getTouchableObjectArray();
        for (var objectIndex in touchableObjectArray) {
            var mapObject = touchableObjectArray[objectIndex];
            if (cc.pDistance(mapObject.getPosition(), targetPosition) <= range) {
                if (!mapObject.isInState(MAP_OBJECT_STATE_TARGETED))
                    mapObject.runActionForState(MAP_OBJECT_STATE_TARGETED);
            }
            else {
                if (mapObject.isInState(MAP_OBJECT_STATE_TARGETED))
                    mapObject.restoreActionForState(MAP_OBJECT_STATE_TARGETED);
                if (mapObject.isInState(MAP_OBJECT_STATE_SELECTED))
                    mapObject.restoreActionForState(MAP_OBJECT_STATE_SELECTED);
            }
        }
    },
    this.handleTouchEvent = function(touchPosition) {
        var touchableObjectArray = MapObjectManager.getInstance().getTouchableObjectArray();
        var selectedMapObjectArray = [];
        for (var objectIndex in touchableObjectArray) {
            var mapObject = touchableObjectArray[objectIndex];
            if (cc.rectContainsPoint(mapObject.getTouchRect(), touchPosition)) {
                if (!mapObject.isInState(MAP_OBJECT_STATE_TARGETED))
                    continue;
                if (mapObject.isInState(MAP_OBJECT_STATE_SELECTED)) {
                    mapObject.restoreActionForState(MAP_OBJECT_STATE_SELECTED);
                }                     
                else {
                    selectedMapObjectArray.push(mapObject);
                    mapObject.runActionForState(MAP_OBJECT_STATE_SELECTED);
                }
            }
        }
        return selectedMapObjectArray;
    },
    this.checkShooting = function() {
        if (this._fireBallArray.length <= 0)
            return;
        var touchableObjectArray = MapObjectManager.getInstance().getTouchableObjectArray();
        var bulletHitArray = [];
        var buildingHitArray = [];
        var fighterHitArray = [];
        for (var fireBallIndex in this._fireBallArray) {
            var fireBallObject = this._fireBallArray[fireBallIndex];
            var hitObject = null;
            // check building
            for (var objectIndex in touchableObjectArray) {    
                var mapObject = touchableObjectArray[objectIndex];
                if (cc.rectIntersectsRect(mapObject.getHitRect(), fireBallObject.getBoundingBox())) {
                    if (buildingHitArray.indexOf(mapObject) == -1)
                        hitObject = mapObject;
                }
            }
            if (hitObject) {
                buildingHitArray.push(hitObject);
                bulletHitArray.push(fireBallObject);
                fireBallObject.stopAllActions();
                fireBallObject.setVisible(false);
            }
            else {
                // not hitting a building, continue to check fighter
                for (var fighterIndex in this._fighterArray) {
                    var fighterObject = this._fighterArray[fighterIndex];
                    if ((fighterObject.isHero() && fireBallObject._character == 0) ||
                        (!fighterObject.isHero() && fireBallObject._character == 1))
                        continue;
                    if (cc.rectIntersectsRect(fighterObject.getFighterRect(), fireBallObject.getBoundingBox())) {
                        if (fighterHitArray.indexOf(fighterObject) == -1)
                            hitObject = fighterObject;
                    }
                }
                if (hitObject) {
                    fighterHitArray.push(hitObject);
                    bulletHitArray.push(fireBallObject);
                    fireBallObject.stopAllActions();
                    fireBallObject.setVisible(false);
                }
            }
        }

        // handle building
        for (var index in buildingHitArray) {
            var mapObject = buildingHitArray[index];
            mapObject.runHitAction(50);
            if (mapObject.getObjectHP() <= 0) {
                mapObject.runDestoryAction();
                this.removeMapObject(mapObject, MAP_OBJECT_CATE_BUILDING);
            }
        }
        // handle fire ball
        for (var index in bulletHitArray) {
            var fireBallObject = bulletHitArray[index];
            this.removeFireBall(fireBallObject);
        }
        // handle robot
        for (var index in fighterHitArray) {
            var robotObject = fighterHitArray[index];
            robotObject.runHitAction(10);
            if (robotObject.getObjectHP() <= 0) {
                robotObject.runDestoryAction();
                var objectIndex = this._fighterArray.indexOf(robotObject);
                if (objectIndex != -1)
                    this._fighterArray.splice(objectIndex, 1);
            }
        }
    }
};

var sharedMapObjectManager = null;
MapObjectManager.getInstance = function () {
    if (sharedMapObjectManager == null) {
        sharedMapObjectManager = new MapObjectManager();
        sharedMapObjectManager.init();
    }
    return sharedMapObjectManager;
};
