// FighterObject.js

// walk direction
DIRECTION_NULL = 0;
DIRECTION_DOWN = 1;
DIRECTION_RIGHT = 2;
DIRECTION_UP = 3;
DIRECTION_LEFT = 4;

FIGHTER_ACTION_WALK = 20001;
FIGHTER_ACTION_SHOOT = 20002;
FIGHTER_ACTION_ATTACK = 20003;

var FIGHTER_STATE_IDLE = (1 << 10);
var FIGHTER_STATE_WALKING = (1 << 11);
var FIGHTER_STATE_SHOOTING = (1 << 12);
var FIGHTER_STATE_ATTACK = (1 << 13);

var FighterObject = MapObject.extend({
    _fighterMoveSpeed: 0,
    _walkDirection: DIRECTION_NULL,
    _faceDirection: DIRECTION_DOWN,
    _nextPosition: null,
    init:function(objectCate, fighterImage) {
        if (this._super(objectCate, fighterImage)) {
            this.addState(FIGHTER_STATE_IDLE);
            this._barSprite.setPosition(this._objectSize.width / 2, -this._objectSize.height / 1.5);
            return true;
        }
        return false;
    },
    addHPBar:function() {
        this._barSprite = HpBarObject.create(60, 10);
        this._barSprite.setPositionY(-this._objectSize.height / 1.8);
        this.addChild(this._barSprite);
    },
    isHero:function() {
        return false;
    },
    setFighterMoveSpeed:function(fighterMoveSpeed) {
        this._fighterMoveSpeed = fighterMoveSpeed;
    },
    getFighterMoveSpeed:function() {
        return this._fighterMoveSpeed;
    },
    getFighterRect:function() {
        return cc.rect(this.getPositionX() - this._objectSize.width / 2,
                       this.getPositionY() - this._objectSize.height / 2,
                       this._objectSize.width,
                       this._objectSize.height);
    },
    walk:function(newDirection) {
        if (newDirection != this._walkDirection || !this.isInState(FIGHTER_STATE_WALKING)) {
            if (!this.isInState(FIGHTER_STATE_WALKING))
                this.addState(FIGHTER_STATE_WALKING);
            this._walkDirection = newDirection;
            this._faceDirection = newDirection;
            var walkFrame = null;
            if (this.getWalkDirection() == DIRECTION_LEFT) {
                walkFrame = this.walkLeftFrame;
            }
            if (this.getWalkDirection() == DIRECTION_RIGHT) {
                walkFrame = this.walkRightFrame;
            }
            if (this.getWalkDirection() == DIRECTION_UP) {
                walkFrame = this.walkUpFrame;
            }
            if (this.getWalkDirection() == DIRECTION_DOWN) {
                walkFrame = this.walkDownFrame;
            }
            var walkAnimation = cc.Animation.create(walkFrame, 0.1);
            var walkAction = cc.RepeatForever.create(cc.Animate.create(walkAnimation));
            walkAction.setTag(FIGHTER_ACTION_WALK);
            this.runAction(walkAction);
        }
    },
    stopWalk:function() {
        if (this.isInState(FIGHTER_STATE_WALKING)) {
            this._walkDirection = DIRECTION_NULL;
            this.removeState(FIGHTER_STATE_WALKING);
            this.addState(FIGHTER_STATE_IDLE);
            this.stopActionByTag(FIGHTER_ACTION_WALK);
        }   
    },
    shoot:function() {
        if (this.isInState(FIGHTER_STATE_SHOOTING))
            return;
        if (!this.getActionByTag(FIGHTER_ACTION_SHOOT)) {
            var shootAction = cc.Sequence.create(cc.DelayTime.create(0.2));
            shootAction.setTag(FIGHTER_ACTION_SHOOT);
            this.runAction(shootAction);
            this.addState(FIGHTER_STATE_SHOOTING);
        }
    },
    stopShoot:function() {
        this.removeState(FIGHTER_STATE_SHOOTING);
    },
    attack:function() {
        if (this.isInState(FIGHTER_STATE_ATTACK))
            return;
        if (!this.getActionByTag(FIGHTER_ACTION_ATTACK)) {
            var shootAction = cc.Sequence.create(cc.DelayTime.create(0.2));
            shootAction.setTag(FIGHTER_ACTION_ATTACK);
            this.runAction(shootAction);
            this.addState(FIGHTER_STATE_ATTACK);
        }
    },
    stopAttack:function() {
        this.removeState(FIGHTER_STATE_ATTACK);
    },
    doAttack:function() {
        
    },
    updatePosition:function(targetPosition) {
        this.setPosition(targetPosition);
        this.setZOrder(MAP_SIZE_HEIGHT - (this.getPositionY() - this._objectSize.height / 2));
    },
    getNextWalkPosition:function() {
        if (this._walkDirection == DIRECTION_LEFT) {
            return cc.p(this.getPositionX() - this._fighterMoveSpeed, this.getPositionY());
        }
        if (this._walkDirection == DIRECTION_RIGHT) {
            return cc.p(this.getPositionX() + this._fighterMoveSpeed, this.getPositionY());
        }
        if (this._walkDirection == DIRECTION_UP) {
            return cc.p(this.getPositionX(), this.getPositionY() + this._fighterMoveSpeed);
        }
        if (this._walkDirection == DIRECTION_DOWN) {
            return cc.p(this.getPositionX(), this.getPositionY() - this._fighterMoveSpeed);
        }
        return cc.p(0, 0);
    },
    getCollidePosition:function(targetPosition) {
        if (this._walkDirection == DIRECTION_LEFT) {
            return cc.p(targetPosition.x - this._objectSize.width / 2, 
                        targetPosition.y + this._objectSize.height / 2);
        }
        if (this._walkDirection == DIRECTION_RIGHT) {
            return cc.p(targetPosition.x + this._objectSize.width / 2, 
                        targetPosition.y + this._objectSize.height / 2);
        }
        if (this._walkDirection == DIRECTION_UP) {
            return cc.p(targetPosition.x, 
                        targetPosition.y + this._objectSize.height / 2);
        }
        if (this._walkDirection == DIRECTION_DOWN) {
            return cc.p(targetPosition.x, 
                        targetPosition.y - this._objectSize.height / 2);
        }
        return cc.p(0, 0);
    },
    getWalkDirection:function() {
        return this._walkDirection;
    },
    setWalkDirection:function(walkDirection) {
        this._walkDirection = walkDirection;
    },
    getHitRect:function() {
        return cc.rect(this.getPositionX() - this._objectSize.width / 2,
                       this.getPositionY() - this._objectSize.height / 2,
                       this._objectSize.width,
                       this._objectSize.height);
    }
});


