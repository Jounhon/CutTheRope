var mouseLRisDown = false,mouseRLisDown=false;
var candy,monster,bubble,star=[],star_count=0,cs=[];
var checkIndex = 0;
var mouseObject = {x:0,y:0};
var out = false;
var linejoint,joint=[],fix=[],rope=[],air=[]; // linejoint物體和繩子連接,joint各段繩子連接,box各段繩子
var point = 0, iseat=false,sound_count2=true,sound_count=0,fly=0,bubble_pic,move,delay;
var self;

function Level_06(){
	base(this,LSprite,[]);
	self = this;
	self.gamestart();
}

Level_06.prototype.gamestart = function(){
	var self=this;
    star_count=sound_count=fly=delay=0;
    sound_count2=true;
    iseat=out=mouseRLisDown=mouseLRisDown=move=false;
    rope.length=rope1.length=rope2.length=rope3.length=joint1.length=joint2.length=joint3.length=fix.length=star.length=air.length=0;

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
    wallLayer.x = 850;
    var basepic=new LBitmap(new LBitmapData(dataList["base"]));
    basepic.x=0;
    basepic.y=-60;
    wallLayer.addChild(basepic);
    wallLayer.addBodyPolygon(200,10,0,5,.1,0); // 寬,高,動態(1/0),密度,摩擦,彈性

//怪物    
    monster =new LSprite();
    monster.name="monster";
    self.addChild(monster);
    monster.y=630;
    monster.x=850;
    var monster_pic=new LBitmap(new LBitmapData(dataList["pic_monster"]));
    monster_pic.x=-25;
    monster_pic.y=-50;
    monster.addChild(monster_pic);
    monster.addBodyPolygon(30,30,0,5,1,0);
/* 測試
    labelText = new LTextField();
		labelText.color = "#000000";
		labelText.font = "cursive";
		labelText.size = 35;
		labelText.x = 35;
		labelText.y = 10;
		self.addChild(labelText);*/

//泡泡影
	var shadow_position=[
		{x:645,y:295,pic:1},
		{X:645,y:400,pic:2}];
	shadow=new LBitmap(new LBitmapData(dataList["shadow_1"]));
	shadow.x=645;
	shadow.y=295;
	self.addChild(shadow);

	shadow=new LBitmap(new LBitmapData(dataList["shadow_2"]));
	shadow.x=645;
	shadow.y=595;
	self.addChild(shadow);

//泡泡
	var bubble_position=[
		{x:650,y:300},
		{x:650,y:600}];
	bubble =new LSprite();
	for(var i=0;i<bubble_position.length;i++){
		bubble[i]=new LSprite();
		bubble[i].name="bubble";
		self.addChild(bubble[i]);
		bubble[i].y=bubble_position[i].y;
		bubble[i].x=bubble_position[i].x;
		bubble_pic = new LBitmap(new LBitmapData(dataList["bubble"]));
		bubble_pic.x=0;
		bubble_pic.y=0;
		bubble[i].addChild(bubble_pic);
	}

//星星
    var star_position=[
    	{x:680,y:230,sx:0},
        {x:680,y:450,sx:0},
        {x:800,y:480,sx:0}];
    star=new LSprite();
    for(var i=0;i<star_position.length;i++){
    	star[i]=new LSprite();
       	star[i].name="star"+i;
        star[i].x=star_position[i].x;
        star[i].y=star_position[i].y;
        var star_bit=new LBitmap(new LBitmapData(dataList["star"]));
        star_bit.x=-20;
        star_bit.y=0;
        star[i].addChild(star_bit);
        star[i].addBodyCircle(0,0,0,0,0,0,0); //半径，圆心坐标Rx，Ry，静态或动态，密度，摩擦，弹力
    	self.addChild(star[i]);    
    }

//障礙物
	var obstacle_position=[
		{x:580,y:430},
        {x:800,y:430},
        {x:910,y:430}];
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
	    {x:800,y:130}];
	fix=new LSprite();
	for(var i=0;i<fix_position.length;i++){
		fix[i]=new LSprite();
	    fix[i].name="fix"+i;
	    fix[i].x=fix_position[i].x;
	    fix[i].y=fix_position[i].y;
	    self.addChild(fix[i]);
	    fix[i].addBodyCircle(0,0,0,0,1,10,0.2);

	    var fixpic=new LBitmap(new LBitmapData(dataList["fix"]));
	    fixpic.x=-10;
	    fixpic.y=-10;
	    fix[i].addChild(fixpic);
	}

