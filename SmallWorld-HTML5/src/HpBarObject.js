// HpBarObject.js
var HpBarObject = cc.Layer.extend({
	init:function(width, height) {
		if (this._super()) {
			this._hpSpriteBg = cc.Sprite.createWithSpriteFrameName("hpBar.png");
			this._hpSpriteBg.setColor(cc.c3b(100, 100, 100));
			this._hpSpriteBg.setScaleX(width / this._hpSpriteBg.getContentSize().width);
			this._hpSpriteBg.setScaleY(height / this._hpSpriteBg.getContentSize().height);
			this.addChild(this._hpSpriteBg);

			this._hpSprite = cc.Sprite.createWithSpriteFrameName("hpBar.png");
			this._hpSprite.setAnchorPoint(cc.p(0, 0.5));
			this._hpSprite.setPosition(cc.p(0, this._hpSpriteBg.getContentSize().height / 2));
			this._hpSpriteBg.addChild(this._hpSprite);
			return true;
		}
		return false;
	},
	setPercentage:function(percent) {
		this._hpSprite.setScaleX(percent);
	}
});

HpBarObject.create = function(color, width, height) {
	var hpBarObject = new HpBarObject();
	if (hpBarObject && hpBarObject.init(color, width, height)) {
		return hpBarObject;
	}
	return null;
};
