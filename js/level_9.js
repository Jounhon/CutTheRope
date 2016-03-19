var mouseLRisDown = false,mouseRLisDown=false;
var candy,monster,bubble,star=[],star_count=0,cs=[];
var checkIndex = 0;
var mouseObject = {x:0,y:0};
var out = false;
var linejoint,joint=[],fix=[],rope=[],air=[],spring=[],ground=[],wood,taco; // linejoint物體和繩子連接,joint各段繩子連接,box各段繩子
var point = 0, iseat=false,sound_count2=true,sound_count=0,fly=0,bubble_pic,move,delay;
var self,buoyancyController,buoyancyTimer,wallLayer,waterwall,mouseclick=false,mouseXY={x:0,y:0};

function Level_09(){
	base(this,LSprite,[]);
	self = this;
	self.gamestart();
}

Level_09.prototype.gamestart = function(){
	var self=this;
    star_count=sound_count=fly=delay=buoyancyTimer=0;
    sound_count2=true;
    iseat=out=mouseRLisDown=mouseLRisDown=move=mouseclick=false;
    rope.length=rope1.length=rope2.length=rope3.length=joint1.length=joint2.length=joint3.length=fix.length=star.length=spring.length=0;
    wallLayer=monster=candy=null;


//背景 
	var bgpic=new LBitmap(new LBitmapData(dataList["bg"]));
    bgpic.x=0;
    bgpic.y=0;
    //bgpic.alpha=0.2;
    self.addChild(bgpic);

//Water
    var seapic=new LBitmap(new LBitmapData(dataList["sea"]));
    seapic.x=0;
    seapic.y=580;
    self.addChild(seapic);
    waterwall = new LSprite();


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
	wallLayer = new LSprite(); 
	self.addChild(wallLayer);
    wallLayer.y = 540;
    wallLayer.x = 400;
    wallLayer.addBodyPolygon(120,10,1,2,0.4,0.2); // 寬,高,動態(1/0),密度,摩擦,彈性
	var basepic=new LBitmap(new LBitmapData(dataList["timber"]));
    basepic.x=0;
    basepic.y=-10;
    wallLayer.addChild(basepic);


//怪物    
    monster =new LSprite();
    monster.name="monster";
    self.addChild(monster);
    monster.y=530;
    monster.x=400;
    var monster_pic=new LBitmap(new LBitmapData(dataList["pic_monster"]));
    monster_pic.x=-15;
    monster_pic.y=-40;
    monster.addChild(monster_pic);
    monster.addBodyPolygon(40,40,1,1,1,1);
    

// ground
	var ground_position=[
		{x:550,y:220,r:45,scale:0.5,leg:100,wid:10},
		{x:650,y:250,r:0,scale:0.9,leg:180,wid:10}];
	ground=new LSprite();
	for(var i=0;i<ground_position.length;i++){
		ground[i]=new LSprite();
		self.addChild(ground[i]);
		ground[i].name="ground"+i;
		ground[i].x=ground_position[i].x;
		ground[i].y=ground_position[i].y;
		var ground_bit=new LBitmap(new LBitmapData(dataList["ground"]));
		ground_bit.x=0;
		ground_bit.y=-10;
		ground_bit.scaleX=ground_position[i].scale;
		ground_bit.scaleY=ground_position[i].scale;
		ground[i].addChild(ground_bit);
		ground[i].addBodyPolygon(ground_position[i].leg,ground_position[i].wid,0);
		ground[i].setRotate(ground_position[i].r*Math.PI/180);
	}


//星星
    var star_position=[
    	{x:820,y:301,sx:0},
        {x:820,y:400,sx:0},
        {x:420,y:450,sx:0}];
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
        star[i].addBodyCircle(0,0,0,0,0); //半径，圆心坐标Rx，Ry，静态或动态，密度，摩擦，弹力
    	self.addChild(star[i]);    
    }


//固定點
	var fix_position=[
	    {x:580,y:50}];
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

//繩子
    for(var i=0;i<8;i++){
		rope[i] = new LSprite();
	    rope[i].x = fix[0].x;
	    rope[i].y = i*5+fix[0].y+5;
	    rope[i].name="rope";
	    self.addChild(rope[i]);
	    rope[i].addBodyPolygon(5,10,1,10,10,0.5);
        var ropepic=new LBitmap(new LBitmapData(dataList["rope"]));
        ropepic.x=0;
        ropepic.y=0;
        rope[i].addChild(ropepic);
	    if(i==0) joint[i]=LGlobal.box2d.setRevoluteJoint(rope[i].box2dBody, fix[0].box2dBody );
        else joint[i]=LGlobal.box2d.setRevoluteJoint(rope[i].box2dBody,rope[i-1].box2dBody);
        rope[i].visible=true;
    }