//空氣噴射器

	var air_position=[
	    {x:550,y:530,seq:1},
	    {x:950,y:350,seq:2}];
	air=new LSprite();
	for(var i=0;i<air_position.length;i++){
		air[i]=new air_cushion(new LBitmapData(dataList["air_cushion_list"],0,0,70,170),1,6);
		self.addChild(air[i]);
	    air[i].name="air"+i;
	    air[i].x=air_position[i].x;
	    air[i].y=air_position[i].y;
	    air[i].addBodyCircle(28,0,0,0,0,0,0);
	    air[i].setRotate(i*180*Math.PI/180);
	    air[i].anime.setAction(0);
	   
	    switch(air_position[i].seq){
	    	case 1:{
	    		air[i].addEventListener(LMouseEvent.MOUSE_DOWN,function(){
	    			 var vec = new LGlobal.box2d.b2Vec2(200,100);
	    			 if(candy.x>=600&&candy.y>=460&&candy.y<=600){
	    			 	candy.box2dBody.ApplyForce(vec, candy.box2dBody.GetWorldCenter());
	    			 	move=true;
	    			 }
	    			 air[0].isact();
	    			 
	  			});
	    		break;
	    	}
	    	case 2:{
	    		air[i].addEventListener(LMouseEvent.MOUSE_DOWN,function(){
	    			 var vec = new LGlobal.box2d.b2Vec2(-300,-100);
    				 if(candy.x>=600&&candy.y>=280&&candy.y<=330) candy.box2dBody.ApplyForce(vec, candy.box2dBody.GetWorldCenter());
    				 air[1].isact();
	  			});
	    		break;
	    	}
	    }
	}


//繩子
    for(var i=0;i<35;i++){
		rope[i] = new LSprite();
	    rope[i].x = fix[0].x;
	    rope[i].y = i*5+fix[0].y+5;
	    rope[i].name="rope";
	    self.addChild(rope[i]);
	    rope[i].addBodyPolygon(5,10,1,8,10,0.2);
        var ropepic=new LBitmap(new LBitmapData(dataList["rope"]));
        ropepic.x=0;
        ropepic.y=0;
        rope[i].addChild(ropepic);
	    if(i==0) joint[i]=LGlobal.box2d.setRevoluteJoint(rope[i].box2dBody, fix[0].box2dBody );
        else joint[i]=LGlobal.box2d.setRevoluteJoint(rope[i].box2dBody,rope[i-1].box2dBody);
        rope[i].visible=true;
    }
    

