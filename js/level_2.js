var mouseLRisDown = false,mouseRLisDown=false;
var mouseDownX,mouseDownY;
var candy,star=[],star_count=0;
var checkIndex = 0;
var mouseObject = {x:0,y:0};
var out = false,cut=false;
var linejoint,linejoint2,linejoint3,joint1=[],joint2=[],joint3=[];
var rope1=[],rope2=[],rope3=[],fix=[]; // linejoint物體和繩子連接,joint各段繩子連接,box各段繩子
var point = 0,iseat=false,isrope=false;
var cutRope=[];
var self;
var sound_count=0,sound_count2=true;

function Level_02(){
	base(this,LSprite,[]);
	self = this;
	iseat=out=mouseRLisDown=mouseLRisDown=isrope=false;
	star_count=0;
    sound_count=0;
	self.gamestart();
}

Level_02.prototype.gamestart = function(){
	var self=this;
    star_count=0;
    sound_count=0;
    rope1.length=rope2.length=rope3.length=joint1.length=joint2.length=joint3.length=fix.length=star.length=0;
    cutRope=[{val:0},{val:0},{val:0}];
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
    wallLayer.y = 620;
    wallLayer.x = 750;
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
    monster.y=600;
    monster.x=750;
    var monster_pic=new LBitmap(new LBitmapData(dataList["pic_monster"]));
    monster_pic.x=-25;
    monster_pic.y=-50;
    monster.addChild(monster_pic);
    monster.addBodyPolygon(40,40,0,5,1,0);

//星星
	var star_position=[
    	{x:550,y:310},
        {x:775,y:300},
        {x:550,y:450}];
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
        star[i].addBodyCircle(0,0,0,0,0,0,0); //半径，圆心坐标Rx，Ry，静态或动态，密度，摩擦，弹力
    	self.addChild(star[i]);   
    }

//固定點
	var fix_position=[
    	{x:550,y:100},
       	{x:675,y:100},
        {x:800,y:100}];
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
    for(var i=0;i<15;i++){
		rope1[i] = new LSprite();
        rope1[i].name="rope1";
	    rope1[i].x = 550;
	    rope1[i].y = 110+i*8;
        self.addChild(rope1[i]);
	    rope1[i].addBodyPolygon(5,10,1,5,10,0.2);
        var ropepic=new LBitmap(new LBitmapData(dataList["rope"]));
        ropepic.x=0;
        ropepic.y=0;
        rope1[i].addChild(ropepic);
        rope1[i].bitmap=ropepic;
        if(i==0) joint1[i]=LGlobal.box2d.setRevoluteJoint(rope1[i].box2dBody, fix[0].box2dBody );
	    else joint1[i]=LGlobal.box2d.setRevoluteJoint(rope1[i].box2dBody, rope1[i-1].box2dBody );
        rope1[i].visible=false;
	}
    for(var i=0;i<40;i++){
        rope2[i] = new LSprite();
        rope2[i].name="rope2";
        rope2[i].x = 675;
        rope2[i].y = 110+i*5;
        self.addChild(rope2[i]);
        rope2[i].addBodyPolygon(5,10,1,5,10,0.2);
        var ropepic=new LBitmap(new LBitmapData(dataList["rope"]));
        ropepic.x=0;
        ropepic.y=0;
        rope2[i].addChild(ropepic);
        rope2[i].bitmap=ropepic;
        if(i==0) joint2[i]=LGlobal.box2d.setRevoluteJoint(rope2[i].box2dBody, fix[1].box2dBody );
        else joint2[i]=LGlobal.box2d.setRevoluteJoint(rope2[i].box2dBody, rope2[i-1].box2dBody);
        rope2[i].visible=false;
    };
    for(var i=0;i<48;i++){
        rope3[i] = new LSprite();
        rope3[i].name="rope3";
        rope3[i].x = 800;
        rope3[i].y = 110+i*8;
        self.addChild(rope3[i]);
        rope3[i].addBodyPolygon(5,10,1,5,10,0.2);
        var ropepic=new LBitmap(new LBitmapData(dataList["rope"]));
        ropepic.x=0;
        ropepic.y=0;
        rope3[i].addChild(ropepic);
        rope3[i].bitmap=ropepic;
        if(i==0) joint3[i]=LGlobal.box2d.setRevoluteJoint(rope3[i].box2dBody, fix[2].box2dBody );
        else joint3[i]=LGlobal.box2d.setRevoluteJoint(rope3[i].box2dBody, rope3[i-1].box2dBody);
        rope3[i].visible=false;
    };