//taco
	var taco=new LSprite();
	self.addChild(taco);
	var taco_bit=new LBitmap(new LBitmapData(dataList["taco"]));
	taco_bit.x=-20;
	taco_bit.y=-20;
	taco_bit.scaleX=taco.scaleY=0.4;
	taco.addChild(taco_bit);
	taco.x=820;
	taco.y=580;
	taco.addBodyPolygon(40,40,1,0,0,3);

//air
	var air_position=[
	    {x:950,y:350}];
	air=new LSprite();
	for(var i=0;i<air_position.length;i++){
		air[i]=new air_cushion(new LBitmapData(dataList["air_cushion_list"],0,0,70,170),1,6);
		self.addChild(air[i]);
	    air[i].name="air"+i;
	    air[i].x=air_position[i].x;
	    air[i].y=air_position[i].y;
	    air[i].addBodyCircle(28,0,0,0,0,0,0);
	    air[i].setRotate(1*180*Math.PI/180);
	    air[i].anime.setAction(0);
	    air[i].addEventListener(LMouseEvent.MOUSE_DOWN,function(){
	    	var vec = new LGlobal.box2d.b2Vec2(-320,0);
	 		if(candy.x>=650&&candy.x<900&&candy.y>=300&&candy.y<=500){
	   		 	candy.box2dBody.ApplyForce(vec, candy.box2dBody.GetWorldCenter());
	  		}
	    	air[0].isact();			 
	  	});
	}


//實心木
	var wood=new LSprite();
	self.addChild(wood);
	wood.x=rope[rope.length-1].x+2;
	wood.y=rope[rope.length-1].y;
	var wood_bit=new LBitmap(new LBitmapData(dataList["wood"]));
	wood_bit.x=wood_bit.y=0;
	wood_bit.scaleX=wood_bit.scaleY=1.5;
	wood.addChild(wood_bit);
	wood.addBodyCircle(30,0,0,1,1,10,0.2);
	linejoint = LGlobal.box2d.setRevoluteJoint(wood.box2dBody, rope[rope.length-1].box2dBody );

//糖果
	candy = new LSprite();
    candy.name="candy";
	var bit = new LBitmap(new LBitmapData(dataList["candy"]));
	bit.x = 0;
	bit.y = 0;
	candy.addChild(bit);
	candy.x = 680;
	candy.y = 220;
	self.addChild(candy);
	candy.addBodyCircle(25,0,0,1,0.5,1,0.1);

	buoyancyController = new LGlobal.box2d.b2BuoyancyController();
	buoyancyController.offset = -580 / LGlobal.box2d.drawScale;
	buoyancyController.density = 4;
	buoyancyController.linearDrag = 10;
	buoyancyController.angularDrag = 6;
    LGlobal.box2d.world.AddController(buoyancyController);

    buoyancyController.AddBody(wallLayer.box2dBody);
    buoyancyController.AddBody(monster.box2dBody);
	buoyancyController.AddBody(wood.box2dBody);
	buoyancyController.AddBody(taco.box2dBody);


	self.addEventListener(LEvent.ENTER_FRAME,self.onframe);
	self.addEventListener(LMouseEvent.MOUSE_DOWN,self.ondown);
	self.addEventListener(LMouseEvent.MOUSE_UP,self.onup);
    LGlobal.box2d.setEvent(LEvent.PRE_SOLVE,self.dispearStar);
    LGlobal.box2d.setEvent(LEvent.END_CONTACT,self.dispearCandy);
    LGlobal.box2d.setEvent(LEvent.POST_SOLVE,self.connectRC);

     
}

Level_09.prototype.connectRC = function(contact){
    if(contact.GetFixtureA().GetBody().GetUserData().name == "obstacle" && 
    	contact.GetFixtureB().GetBody().GetUserData().name == "candy"){
     	LTweenLite.to(self,0.05,{onComplete: function(){
                    self.removeChild(candy);
       	}});
    	LTweenLite.to(self,0.5,{onComplete:function(){sound_name="restart";gameStart(stageIndex);}});
	}
}
Level_09.prototype.dispearStar = function(contact){
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
Level_09.prototype.dispearCandy = function(contact){
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
Level_09.prototype.onframe = function(){

	air[0].onframe();
	if(candy.y>=580){
		candy.box2dBody.SetAwake(false);
		candy.box2dBody.SetPosition(new LGlobal.box2d.b2Vec2(candy.box2dBody.GetPosition().x-0.05,candy.box2dBody.GetPosition().y+0.1));
	}
/*
	buoyancyTimer++;
	if(buoyancyTimer%100==0) {
		buoyancyTimer=0;
		buoyancyController.offset += 0.2;
	}
	else if(buoyancyTimer%100==50)  buoyancyController.offset -= 0.2;*/

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
	if(!iseat&&candy.x <= monster.x+100 && candy.y+50>=monster.y-100){
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
Level_09.prototype.onup = function(event){
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
Level_09.prototype.ondown = function(event){
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
    mouseXY.x=event.offsetX;
    mouseXY.y=event.offsetY;
}