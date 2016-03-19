var mouseLRisDown = false,mouseRLisDown=false;
var candy,monster,star=[],star_count=0,cs=[];
var checkIndex = 0;
var mouseObject = {x:0,y:0};
var out = false;
var linejoint,joint=[],fix=[],rope=[]; // linejoint物體和繩子連接,joint各段繩子連接,box各段繩子
var point = 0, iseat=false;
var self;
var cursorpic,hint1,hint2,cursorCount=0;

function Level_01(){
	base(this,LSprite,[]);
	self = this;
	iseat=out=mouseRLisDown=mouseLRisDown=false;
	star_count=0;

	self.gamestart();
}

Level_01.prototype.gamestart = function(){
	var self=this;
    star_count=0;
    sound_count=0;
    cursorCount=0;
    rope.length=rope1.length=rope2.length=rope3.length=joint1.length=joint2.length=joint3.length=fix.length=star.length=0;

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
    monster.y=630;
    monster.x=650;
    var monster_pic=new LBitmap(new LBitmapData(dataList["pic_monster"]));
    monster_pic.x=-25;
    monster_pic.y=-50;
    monster.addChild(monster_pic);
    monster.addBodyPolygon(30,30,0,5,1,0);

//星星
    star=new LSprite();
    for(var i=0;i<3;i++){
    	star[i]=new LSprite();
       	star[i].name="star"+i;
        star[i].x=650;
        star[i].y=300+i*70;
        var star_bit=new LBitmap(new LBitmapData(dataList["star"]));
        star_bit.x=-40;
        star_bit.y=0;
        star[i].addChild(star_bit);
        star[i].addBodyCircle(15,35,0,0,0,1,0); //半径，圆心坐标Rx，Ry，静态或动态，密度，摩擦，弹力
    	self.addChild(star[i]);    
    }

//固定點
	var fix_position=[
	    {x:650,y:30}];
	fix=new LSprite();
	for(var i=0;i<fix_position.length;i++){
		fix[i]=new LSprite();
	    fix[i].name="fix"+i;
	    fix[i].x=fix_position[i].x;
	    fix[i].y=fix_position[i].y;
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
    for(var i=0;i<15;i++){
		rope[i] = new LSprite();
	    rope[i].x = 650;
	    rope[i].y = i*5+40;
	    self.addChild(rope[i]);
	    rope[i].addBodyPolygon(5,10,1,2,10,0.2);
        var ropepic=new LBitmap(new LBitmapData(dataList["rope"]));
        ropepic.x=0;
        ropepic.y=0;
        rope[i].addChild(ropepic);
        rope[i].bitmap=ropepic;
	    if(i==0) joint[i]=LGlobal.box2d.setRevoluteJoint(rope[i].box2dBody, fix[0].box2dBody );
        else joint[i]=LGlobal.box2d.setRevoluteJoint(rope[i].box2dBody, rope[i-1].box2dBody );
    }

//糖果
	candy = new LSprite();
    candy.name="candy";
	var bit = new LBitmap(new LBitmapData(dataList["candy"]));
	bit.x = 0;
	bit.y = 0;
	candy.addChild(bit);
	candy.bitmap = bit;
	candy.x = 650;
	candy.y = rope[rope.length-1].y+20;
	self.addChild(candy);
	candy.addBodyCircle(25,0,0,1,2,10,0.2);
	linejoint = LGlobal.box2d.setRevoluteJoint(candy.box2dBody, rope[rope.length-1].box2dBody );

	cursorpic=new LBitmap(new LBitmapData(dataList["cursor"]));
    cursorpic.x=520;
    cursorpic.y=100;
    self.addChild(cursorpic);

    hint1=new LBitmap(new LBitmapData(dataList["hint1"]));
    hint1.x=500;
    hint1.y=25;
    hint1.scaleX=1.2;
    self.addChild(hint1);

    hint2=new LBitmap(new LBitmapData(dataList["hint2"]));
    hint2.x=700;
    hint2.y=500;
    self.addChild(hint2);


	self.addEventListener(LEvent.ENTER_FRAME,self.onframe);
	self.addEventListener(LMouseEvent.MOUSE_DOWN,self.ondown);
	self.addEventListener(LMouseEvent.MOUSE_UP,self.onup);
    LGlobal.box2d.setEvent(LEvent.PRE_SOLVE,self.dispearStar);
    LGlobal.box2d.setEvent(LEvent.END_CONTACT,self.dispearCandy);
}
Level_01.prototype.dispearStar = function(contact){
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
			sound_player.playSound("star1");
    		break;
    	}
    	case 2:{
    		cs[1].removeAllChild();
			cs[1].addChild(bitmap);
			sound_player.playSound("star2");
    		break;
    	}
    	case 3:{
    		cs[2].removeAllChild();
			cs[2].addChild(bitmap);
			sound_player.playSound("star3");
    		break;
    	}
    }
}
Level_01.prototype.dispearCandy = function(contact){
    if(contact.GetFixtureA().GetBody().GetUserData().name == "monster" && 
        contact.GetFixtureB().GetBody().GetUserData().name == "candy"){
        monster.removeAllChild();
        var monster_pic=new LBitmap(new LBitmapData(dataList["happy"]));
        monster_pic.x=-25;
        monster_pic.y=-50;
        monster.addChild(monster_pic);
		self.removeChild(candy);
		iseat=true;
	}
}
Level_01.prototype.onframe = function(){
	if(cursorpic.x<820&&cursorCount<2) cursorpic.x+=2;
	else{
		if(cursorCount<2){
			cursorpic.x=520;
			cursorCount++;
		}
		else{
			self.removeChild(hint1);
			self.removeChild(cursorpic);
			self.removeChild(hint2);
		}
	}

	if(!out)return;
	if(!iseat&&candy.x >= monster.x-100 && candy.y+50>=monster.y-100){
		monster.removeAllChild();
		var monster_pic=new LBitmap(new LBitmapData(dataList["eat"]));
		monster_pic.x=-25;
  		monster_pic.y=-50;
		monster.addChild(monster_pic);
		sound_player.playSound("eat");
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
Level_01.prototype.onup = function(event){
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
Level_01.prototype.ondown = function(event){
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