//糖果
	candy = new LSprite();
    candy.name="candy";
	var bit = new LBitmap(new LBitmapData(dataList["candy"]));
	bit.x = 0;
	bit.y = 0;
	candy.addChild(bit);
	candy.bitmap = bit;
	candy.x = 550;
	candy.y = rope1[rope1.length-1].y+20;
	self.addChild(candy);
	candy.addBodyCircle(25,0,0,1,1,10,0.7);
    candy.visible=false;
	linejoint = LGlobal.box2d.setRevoluteJoint(candy.box2dBody, rope1[rope1.length-1].box2dBody );
    /*
    rope3[rope3.length-1].box2dBody.SetPosition(new LGlobal.box2d.b2Vec2(rope3[rope3.length-1].box2dBody.GetPosition().x-40,rope3[rope3.length-1].box2dBody.GetPosition().y-35));
    rope2[rope2.length-1].box2dBody.SetPosition(new LGlobal.box2d.b2Vec2(rope2[rope2.length-1].box2dBody.GetPosition().x-10,rope2[rope2.length-1].box2dBody.GetPosition().y-3));
    */
    var vec = new LGlobal.box2d.b2Vec2(-68000,-1200);
	rope3[rope3.length-1].box2dBody.ApplyForce(vec, rope3[rope3.length-1].box2dBody.GetWorldCenter());
    vec=new LGlobal.box2d.b2Vec2(250,0);
    candy.box2dBody.ApplyForce(vec,candy.box2dBody.GetWorldCenter());
    vec=new LGlobal.box2d.b2Vec2(-280,-800);
    rope2[rope2.length-1].box2dBody.ApplyForce(vec, rope2[rope2.length-1].box2dBody.GetWorldCenter());
    vec=new LGlobal.box2d.b2Vec2(0,0);
    rope3[rope3.length-1].box2dBody.ApplyForce(vec, rope3[rope3.length-1].box2dBody.GetWorldCenter());
    rope2[rope2.length-1].box2dBody.ApplyForce(vec, rope2[rope2.length-1].box2dBody.GetWorldCenter());
    candy.box2dBody.ApplyForce(vec,candy.box2dBody.GetWorldCenter());

	self.addEventListener(LEvent.ENTER_FRAME,self.onframe);
	self.addEventListener(LMouseEvent.MOUSE_DOWN,self.ondown);
	self.addEventListener(LMouseEvent.MOUSE_UP,self.onup);
    LGlobal.box2d.setEvent(LEvent.PRE_SOLVE,self.dispearStar);
    LGlobal.box2d.setEvent(LEvent.END_CONTACT,self.dispearCandy);
    LGlobal.box2d.setEvent(LEvent.POST_SOLVE,self.connectRC);
}
Level_02.prototype.dispearStar = function(contact){
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
Level_02.prototype.dispearCandy = function(contact){
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
Level_02.prototype.connectRC = function(contact){
	if(contact.GetFixtureA().GetBody().GetUserData().name == "rope2" && 
        contact.GetFixtureB().GetBody().GetUserData().name == "candy"){
        	linejoint2 = LGlobal.box2d.setRevoluteJoint(candy.box2dBody,rope2[rope2.length-1].box2dBody);
    }
    if(contact.GetFixtureA().GetBody().GetUserData().name == "rope3" && 
        contact.GetFixtureB().GetBody().GetUserData().name == "candy"){
            linejoint3 = LGlobal.box2d.setRevoluteJoint(candy.box2dBody,rope3[rope3.length-1].box2dBody);
            for(var i=0;i<rope1.length;i++) rope1[i].visible=true;
            for(var i=0;i<rope2.length;i++) rope2[i].visible=true;
            for(var i=0;i<rope3.length;i++) rope3[i].visible=true;
            candy.visible=true;
            
    }
}
Level_02.prototype.onframe = function(){
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

Level_02.prototype.onup = function(event){
	if(out){
    	out=false;
        cut=false;
        return;
    }
    sound_count2=true;
    out=false;
    if(cutRope[0].val==0 &&event.offsetY < rope1[rope1.length-1].y+20 && event.offsetY> rope1[0].y){
        if( event.offsetX >= rope1[0].x+2 && mouseObject.x<rope1[0].x){
            LGlobal.box2d.world.DestroyJoint(linejoint);
            out = true;
        }
        else if( event.offsetX <=rope1[0].x && mouseObject.x>rope1[0].x+2){
            LGlobal.box2d.world.DestroyJoint(linejoint);
            out = true;
        }
        else out=false;
        if(out){
            cut=false;
            var temp;
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
            cutRope[0].val=1;
        }
        out=cut=false;
    }

   
    if(cutRope[1].val==0 && event.offsetY < rope2[rope2.length-1].y+20 && event.offsetY> rope2[0].y){
        if( event.offsetX >= rope2[0].x+2 && mouseObject.x<rope2[0].x){
            LGlobal.box2d.world.DestroyJoint(linejoint2);
            out = true;
        }
        else if( event.offsetX <=rope2[0].x && mouseObject.x>rope2[0].x+2){
            LGlobal.box2d.world.DestroyJoint(linejoint2);
            out = true;
        }
        else out=false;
        mouseRLisDown = false;
        mouseLRisDown = false;
        if(out){
            cut=false;
            var temp;
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
            cutRope[1].val=1;
        }
        out=ccut=false;
    }

    if(cutRope[2].val==0 && event.offsetY < rope3[rope3.length-1].y+20 && event.offsetY> rope3[0].y){
        if(event.offsetX >= rope3[0].x+2 && mouseObject.x<rope3[0].x){
            LGlobal.box2d.world.DestroyJoint(linejoint3);
            out = true;
        }
        else if(event.offsetX <=rope3[0].x && mouseObject.x>rope3[0].x+2){
            LGlobal.box2d.world.DestroyJoint(linejoint3);
            out = true;
        }
        else out=false;
        if(out){
            cut=false;
            var temp;
            for(var i=0;i<rope3.length;i++){
                if((event.offsetY+mouseObject.y)/2>rope3[i].y&&(event.offsetY+mouseObject.y)/2<=rope3[i+1].y){
                    LGlobal.box2d.world.DestroyJoint(joint3[i]);
                    cut=true;
                    sound_player.playSound("cut");
                    temp=i;
                }
                if(cut){ 
                    self.removeChild(rope3[i]);
                }
            }
            LTweenLite.to(self,0.3,{ease:LEasing.Strong.easeInOut,onComplete:function(){
                for(var i=temp;i>=0;i--){
                    self.removeChild(rope3[i]);
                }
            }});
            cutRope[2].val=1;
        }
        out=cut=false;
    }
}
Level_02.prototype.ondown = function(event){
    if(out)return;
    mouseObject.x = event.offsetX;
    mouseObject.y = event.offsetY;
}