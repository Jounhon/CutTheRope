function GameMenu(){
	base(this,LSprite,[]);
	var self = this;
	var bitmap;
	var menuLayer;
	menuLayer = new LSprite();
	bitmap=new LBitmap(new LBitmapData(dataList["bg"]));
    bitmap.x=0;
    bitmap.y=0;
    menuLayer.addChild(bitmap);
	self.addChild(menuLayer);

	for(var i=0;i<stageMenu.length;i++){
		self.stageVsMenu(stageMenu[i]);
	}
	var sound = new buttons("sound");
	sound.x = 1200;
	sound.y = 25;
	self.addChild(sound);

	// hint
    hintText = new LTextField();
		hintText.color = "#000000";
		hintText.font = "cursive";
		hintText.size = 20;
		hintText.x = 35;
		hintText.y = 600;
		self.addChild(hintText);
	hintText.text="Hint: 當你輸入\"cut.the.rope\"關卡會全開"

	self.addEventListener(LMouseEvent.MOUSE_UP);
};
GameMenu.prototype.stageVsMenu = function(obj){
	var self = this;
	var bitmap;
	var menuButton,btn_up;
	if(obj.open=="true"){
		btn_up = new LSprite();
		switch(obj.stars){
			case 0:{
				bitmap=new LBitmap(new LBitmapData(dataList["level_0"]));
				break;
			}
			case 1:{
				bitmap=new LBitmap(new LBitmapData(dataList["level_1"]));
				break;
			}
			case 2:{
				bitmap=new LBitmap(new LBitmapData(dataList["level_2"]));
				break;
			}
			default :{
				bitmap=new LBitmap(new LBitmapData(dataList["level_3"]));
				break;
			}
		}
		bitmap.x=0;
		bitmap.y=0;
		btn_up.addChild(bitmap);
		labelText = new LTextField();
		labelText.color = "#ffffff";
		labelText.font = "cursive";
		labelText.size = 35;
		labelText.x = 35;
		labelText.y = 10;
		btn_up.addChild(labelText)
		labelText.text = obj.index+1;
		
		menuButton = new LButton(btn_up,btn_up);
		menuButton.obj = obj;
		menuButton.addEventListener(LMouseEvent.MOUSE_UP,function(event){
			sound_player.playSound("click");
			gameStart(event.clickTarget.obj.index);
		});
	}else{
		btn_up = new LSprite();
		bitmap=new LBitmap(new LBitmapData(dataList["level_lock"]));
		bitmap.x=0;
		bitmap.y=0;
		btn_up.addChild(bitmap);
		menuButton = btn_up;
	};
	self.addChild(menuButton);
	menuButton.x = obj.x * 150 + 450; 
	menuButton.y = obj.y * 150 + 150;

}
