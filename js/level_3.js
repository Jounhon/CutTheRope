var mouseLRisDown = false,mouseRLisDown=false;
var candy,star=[],star_count=0;
var checkIndex = 0;
var mouseObject = {x:0,y:0};
var out = false;
var linejoint,linejoint2,joint1=[],joint2=[],rope1=[],rope2=[],fix=[]; // linejoint物體和繩子連接,joint各段繩子連接,box各段繩子
var point = 0,iseat=false,isrope=false;
var self;
var sound_count=0,sound_count2=true;

function Level_03(){
	base(this,LSprite,[]);
	self = this;
	iseat=out=mouseRLisDown=mouseLRisDown=isrope=false;
	star_count=0;
    sound_count=0;
	self.gamestart();
}

Level_03.prototype.gamestart = function(){
	var self=this;
    star_count=0;
    sound_count=0;
    rope1.length=rope2.length=joint1.length=joint2.length=fix.length=star.length=0;

//背景 
	var bgpic=new LBitmap(new LBitmapData(dataList["bg"]));
    bgpic.x=0;
    bgpic.y=0;
    self.addChild(bgpic);

//返回menu
	var bt=new buttons("backmenu");
	bt.x=1250;
	bt.y=25;
	self.addChild(bt);

//restart button
	var bt=new buttons("restart");
	bt.x=1200;
	bt.y=25;
	self.addChild(bt);

//音效button
    var sound = new buttons("sound");
    sound.x = 1150;
    sound.y = 25;
    self.addChild(sound);

//星星統計
	cs=new LSprite();
	for(var i=0;i<3;i++){
		cs[i]=new LSprite();
		cs[i].x=50*i+25;
		cs[i].y=25;
		cs[i].name="cstar"+i;
		var bitmap= new LBitmap(new LBitmapData(dataList["cstar"]));
		bitmap.x=0;
		bitmap.y=0;
		cs[i].addChild(bitmap);
		self.addChild(cs[i]);
	}

//怪物地板
    var wallLayer = new LSprite(); 
	self.addChild(wallLayer);
    wallLayer.y = 650;
    wallLayer.x = 650;
    var basepic=new LBitmap(new LBitmapData(dataList["base"]));
    basepic.x=0;
    basepic.y=-60;
    wallLayer.addChild(basepic);
    wallLayer.addBodyPolygon(200,10,0,5,1,0); // 寬,高,動態(1/0),密度,摩擦,彈性

//怪物    
    monster =new LSprite();
    monster.name="monster";
    self.addChild(monster);
    monster.removeAllChild();
    monster.y=630;
    monster.x=650;
    var monster_pic=new LBitmap(new LBitmapData(dataList["pic_monster"]));
    monster_pic.x=-25;
    monster_pic.y=-50;
    monster.addChild(monster_pic);
    monster.addBodyPolygon(30,30,0,5,1,0);

//地板
    var ground_position=[{x:600,y:350,angle:15}];
    for(var i=0;i<ground_position.length;i++){
    	var ground=new LSprite();
        self.addChild(ground);
        ground.x=ground_position[i].x;
        ground.y=ground_position[i].y;
        var groundpic=new LBitmap(new LBitmapData(dataList["ground"]));
        groundpic.x=0;
        groundpic.y=0;
        ground.addChild(groundpic);
        ground.addBodyPolygon(200,5,0,5,1,0);
        ground.setRotate(ground_position[i].angle*Math.PI/180);
    }

//星星
	var star_position=[
    	{x:575,y:250,sx:15},
        {x:675,y:450,sx:-5},
        {x:850,y:450,sx:-5}];
    star=new LSprite();
    for(var i=0;i<3;i++){
    	star[i]=new LSprite();
       	star[i].name="star"+i;
        star[i].x=star_position[i].x;
        star[i].y=star_position[i].y;
        var star_bit=new LBitmap(new LBitmapData(dataList["star"]));
        star_bit.x=-40;
        star_bit.y=0;
        star[i].addChild(star_bit);
        star[i].addBodyCircle(15,35,0,0,0,1,0); //半径，圆心坐标Rx，Ry，静态或动态，密度，摩擦，弹力
    	self.addChild(star[i]);    
    }

//障礙物
	var obstacle_position=[
		{x:510,y:200},
        {x:780,y:200}];
    for(var i=0;i<obstacle_position.length;i++){
    	var obstacle=new LSprite();
        self.addChild(obstacle);
        obstacle.name="obstacle";
        obstacle.x=obstacle_position[i].x;
        obstacle.y=obstacle_position[i].y;
        var obstaclepic=new LBitmap(new LBitmapData(dataList["obstacle"]));
        obstaclepic.x=2;
        obstaclepic.y=-10;
        obstacle.addChild(obstaclepic);
        obstacle.addBodyPolygon(120,5,0,5,1,0); 
    }

//固定點
	var fix_position=[
    	{x:650,y:50},
       	{x:775,y:250}];
	fix=new LSprite();
    for(var i=0;i<fix_position.length;i++){
		fix[i]=new LSprite();
		fix[i].name="fix"+i;
		fix[i].x=fix_position[i].x;
		fix[i].y=fix_position[i].y;
		self.addChildAt(fix[i],i);
		self.addChild(fix[i]);
		fix[i].addBodyCircle(12,0,0,0,0,0,0.2);
		fix[i].setBodyMouseJoint(true);

		var fixpic=new LBitmap(new LBitmapData(dataList["fix"]));
		fixpic.x=0;
		fixpic.y=0;
		fix[i].addChild(fixpic);
		fix[i].bitmap=fixpic;
 	}


//繩子
    for(var i=0;i<8;i++){
        rope1[i] = new LSprite();
        rope1[i].name="rope1";
        rope1[i].x = 650;
        rope1[i].y = 60+i*8;
        self.addChild(rope1[i]);
        rope1[i].addBodyPolygon(5,10,1,1,1,0.2);
        var ropepic=new LBitmap(new LBitmapData(dataList["rope"]));
        ropepic.x=0;
        ropepic.y=0;
        rope1[i].addChild(ropepic);
        if(i==0) joint1[i]=LGlobal.box2d.setRevoluteJoint(rope1[i].box2dBody, fix[0].box2dBody );
        else joint1[i]=LGlobal.box2d.setRevoluteJoint(rope1[i].box2dBody, rope1[i-1].box2dBody );
    }
   for(var i=0;i<20;i++){
        rope2[i] = new LSprite();
        rope2[i].name="rope2";
        rope2[i].x = 775;
        rope2[i].y = 260+i*8;
        self.addChild(rope2[i]);
        rope2[i].addBodyPolygon(5,10,1,2,1,0.2);
        var ropepic=new LBitmap(new LBitmapData(dataList["rope"]));
        ropepic.x=0;
        ropepic.y=0;
        rope2[i].addChild(ropepic);
        if(i==0) joint2[i]=LGlobal.box2d.setRevoluteJoint(rope2[i].box2dBody, fix[1].box2dBody );
        else joint2[i]=LGlobal.box2d.setRevoluteJoint(rope2[i].box2dBody, rope2[i-1].box2dBody);
        rope2[i].visible=false;
    };

//糖果
    candy = new LSprite();
    candy.name="candy";
    var bit = new LBitmap(new LBitmapData(dataList["candy"]));
    bit.x = 0;
    bit.y = 0;
    candy.addChild(bit);
    candy.x = 650;
    candy.y = rope1[rope1.length-1].y+20;
    self.addChild(candy);
    candy.addBodyCircle(25,0,0,1,1,10,0.7);
    linejoint = LGlobal.box2d.setRevoluteJoint(candy.box2dBody, rope1[rope1.length-1].box2dBody );

    var vec = new LGlobal.box2d.b2Vec2(200,0);
    candy.box2dBody.ApplyForce(vec, candy.box2dBody.GetWorldCenter());


    self.addEventListener(LEvent.ENTER_FRAME,self.onframe);
    self.addEventListener(LMouseEvent.MOUSE_DOWN,self.ondown);
    self.addEventListener(LMouseEvent.MOUSE_UP,self.onup);
    LGlobal.box2d.setEvent(LEvent.PRE_SOLVE,self.dispearStar);
    LGlobal.box2d.setEvent(LEvent.END_CONTACT,self.dispearCandy);
    LGlobal.box2d.setEvent(LEvent.POST_SOLVE,self.connectRC);
}
Level_03.prototype.dispearStar = function(contact){
	var bitmap= new LBitmap(new LBitmapData(dataList["cstar2"]));
	bitmap.x=0;
	bitmap.y=0;
	if(contact.GetFixtureA().GetBody().GetUserData().name == "candy" && 
		contact.GetFixtureB().GetBody().GetUserData().name == "star0"){
		self.removeChild(star[0]);
		star_count++;
	}
	if(contact.GetFixtureA().GetBody().GetUserData().name == "candy" && 
		contact.GetFixtureB().GetBody().GetUserData().name == "star1"){
		self.removeChild(star[1]);
		star_count++;
	}
	if(contact.GetFixtureA().GetBody().GetUserData().name == "candy" && 
		contact.GetFixtureB().GetBody().GetUserData().name == "star2"){
		self.removeChild(star[2]);
		star_count++;
    }
    switch(star_count){
        case 1:{
            cs[0].removeAllChild();
            cs[0].addChild(bitmap);
            if(sound_count==0)sound_player.playSound("star1");
            sound_count=1;
            break;
        }
        case 2:{
            cs[1].removeAllChild();
            cs[1].addChild(bitmap);
            if(sound_count==1)sound_player.playSound("star2");
            sound_count=2;
            break;
        }
        case 3:{
            cs[2].removeAllChild();
            cs[2].addChild(bitmap);
            if(sound_count==2)sound_player.playSound("star3");
            sound_count=0;
            break;
        }
    }
}
Level_03.prototype.dispearCandy = function(contact){
    if(contact.GetFixtureA().GetBody().GetUserData().name == "monster" && 
        contact.GetFixtureB().GetBody().GetUserData().name == "candy"){
        monster.removeAllChild();
        var monster_pic=new LBitmap(new LBitmapData(dataList["happy"]));
        monster_pic.x=-25;
        monster_pic.y=-50;
        monster.addChild(monster_pic);
		self.removeChild(candy);
		iseat=true;
        sound_player.playSound("eat");
	}
	if(contact.GetFixtureA().GetBody().GetUserData().name == "rope2" && 
        contact.GetFixtureB().GetBody().GetUserData().name == "candy"){
        if(candy.x >= rope2[rope2.length-1].x-50 && candy.y>=rope2[rope2.length-1].y-50){
        	linejoint = LGlobal.box2d.setRevoluteJoint(candy.box2dBody,rope2[rope2.length-1].box2dBody);
        }
        var vec = new LGlobal.box2d.b2Vec2(10,0);
        candy.box2dBody.ApplyForce(vec, candy.box2dBody.GetWorldCenter());
    }
}
Level_03.prototype.connectRC = function(contact){
	if(contact.GetFixtureA().GetBody().GetUserData().name == "rope2" && 
        contact.GetFixtureB().GetBody().GetUserData().name == "candy"){
        if(candy.x >= rope2[rope2.length-1].x-50 && candy.y>=rope2[rope2.length-1].y-50){
        	linejoint = LGlobal.box2d.setRevoluteJoint(candy.box2dBody,rope2[rope2.length-1].box2dBody);
        }
        var vec = new LGlobal.box2d.b2Vec2(10,0);
        candy.box2dBody.ApplyForce(vec, candy.box2dBody.GetWorldCenter());
    }
    if(contact.GetFixtureA().GetBody().GetUserData().name == "obstacle" && 
    	contact.GetFixtureB().GetBody().GetUserData().name == "candy"){
     	LTweenLite.to(self,0.05,{onComplete: function(){
                    self.removeChild(candy);
       	}});
    	LTweenLite.to(self,0.5,{onComplete:function(){sound_name="restart";gameStart(stageIndex);}});
	}
}
Level_03.prototype.onframe = function(){
	if(!out)return;
	if(candy.y>=LGlobal.height){
		LTweenLite.to(self,0.1,{onComplete:function(){
			monster.removeAllChild();
			var monster_pic=new LBitmap(new LBitmapData(dataList["sad"]));
			monster_pic.x=-25;
	  		monster_pic.y=-50;
			monster.addChild(monster_pic);
            if(sound_count2) sound_player.playSound("sad");
            candy.y=LGlobal.height-100;
            sound_count2=false;
		}});
		LTweenLite.to(self,0.1,{onComplete:function(){
            sound_name="restart";
            gameStart(stageIndex);
        }});
	}
	if(candy.x>=fix[1].x-100 && candy.y >=fix[1].y-10 && candy.y <=fix[1].y+105&& !isrope){  
		for(var i=0;i<rope2.length;i++){
        	rope2[i].visible=true;
        }
    }
	if(!iseat&&candy.x >= monster.x-100 && candy.y+50>=monster.y-100){
		monster.removeAllChild();
		var monster_pic=new LBitmap(new LBitmapData(dataList["eat"]));
		monster_pic.x=-25;
  		monster_pic.y=-50;
		monster.addChild(monster_pic);
	}
	if(iseat){
		LTweenLite.to(self,1.3,{onComplete:function(){
			self.removeAllChild();
			self.die();
			var getstar=new get_star(star_count);
			self.addChild(getstar);
            if(clear_sound==0) sound_player.playSound("cleared");
            clear_sound++;
		}});
    }
}

