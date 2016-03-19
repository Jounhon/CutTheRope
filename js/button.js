function buttons(select){
	base(this,LSprite,[]);
	var self = this;
	var bitmap,bitmap2;
	var btn_OUT=new LSprite();
	var btn_MOVE=new LSprite();
	var btn = new  LButton(btn_OUT,btn_MOVE);


	if(select=="play"){
		
		bitmap=new LBitmap(new LBitmapData(dataList["play"]));
		btn_OUT.addChild(bitmap);

		bitmap=new LBitmap(new LBitmapData(dataList["play2"]));
		btn_MOVE.addChild(bitmap);

		btn.addEventListener(LMouseEvent.MOUSE_UP,menuShow);

	}
	else if(select=="retry"){

		bitmap=new LBitmap(new LBitmapData(dataList["retry"]));
		btn_OUT.addChild(bitmap);

		bitmap=new LBitmap(new LBitmapData(dataList["retry2"]));
		btn_MOVE.addChild(bitmap);

		btn.addEventListener(LMouseEvent.MOUSE_UP,function(){sound_name="restart";gameStart(stageIndex);});

	}
	else if(select=="menu"){
		bitmap=new LBitmap(new LBitmapData(dataList["menu"]));
		btn_OUT.addChild(bitmap);
		
		bitmap=new LBitmap(new LBitmapData(dataList["menu2"]));
		btn_MOVE.addChild(bitmap);
		
		btn.addEventListener(LMouseEvent.MOUSE_UP,menuShow);

	}
	else if(select=="next"){
		
		bitmap=new LBitmap(new LBitmapData(dataList["next"]));
		btn_OUT.addChild(bitmap);
		
		bitmap=new LBitmap(new LBitmapData(dataList["next2"]));
		btn_MOVE.addChild(bitmap);
		
		btn.addEventListener(LMouseEvent.MOUSE_UP,function(){sound_name="restart";gameStart(stageIndex+1);});

	}

	else if(select=="backmenu"){
		
		bitmap=new LBitmap(new LBitmapData(dataList["menu_2"]));
		btn_OUT.addChild(bitmap);
		
		bitmap=new LBitmap(new LBitmapData(dataList["menu_22"]));
		btn_MOVE.addChild(bitmap);
		
		btn.addEventListener(LMouseEvent.MOUSE_UP,menuShow);

	}

	else if(select=="restart"){
		
		bitmap=new LBitmap(new LBitmapData(dataList["restart"]));
		btn_OUT.addChild(bitmap);
		
		bitmap=new LBitmap(new LBitmapData(dataList["restart2"]));
		btn_MOVE.addChild(bitmap);
		
		btn.addEventListener(LMouseEvent.MOUSE_UP,function(){
			sound_name="restart";
			gameStart(stageIndex);
		});

	}
	
	else if(select=="sound"){
		switch(sound_select){
			case 0:
				bitmap=new LBitmap(new LBitmapData(dataList["sound"]));
				bitmap2=new LBitmap(new LBitmapData(dataList["sound2"]));
				break;
			case 1:
				bitmap=new LBitmap(new LBitmapData(dataList["sound_effect"]));
				bitmap2=new LBitmap(new LBitmapData(dataList["sound_effect2"]));
				break;
			case 2:
				bitmap=new LBitmap(new LBitmapData(dataList["silent"]));
				bitmap2=new LBitmap(new LBitmapData(dataList["silent2"]));
				break;
		}

		btn_OUT.addChild(bitmap);
		btn_MOVE.addChild(bitmap2);
		
		btn.addEventListener(LMouseEvent.MOUSE_UP,function(){
			sound_select++;
			if(sound_select>2) sound_select=0;
			sound_player.playSound(sound_name);
			btn_OUT.removeChild(bitmap);
			btn_MOVE.removeChild(bitmap2);
			switch(sound_select){
			case 0:
				bitmap=new LBitmap(new LBitmapData(dataList["sound"]));
				bitmap2=new LBitmap(new LBitmapData(dataList["sound2"]));
				break;
			case 1:
				bitmap=new LBitmap(new LBitmapData(dataList["sound_effect"]));
				bitmap2=new LBitmap(new LBitmapData(dataList["sound_effect2"]));
				break;
			case 2:
				bitmap=new LBitmap(new LBitmapData(dataList["silent"]));
				bitmap2=new LBitmap(new LBitmapData(dataList["silent2"]));
				break;
			}
			btn_OUT.addChild(bitmap);
			btn_MOVE.addChild(bitmap2);
		});

	}

	btn.addEventListener(LMouseEvent.MOUSE_UP,function(){sound_player.playSound("click");});

	
	self.addChild(btn);

};