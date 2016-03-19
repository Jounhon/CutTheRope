function GameLogo(){
	base(this,LSprite,[]);
	var self = this;
	
	var bitmap,logoLayer;
	
	logoLayer = new LSprite();
	bitmap=new LBitmap(new LBitmapData(dataList["bg"]));
    bitmap.x=0;
    bitmap.y=0;
    logoLayer.addChild(bitmap);
	self.addChild(logoLayer);
	
	logoLayer = new LSprite();
	logoLayer.x = 450;
	logoLayer.y = 50;
	bitmap=new LBitmap(new LBitmapData(dataList["logo"]));
    bitmap.x=0;
    bitmap.y=0;
	logoLayer.addChild(bitmap);
	self.addChild(logoLayer);
	
	var play = new buttons("play");
	play.x = 550;
	play.y = 500;
	self.addChild(play);   // 加入button

	var sound = new buttons("sound");
	sound.x = 50;
	sound.y = 650;
	self.addChild(sound);  

	self.addEventListener(LMouseEvent.MOUSE_UP);
};