Level_03.prototype.onup = function(event){
	if(out){
    	out=false;
        cut=false;
        return;
    }
    sound_count2=true;
    if(event.offsetY < rope1[rope1.length-1].y+20 && event.offsetY> rope1[0].y){
    	if(mouseLRisDown && event.offsetX >= rope1[0].x+2){
        	mouseLRisDown = false;
	        LGlobal.box2d.world.DestroyJoint(linejoint);
	        out = true;
        }
        else if(mouseRLisDown && event.offsetX <=rope1[0].x){
        	mouseRLisDown = false;
	        LGlobal.box2d.world.DestroyJoint(linejoint);
	        out = true;
        }
        mouseRLisDown = false;
        mouseLRisDown = false;
        if(out){
        	var cut=false,temp;
            for(var i=0;i<rope1.length;i++){
            	if((event.offsetY+mouseObject.y)/2>rope1[i].y&&(event.offsetY+mouseObject.y)/2<=rope1[i+1].y){
                	LGlobal.box2d.world.DestroyJoint(joint1[i]);
                    cut=true;
                    sound_player.playSound("cut");
                    temp=i;
                }
                if(cut){ 
                	self.removeChild(rope1[i]);
                }
            }
            LTweenLite.to(self,0.3,{ease:LEasing.Strong.easeInOut,onComplete:function(){
            	for(var i=temp;i>=0;i--){
                	self.removeChild(rope1[i]);
                }
            }});
        }
    }
    if(event.offsetY < rope2[rope2.length-1].y+20 && event.offsetY> rope2[0].y){
    	if(mouseLRisDown && event.offsetX >= rope1[0].x+2){
        	mouseLRisDown = false;
	        LGlobal.box2d.world.DestroyJoint(linejoint);
	        out = true;
        }
        else if(mouseRLisDown && event.offsetX <=rope2[0].x){
        	mouseRLisDown = false;
	        LGlobal.box2d.world.DestroyJoint(linejoint);
	        out = true;
        }
        mouseRLisDown = false;
        mouseLRisDown = false;
        if(out){
        	var cut=false,temp;
            for(var i=0;i<rope2.length;i++){
            	if((event.offsetY+mouseObject.y)/2>rope2[i].y&&(event.offsetY+mouseObject.y)/2<=rope2[i+1].y){
                	LGlobal.box2d.world.DestroyJoint(joint2[i]);
                    cut=true;
                    sound_player.playSound("cut");
                    temp=i;
                }
                if(cut){ 
                	self.removeChild(rope2[i]);
                }
            }
            LTweenLite.to(self,0.3,{ease:LEasing.Strong.easeInOut,onComplete:function(){
            	for(var i=temp;i>=0;i--){
                	self.removeChild(rope2[i]);
                }
            }});
        }
    }
}
Level_03.prototype.ondown = function(event){
    if(out)return;
	if(event.offsetY < rope1[rope1.length-1].y+20 && event.offsetY> rope1[0].y){
    	if(event.offsetX < rope1[0].x ){
        	mouseLRisDown = true;
            mouseRLisDown = false;
        }
        else if(event.offsetX>rope1[0].x+2){
        	monseLRisDown = false;
            mouseRLisDown = true;
        }
	    mouseObject.x = event.offsetX;
        mouseObject.y = event.offsetY;
    }
    if(event.offsetY < rope2[rope2.length-1].y+20 && event.offsetY> rope2[0].y){
    	if(event.offsetX < rope2[0].x ){
        	mouseLRisDown = true;
            mouseRLisDown = false;
        }
        else if(event.offsetX>rope2[0].x+2){
        	monseLRisDown = false;
            mouseRLisDown = true;
        }
	    mouseObject.x = event.offsetX;
        mouseObject.y = event.offsetY;
    }
}