//
require("jsb_cocos2d_constants.jsc");
require("jsb_cocos2d.jsc");
require("jsb_cocos2d_extension.jsc");
require("jsb_chipmunk_constants.jsc");
require("jsb_chipmunk.jsc");
require("jsb_opengl_constants.jsc");
require("jsb_opengl.jsc");
require("jsb_sys.jsc");
require("jsb_deprecated.jsc");

require("resource.jsc");
require("CocosUtils.jsc");
require("ShapeSprite.jsc");
require("MapObject.jsc");
require("FighterObject.jsc");
require("MapObjectManager.jsc");
require("Joypad.jsc");
require("MainScene.jsc");
try {
	var director = cc.Director.getInstance();
    // director.setDisplayStats(false);
    var h = new MainScene();
    director.runWithScene(h);
    
} catch(e) {log(e);}
