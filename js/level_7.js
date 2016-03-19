var mouseLRisDown = false,mouseRLisDown=false;
var candy,monster,bubble,star=[],star_count=0,cs=[];
var checkIndex = 0;
var mouseObject = {x:0,y:0};
var out = false;
var linejoint,joint=[],fix=[],rope=[],air=[],spring=[]; // linejoint物體和繩子連接,joint各段繩子連接,box各段繩子
var point = 0, iseat=false,sound_count2=true,sound_count=0,fly=0,bubble_pic,move,delay;
var self;

function Level_07(){
	base(this,LSprite,[]);
	self = this;
	self.gamestart();
}

Level_07.prototype.gamestart = function(){
	var self=this;
    star_count=sound_count=fly=delay=0;
    sound_count2=true;
    iseat=out=mouseRLisDown=mouseLRisDown=move=false;
    rope.length=rope1.length=rope2.length=rope3.length=joint1.length=joint2.length=joint3.length=fix.length=star.length=spring.length=0;

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
	var basepic=new LBitmap(new LBitmapData(dataList["base"]));
    basepic.x=550;
    basepic.y=570;
    self.addChild(basepic);
    var wallLayer = new LSprite(); 
	self.addChild(wallLayer);
    wallLayer.y = 620;
    wallLayer.x = 650;
    wallLayer.addBodyPolygon(150,10,0,5,0,0.2); // 寬,高,動態(1/0),密度,摩擦,彈性


//怪物    
    monster =new LSprite();
    monster.name="monster";
    self.addChild(monster);
    monster.y=600;
    monster.x=650;
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


//星星
    var star_position=[
    	{x:650,y:350,sx:0},
        {x:500,y:450,sx:0},
        {x:800,y:450,sx:0}];
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

//彈簧床
	var springBed_position=[
	{x:490,y:590,r:20},
	{x:350,y:530,r:20},
	{x:210,y:470,r:20},
	{x:820,y:590,r:-20},
	{x:960,y:530,r:-20},
	{x:1100,y:470,r:-20},];
	spring=new LSprite();
	for(var i=0;i<springBed_position.length;i++){
		spring[i]=new spring_bed(new LBitmapData(dataList["spring_bed_list"],0,0,144,58),1,4);
		self.addChild(spring[i]);
	    spring[i].name="spring"+i;
	    spring[i].x=springBed_position[i].x;
	    spring[i].y=springBed_position[i].y;
	    spring[i].addBodyPolygon(150,20,0,5,10,1);
	    spring[i].setRotate(springBed_position[i].r*Math.PI/180);
	    spring[i].anime.setAction(0);
	}

//固定點
	var fix_position=[
	    {x:650,y:50}];
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

	var vec = new LGlobal.box2d.b2Vec2(-900,-500);
    candy.box2dBody.ApplyForce(vec, candy.box2dBody.GetWorldCenter());
    /*candy.box2dBody.SetAwake(false);
	candy.box2dBody.SetPosition(new LGlobal.box2d.b2Vec2(candy.box2dBody.GetPosition().x-15,candy.box2dBody.GetPosition().y-5));
	candy.box2dBody.SetAwake(true);*/
	


	self.addEventListener(LEvent.ENTER_FRAME,self.onframe);
	self.addEventListener(LMouseEvent.MOUSE_DOWN,self.ondown);
	self.addEventListener(LMouseEvent.MOUSE_UP,self.onup);
    LGlobal.box2d.setEvent(LEvent.PRE_SOLVE,self.dispearStar);
    LGlobal.box2d.setEvent(LEvent.END_CONTACT,self.dispearCandy);
    LGlobal.box2d.setEvent(LEvent.POST_SOLVE,self.connectRC);
}
Level_07.prototype.connectRC = function(contact){
    if(contact.GetFixtureA().GetBody().GetUserData().name == "obstacle" && 
    	contact.GetFixtureB().GetBody().GetUserData().name == "candy"){
     	LTweenLite.to(self,0.05,{onComplete: function(){
                    self.removeChild(candy);
       	}});
    	LTweenLite.to(self,0.5,{onComplete:function(){sound_name="restart";gameStart(stageIndex);}});
	}
}
Level_07.prototype.dispearStar = function(contact){
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
    if(contact.GetFixtureA().GetBody().GetUserData().name == "spring0" && 
        contact.GetFixtureB().GetBody().GetUserData().name == "candy"){
		spring[0].isact();
	}
	if(contact.GetFixtureA().GetBody().GetUserData().name == "spring1" && 
        contact.GetFixtureB().GetBody().GetUserData().name == "candy"){
		spring[1].isact();
	}
	if(contact.GetFixtureA().GetBody().GetUserData().name == "spring2" && 
        contact.GetFixtureB().GetBody().GetUserData().name == "candy"){
		spring[2].isact();
	}
	if(contact.GetFixtureA().GetBody().GetUserData().name == "spring3" && 
        contact.GetFixtureB().GetBody().GetUserData().name == "candy"){
		spring[3].isact();
	}
	if(contact.GetFixtureA().GetBody().GetUserData().name == "spring4" && 
        contact.GetFixtureB().GetBody().GetUserData().name == "candy"){
		spring[4].isact();
	}
	if(contact.GetFixtureA().GetBody().GetUserData().name == "spring5" && 
        contact.GetFixtureB().GetBody().GetUserData().name == "candy"){
		spring[5].isact();
	}
}
Level_07.prototype.dispearCandy = function(contact){
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
Level_07.prototype.onframe = function(){
	spring[0].onframe();spring[1].onframe();spring[2].onframe();spring[3].onframe();spring[4].onframe();spring[5].onframe();
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
Level_07.prototype.onup = function(event){
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
Level_07.prototype.ondown = function(event){
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