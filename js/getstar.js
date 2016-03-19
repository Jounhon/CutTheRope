function get_star(countstar){
	base(this,LSprite,[]);
	var self = this;
	var bitmap,layer;

	if(stageMenu[stageIndex].stars<countstar){
		if(countstar>3) countstar=3;
		stageMenu[stageIndex].stars=countstar;
	}
	if(stageIndex<8)stageMenu[stageIndex+1].open=true;

	if (typeof(Storage) != "undefined") {
    // Store
    	for(var i=0;i<9;i++){
    		localStorage.setItem("stars"+i, stageMenu[i].stars);
    		localStorage.setItem("opens"+i, stageMenu[i].open);
    	}
	}

	layer=new LSprite();
	bitmap=new LBitmap(new LBitmapData(dataList["bg"]));
	bitmap.x=0;
    bitmap.y=0;
    layer.addChild(bitmap);
	self.addChild(layer);

	layer=new LSprite();
	if(countstar==0){
		bitmap=new LBitmap(new LBitmapData(dataList["bad"]));
	}
	else if(countstar==1){
		bitmap=new LBitmap(new LBitmapData(dataList["good"]));
	}
	else if(countstar==2){
		bitmap=new LBitmap(new LBitmapData(dataList["great"]));
	}
	else if(countstar==3){
		bitmap=new LBitmap(new LBitmapData(dataList["excellent"]));
	}
	layer.x=550;
	layer.y=150;
	bitmap.x=0;
    bitmap.y=0;
    layer.addChild(bitmap);
	self.addChild(layer);

	for(var i=1;i<=3;i++){
		layer=new LSprite();
		if(i<=countstar){
			bitmap=new LBitmap(new LBitmapData(dataList["getstar"]));
		}
		else{
			bitmap=new LBitmap(new LBitmapData(dataList["getstar2"]));
		}
		layer.x=500+(i-1)*100;
		layer.y=230+(i%2)*20;
		bitmap.x=0;
		bitmap.y=0;
		layer.addChild(bitmap);
		self.addChild(layer);
	};


	layer=new buttons("menu");
	layer.x=575;
	layer.y=400;
	self.addChild(layer);

	layer=new buttons("retry");
	layer.x=575;
	layer.y=450;
	self.addChild(layer);

	if(stageIndex<8){
	layer=new buttons("next");
	layer.x=575;
	layer.y=500;
	self.addChild(layer);
	}

	self.addEventListener(LMouseEvent.MOUSE_UP);
}