HERO_MOVE_SPEED = 3;
HERO_Z_ORDER = 100;

var HeroFighter = FighterObject.extend({
    init:function(objectCate) {
        if (this._super(objectCate, "hero_walk_down_1.png")) {
            this._objectHP = 1000;
            this._objectMaxHP = 1000;

            this.setPosition(cc.p(MAP_SIZE_WIDTH * 0.1, MAP_SIZE_HEIGHT * 0.1));
            this.setZOrder(HERO_Z_ORDER);
            this.setColor(cc.RED);
            this.setFighterMoveSpeed(HERO_MOVE_SPEED);

            // this.shootingRangeSprite = DotSprite.create(150);
            // this.shootingRangeSprite.setColor(cc.RED);
            // this.shootingRangeSprite.setOpacity(100);
            // this.addChild(this.shootingRangeSprite);

            return true;
        }
        return false;
    },
    initAnimation:function() {
        this._super();
        this.walkDownFrame = cu.createAnimFrame("hero_walk_down", 3, 0.1);
        this.walkUpFrame = cu.createAnimFrame("hero_walk_up", 3, 0.1);
        this.walkLeftFrame = cu.createAnimFrame("hero_walk_left", 3, 0.1);
        this.walkRightFrame = cu.createAnimFrame("hero_walk_right", 3, 0.1);
        this.attackFrame = cu.createAnimFrame("kan", 4, 0.1);
    },
    isHero:function() {
        return true;
    }
});

HeroFighter.create = function(objectCate) {
    var heroFighter = new HeroFighter();
    if (heroFighter && heroFighter.init(objectCate)) {
        return heroFighter;
    }
    return null;
};

ROBOT_MOVE_SPEED = 2;
ROBOT_Z_ORDER = 100;

var RobotFighter = FighterObject.extend({
    init:function(objectCate, objectImage) {
        this.objectImage = objectImage;
        if (this._super(objectCate, objectImage + "_walk_down_1.png")) {
            this.setPosition(cc.p(50 + Math.random() * (MAP_SIZE_WIDTH - 100), 
                                  50 + Math.random() * (MAP_SIZE_HEIGHT - 100)));
            this.setZOrder(ROBOT_Z_ORDER);
            this.setFighterMoveSpeed(ROBOT_MOVE_SPEED);
            this._aiTimer = 0;
            this._objectHP = 100;
            this._objectMaxHP = 100;

            return true;
        }
        return false;
    },
    initAnimation:function() {
        this._super();
        this.walkDownFrame = cu.createAnimFrame(this.objectImage + "_walk_down", 3, 0.1);
        this.walkUpFrame = cu.createAnimFrame(this.objectImage + "_walk_up", 3, 0.1);
        this.walkLeftFrame = cu.createAnimFrame(this.objectImage + "_walk_left", 3, 0.1);
        this.walkRightFrame = cu.createAnimFrame(this.objectImage + "_walk_right", 3, 0.1);
        this.attackFrame = cu.createAnimFrame("kan", 4, 0.1);
    },
    // ai
    doAI:function(dt) {
        // walk
        if (Math.floor(Math.random() * 100) < 98) {
            var newDirection;
            if (this._walkDirection == DIRECTION_NULL) {
                newDirection = 1 + Math.floor(Math.random() * 4);
            }
            else {
                if (Math.floor(Math.random() * 100) <= 95)
                    newDirection = this._walkDirection;
                else
                    newDirection = 1 + Math.floor(Math.random() * 4);
            }
            if (newDirection == DIRECTION_NULL) {
                this.stopWalk();
            }
            else {
                if (this._walkDirection != newDirection) {
                    this.stopWalk();
                }
                this.walk(newDirection);
            }
        }
        // shoot
        if (Math.floor(Math.random() * 100) < 10) {
            this.shoot();
        }
        else {
            this.stopShoot();
            if (Math.floor(Math.random() * 100) < 80) {
                this.attack();
            }
            else {
                this.stopAttack();
            }
        }
    }
});

RobotFighter.create = function(objectCate, objectImage) {
    var heroFighter = new RobotFighter();
    if (heroFighter && heroFighter.init(objectCate, objectImage)) {
        return heroFighter;
    }
    return null;
};

