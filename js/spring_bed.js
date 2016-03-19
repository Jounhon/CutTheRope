function spring_bed(data,row,col){
	base(this,LSprite,[]);
	var self = this;
	//设定人物动作速度
	self.speed = 4;
	self.speedIndex = 0;
	self.speedCount = 0;
	//设定人物大小
	data.setProperties(0,0,data.image.width/col,data.image.height/row);
	//得到人物图片拆分数组
	var list = LGlobal.divideCoordinate(data.image.width,data.image.height,row,col);
	//设定人物动画
	self.anime = new LAnimation(this,data,list);

	self.isclick=false;

};

/**
 * 循环事件 
 **/ 
spring_bed.prototype.onframe = function (){
	var self = this;
	if(!self.isclick) return;
	//人物动作速度控制
	if(self.speedIndex++ < self.speed) return;
	self.speedIndex = 0;
	//人物动画播放
	self.speedCount++;
	if(self.speedCount>4){
		self.isclick=false;
		self.speedCount=0;
		return;
	}
	self.anime.onframe();
};  

spring_bed.prototype.isact = function (event){
	var self = this;
	self.isclick=true;
}