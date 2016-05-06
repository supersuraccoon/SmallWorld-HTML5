/*
    Helper function for cocos2d
*/

/*
  @namespace cu -> Cocos2d Util
*/
var cu = cu || {};

// scale factor
cu.ScaleFactor = function(_xFactor, _yFactor) {
    this.xFactor = _xFactor || 1.0;
    this.yFactor = _yFactor || 1.0;
};

cu.sf = function(xFactor, yFactor) {
	return new cu.ScaleFactor(xFactor, yFactor);
};

cu.ScaleFactorMake = function(size1, size2) {
	return cu.sf(size1.width / size2.width, size1.height / size2.height);
};

cu.ReverseScaleFactor = function(baseFactor) {
	return cu.sf(1.0 / baseFactor.xFactor, 1.0 / baseFactor.yFactor);
};

cu.adjustSpriteSize = function(sprite, factor) {
    sprite.setScaleX(factor.xFactor);
    sprite.setScaleY(factor.yFactor);
    return cc.size(sprite.getContentSize().width * factor.xFactor, sprite.getContentSize().height * factor.yFactor);
};

cu.getProperSize = function(baseSize, sizeToFit) {
	return cu.sf(sizeToFit.width / baseSize.width, sizeToFit.height / baseSize.height);
};

cu.adjustSpriteSizeToFit = function(sprite, sizeToFit) {
	var scaleFactor = cu.getProperSize(sprite.getContentSize(), sizeToFit);
	sprite.setScaleX(scaleFactor.xFactor);
	sprite.setScaleY(scaleFactor.yFactor);
};

cu.positionFromWinSize = function(sizeFactor, winSize) {
	return cc.p(sizeFactor.xFactor * winSize.width, sizeFactor.yFactor * winSize.height);
};

cu.positionFromSize = function(sizeFactor, baseSize) {
	return cc.p(sizeFactor.xFactor * baseSize.width, sizeFactor.yFactor * baseSize.height);
};

cu.sizeFromSize = function(sizeFactor, baseSize) {
	return cc.size(sizeFactor.xFactor * baseSize.width, sizeFactor.yFactor * baseSize.height);
};

cu.centerLayer = function(layer, winSize) {
	var winCenter = cc.pMult(cc.p(winSize.width, winSize.height), 0.5);
	var layerCenter = cc.pMult(cc.p(layer.getContentSize().width, layer.getContentSize().height), 0.5);
	layer.setPosition(cc.pSub(winCenter, layerCenter));
};

// getContentSize() not work for cc.ScrollView
cu.centerLayerWithSize = function(layer, layerSize, winSize) {
	layer.setPosition(cc.pSub(cu.positionFromSizeCenter(winSize), cu.positionFromSizeCenter(layerSize)));
};

cu.positionFromSizeCenter = function(baseSize) {
	return cc.pMult(cc.p(baseSize.width, baseSize.height), 0.5);
};

cu.randomPositionInRect = function(targetRect, inflactX, inflactY) {
	return cc.p(targetRect.x + inflactX + Math.random() * (targetRect.width - inflactX * 2), 
				targetRect.y + inflactY + Math.random() * (targetRect.height - inflactY * 2));
};

// animation
cu.createAnimFrame = function(animName, fameCount, delay) {
	var animFrames = [];
    for (var frame = 1; frame <= fameCount; frame++) {
        var frameObject = cc.SpriteFrameCache.getInstance().getSpriteFrame(animName + "_" + frame + ".png");
        animFrames.push(frameObject);
    }
    return animFrames;
};

// data
cu.dataFromFile = function(file, decode) {
    if (decode == null || decode == false)
        return cc.FileUtils.getInstance().getStringFromFile(file);
    else {
        return MyBase64.decryptInfo(cc.FileUtils.getInstance().getStringFromFile(file));
    }
};

cu.jsonDictFromFile = function(file, decode) {
	if (decode == null || decode == false)
		return JSON.parse(cc.FileUtils.getInstance().getStringFromFile(file));
	else {
		return JSON.parse(MyBase64.decryptInfo(cc.FileUtils.getInstance().getStringFromFile(file)));
	}
};