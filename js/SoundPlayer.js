function SoundPlayer(){
	var self = this;
	self.loadIndex = 0;
	self.background = new LSound();
	self.background.parent = self;
	//如果IOS环境，并且不支持WebAudio，则没有预先读取的音频
	if(LGlobal.ios && !LSound.webAudioEnabled){
		return;
	}
	//如果没有预先读取的音频
	if(!dataList["sound_main"]){
		return;
	}
	self.background.addEventListener(LEvent.COMPLETE,self.backgroundLoadComplete);
	self.background.load(dataList["sound_main"]);
	//如果是移动浏览器，并且不支持WebAudio，则无法适用多声道，所以只适用背景音乐
	if(LGlobal.mobile && !LSound.webAudioEnabled){
		return;
	}
	self.level = new LSound();
	self.level.parent = self;
	self.level.addEventListener(LEvent.COMPLETE,self.levelLoadComplete);
	self.level.load(dataList["sound_level"]);

	self.cut = new LSound();
	self.cut.parent = self;
	self.cut.addEventListener(LEvent.COMPLETE,self.cutLoadComplete);
	self.cut.load(dataList["sound_cut"]);

	self.click = new LSound();
	self.click.parent = self;
	self.click.addEventListener(LEvent.COMPLETE,self.clickLoadComplete);
	self.click.load(dataList["sound_click"]);

	self.eat = new LSound();
	self.eat.parent = self;
	self.eat.addEventListener(LEvent.COMPLETE,self.eatLoadComplete);
	self.eat.load(dataList["sound_eat"]);

	self.sad = new LSound();
	self.sad.parent = self;
	self.sad.addEventListener(LEvent.COMPLETE,self.sadLoadComplete);
	self.sad.load(dataList["sound_sad"]);

	self.cleared = new LSound();
	self.cleared.parent = self;
	self.cleared.addEventListener(LEvent.COMPLETE,self.clearedLoadComplete);
	self.cleared.load(dataList["sound_cleared"]);

	self.star1 = new LSound();
	self.star1.parent = self;
	self.star1.addEventListener(LEvent.COMPLETE,self.star1_LoadComplete);
	self.star1.load(dataList["sound_star_1"]);

	self.star2 = new LSound();
	self.star2.parent = self;
	self.star2.addEventListener(LEvent.COMPLETE,self.star2_LoadComplete);
	self.star2.load(dataList["sound_star_2"]);

	self.star3 = new LSound();
	self.star3.parent = self;
	self.star3.addEventListener(LEvent.COMPLETE,self.star3_LoadComplete);
	self.star3.load(dataList["sound_star_3"]);
}
SoundPlayer.prototype.loadSound = function(){
	var self = this;
	//如果PC环境，或者支持WebAudio，则已经预先读取了音频，无需再次读取
	if(LSound.webAudioEnabled || LGlobal.os == OS_PC){
		if (LGlobal.mobile){
			switch(self.loadIndex++){
				case 0:
					self.level.play(self.level.length);
					break;
				case 1:
					self.cut.play(self.cut.length);
					break;
				case 2:
					self.click.play(self.click.length);
					break;
				case 3:
					self.eat.play(self.eat.length);
					break;
				case 4:
					self.sad.play(self.sad.length);
					break;
				case 5:
					self.cleared.play(self.cleared.length);
					break;
				case 6:
					self.star1.play(self.star1.length);
					break;
				case 7:
					self.star2.play(self.star2.length);
					break;
				case 8:
					self.star3.play(self.star3.length);
					break;
			}
		}
		return;
	}
	//已读取音频，无需再次读取
	if(self.loadIndex > 0 ){
		return;
	}
	self.loadIndex++;
	self.background.addEventListener(LEvent.COMPLETE,self.backgroundLoadComplete);
	self.background.load("./sound/main.mp3");
};
SoundPlayer.prototype.playSound = function(name){
	var self = this;
	if(name=="level" || name=="restart") sound_name=name;
	switch(name){
		case "level":
			if(!self.levelIsLoad)return;
			self.background.close();
			if(sound_select==0) self.level.play(0,100);
			else if(sound_select!=0) self.level.stop();
			break;
		case "restart":
			sound_name="level";
			if(!self.levelIsLoad)return;
			self.background.close();
			break;
		case "cut":
			if(!self.cutIsLoad)return;
			if(sound_select!=2) self.cut.play(0,1);
			break;
		case "click":
			if(!self.clickIsLoad)return;
			if(sound_select!=2) self.click.play(0,1);
			break;
		case "eat":
			if(!self.eatIsLoad)return;
			if(sound_select!=2) self.eat.play(0,1);
			break;	
		case "sad":
			if(!self.sadIsLoad)return;
			if(sound_select!=2) self.sad.play(0,1);
			break;
		case "cleared":
			if(!self.clearedIsLoad)return;
			if(sound_select!=2) self.cleared.play(0,1);
			break;
		case "star1":
			if(!self.star1_IsLoad)return;
			if(sound_select!=2) self.star1.play(0,1);
			break;
		case "star2":
			if(!self.star2_IsLoad)return;
			if(sound_select!=2) self.star2.play(0,1);
			break;
		case "star3":
			if(!self.star3_IsLoad)return;
			if(sound_select!=2) self.star3.play(0,1);
			break;
		case "menu":
			if(!self.backgroundIsLoad)return;
			self.level.close();
			self.background.close();
			sound_name=name;
			if(sound_select==0) self.background.play(0,100);
			break;
		case "logo":
			if(!self.backgroundIsLoad)return;
			self.background.close();
			sound_name=name;
			if(sound_select==0) self.background.play(0,100);
			break;
	}
};
SoundPlayer.prototype.backgroundLoadComplete = function(event){
	var self = event.currentTarget;
	self.parent.backgroundIsLoad = true;
	//self.play(0,100);
};
SoundPlayer.prototype.levelLoadComplete = function(event){
	var self = event.currentTarget;
	self.parent.levelIsLoad = true;
};
SoundPlayer.prototype.cutLoadComplete = function(event){
	var self = event.currentTarget;
	self.parent.cutIsLoad = true;
};
SoundPlayer.prototype.clickLoadComplete = function(event){
	var self = event.currentTarget;
	self.parent.clickIsLoad = true;
};
SoundPlayer.prototype.eatLoadComplete = function(event){
	var self = event.currentTarget;
	self.parent.eatIsLoad = true;
};
SoundPlayer.prototype.sadLoadComplete = function(event){
	var self = event.currentTarget;
	self.parent.sadIsLoad = true;
};
SoundPlayer.prototype.clearedLoadComplete = function(event){
	var self = event.currentTarget;
	self.parent.clearedIsLoad = true;
};
SoundPlayer.prototype.star1_LoadComplete = function(event){
	var self = event.currentTarget;
	self.parent.star1_IsLoad = true;
};
SoundPlayer.prototype.star2_LoadComplete = function(event){
	var self = event.currentTarget;
	self.parent.star2_IsLoad = true;
};
SoundPlayer.prototype.star3_LoadComplete = function(event){
	var self = event.currentTarget;
	self.parent.star3_IsLoad = true;
};