//糖果
	candy = new LSprite();
    candy.name="candy";
	var bit = new LBitmap(new LBitmapData(dataList["candy"]));
	bit.x = 0;
	bit.y = 0;
	candy.addChild(bit);
	candy.x = fix[0].x;
	candy.y = rope[rope.length-1].y+20;
	self.addChild(candy);
	candy.addBodyCircle(25,0,0,1,0,.5,0.2);
	candy.visible=true;
	linejoint = LGlobal.box2d.setRevoluteJoint(candy.box2dBody, rope[rope.length-1].box2dBody );
	candy.addEventListener(LMouseEvent.MOUSE_DOWN,function(){
    	if(fly==1){
    		fly=2;
    		candy.box2dBody.SetAwake(true);
    		candy.removeChild(bubble_pic);
    	}
    	else if(fly==3){
    		fly=4;
    		candy.box2dBody.SetAwake(true);
    		candy.removeChild(bubble_pic);
    	}
	});

	


	self.addEventListener(LEvent.ENTER_FRAME,self.onframe);
	self.addEventListener(LMouseEvent.MOUSE_DOWN,self.ondown);
	self.addEventListener(LMouseEvent.MOUSE_UP,self.onup);
    LGlobal.box2d.setEvent(LEvent.PRE_SOLVE,self.dispearStar);
    LGlobal.box2d.setEvent(LEvent.END_CONTACT,self.dispearCandy);
    LGlobal.box2d.setEvent(LEvent.POST_SOLVE,self.connectRC);
}
Level_06.prototype.connectRC = function(contact){
    if(contact.GetFixtureA().GetBody().GetUserData().name == "obstacle" && 
    	contact.GetFixtureB().GetBody().GetUserData().name == "candy"){
     	LTweenLite.to(self,0.05,{onComplete: function(){
                    self.removeChild(candy);
       	}});
    	LTweenLite.to(self,0.5,{onComplete:function(){sound_name="restart";gameStart(stageIndex);}});
	}
}
Level_06.prototype.dispearStar = function(contact){
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
Level_06.prototype.dispearCandy = function(contact){
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
}
Level_06.prototype.onframe = function(){
	air[0].onframe();
	air[1].onframe();
	if(candy.x>=650&&candy.x<=680&&candy.y>=280&&candy.y<=330&&fly==0){
		self.removeChild(bubble[0]);
		LGlobal.box2d.world.DestroyJoint(linejoint);
		linejoint=null;
		for(var i=0;i<rope.length;i++) self.removeChild(rope[i]);
		out=true;
		bubble_pic = new LBitmap(new LBitmapData(dataList["bubble"]));
		bubble_pic.x=-5;
		bubble_pic.y=-5;
		candy.addChild(bubble_pic);
		fly=1;
	}
	else if(candy.x>=650&&candy.x<=680&&candy.y>=600&&candy.y<=650&&fly==2){
		self.removeChild(bubble[1]);
		out=true;
		bubble_pic = new LBitmap(new LBitmapData(dataList["bubble"]));
		bubble_pic.x=-5;
		bubble_pic.y=-5;
		candy.addChild(bubble_pic);
		fly=3;
	}
	if(fly%2==1){
		candy.box2dBody.SetAwake(false);
		candy.box2dBody.SetPosition(new LGlobal.box2d.b2Vec2(candy.box2dBody.GetPosition().x,candy.box2dBody.GetPosition().y-0.02));
	}
	if(move){
		candy.box2dBody.SetAwake(false);
		candy.box2dBody.SetPosition(new LGlobal.box2d.b2Vec2(candy.box2dBody.GetPosition().x+0.06,candy.box2dBody.GetPosition().y));	
		delay++;
		if(delay%10==0) move=false;
	}
	if(!out)return;
	if(candy.y>=LGlobal.height){
		if(sound_count2) sound_player.playSound("sad");
        sound_count2=false;
		LTweenLite.to(self,0.1,{onComplete:function(){
			monster.removeAllChild();
			var monster_pic=new LBitmap(new LBitmapData(dataList["sad"]));
			monster_pic.x=-25;
	  		monster_pic.y=-50;
			monster.addChild(monster_pic);
            
		}});
		LTweenLite.to(self,0.5,{onComplete:function(){
            sound_name="restart";
            gameStart(stageIndex);
        }});
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
Level_06.prototype.onup = function(event){
	if(out)return;
    if(event.offsetY <= rope[rope.length-1].y+20 && event.offsetY>= rope[0].y){
    	if(mouseLRisDown && event.offsetX > rope[0].x+2){
        	mouseLRisDown = false;
	        LGlobal.box2d.world.DestroyJoint(linejoint);
	        out = true;
        }
        else if(mouseRLisDown && event.offsetX < rope[0].x){
        	mouseRLisDown = false;
	        LGlobal.box2d.world.DestroyJoint(linejoint);
	        out = true;
        }
        mouseRLisDown = false;
        mouseLRisDown = false;
        if(out){
        	linejoint=null;
        	var cut=false,temp;
            for(var i=0;i<rope.length;i++){
            	if(!cut && (event.offsetY+mouseObject.y)/2>rope[i].y&&(event.offsetY+mouseObject.y)/2<=rope[i+1].y){
                	LGlobal.box2d.world.DestroyJoint(joint[i]);
                    cut=true;
                    sound_player.playSound("cut");
                    temp=i;
                }
                if(cut){
                	self.removeChild(rope[i]);                            
                }
            }
                    
            LTweenLite.to(self,0.2,{ease:LEasing.Strong.easeInOut,onComplete:function(){
            	for(var i=temp;i>=0;i--) self.removeChild(rope[i]);
            }});
        }
    }
}
Level_06.prototype.ondown = function(event){
    if(out)return;
	if(event.offsetY < rope[rope.length-1].y+20 && event.offsetY> rope[0].y){
    	if(event.offsetX < rope[0].x ){
        	mouseLRisDown = true;
            mouseRLisDown = false;
        }
        else if(event.offsetX>rope[0].x+2){
        	monseLRisDown = false;
            mouseRLisDown = true;
        }
	    mouseObject.x = event.offsetX;
        mouseObject.y = event.offsetY;
    }
}