/**
 * Main类
 * @author lufy
 * @blog http://blog.csdn.net/lufy_Legend
 * @email lufy.legend@gmail.com
 **/
if(LGlobal.canTouch){
	LGlobal.stageScale = LStageScaleMode.SHOW_ALL;
	LSystem.screen(LStage.FULL_SCREEN);
}

function doScroll() {
	if(window.pageYOffset === 0) {
		window.scrollTo(0, 0);
	}
}
window.onload = function() {
	setTimeout(doScroll, 1000);
	init(10,"legend",1365,700,main,LEvent.INIT);
}
window.onorientationchange = function() {
	setTimeout(doScroll, 100);
};
window.onresize = function() {
	setTimeout(doScroll, 100);
}


var loadingLayer,backLayer;

var DOWN = 0;
var LEFT = 1;
var RIGHT = 2;
var UP = 3;
var STEP = 48;
var isKeyDown = false;

var LoadData = [
{path:"./js/Stage.js",type:"js"},
{path:"./js/GameLogo.js",type:"js"},
{path:"./js/GameMenu.js",type:"js"},
{path:"./js/air.js",type:"js"},
{path:"./js/taco.js",type:"js"},
{path:"./js/spring_bed.js",type:"js"},
{path:"./js/level_1.js",type:"js"},
{path:"./js/level_2.js",type:"js"},
{path:"./js/level_3.js",type:"js"},
{path:"./js/level_4.js",type:"js"},
{path:"./js/level_5.js",type:"js"},
{path:"./js/level_6.js",type:"js"},
{path:"./js/level_7.js",type:"js"},
{path:"./js/level_8.js",type:"js"},
{path:"./js/level_9.js",type:"js"},
{path:"./js/getstar.js",type:"js"},
{path:"./js/button.js",type:"js"},
{path:"./js/SoundPlayer.js",type:"js"},
{name:"logo",path:"./image/logo.png"},
{name:"bg",path:"./image/bg.png"},
{name:"play",path:"./image/play.png"},
{name:"play2",path:"./image/play2.png"},
{name:"menu",path:"./image/menu.png"},
{name:"menu2",path:"./image/menu2.png"},
{name:"retry",path:"./image/retry.png"},
{name:"retry2",path:"./image/retry2.png"},
{name:"next",path:"./image/next.png"},
{name:"next2",path:"./image/next2.png"},
{name:"back",path:"./image/back.png"},
{name:"back2",path:"./image/back2.png"},
{name:"menu_2",path:"./image/menu_2.png"},
{name:"menu_22",path:"./image/menu_22.png"},
{name:"restart",path:"./image/restart.png"},
{name:"restart2",path:"./image/restart2.png"},
{name:"level_0",path:"./image/level_0.png"},
{name:"level_1",path:"./image/level_1.png"},
{name:"level_2",path:"./image/level_2.png"},
{name:"level_3",path:"./image/level_3.png"},
{name:"level_lock",path:"./image/level_lock.png"},
{name:"candy",path:"./image/candy.png"},
{name:"fix",path:"./image/fix.png"},
{name:"rope",path:"./image/rope.png"},
{name:"base",path:"./image/base.png"},
{name:"star",path:"./image/star.png"},
{name:"cstar",path:"./image/cstar.png"},
{name:"cstar2",path:"./image/cstar2.png"},
{name:"eat",path:"./image/eat.png"},
{name:"happy",path:"./image/happy.png"},
{name:"sad",path:"./image/sad.png"},
{name:"pic_monster",path:"./image/monster.png"},
{name:"bad",path:"./image/bad.png"},
{name:"good",path:"./image/good.png"},
{name:"great",path:"./image/great.png"},
{name:"excellent",path:"./image/excellent.png"},
{name:"getstar",path:"./image/get_star.png"},
{name:"getstar2",path:"./image/get_star2.png"},
{name:"ground",path:"./image/ground.png"},
{name:"obstacle",path:"./image/obstacle.png"},
{name:"sound",path:"./image/sound.png"},
{name:"sound_effect",path:"./image/sound_effect.png"},
{name:"silent",path:"./image/silent.png"},
{name:"sound2",path:"./image/sound2.png"},
{name:"sound_effect2",path:"./image/sound_effect2.png"},
{name:"silent2",path:"./image/silent2.png"},
{name:"bubble",path:"./image/bubble.png"},
{name:"shadow_1",path:"./image/shadow_1.png"},
{name:"shadow_2",path:"./image/shadow_2.png"},
{name:"air_cushion_list",path:"./image/air_cushion_list.png"},
{name:"spring_bed_list",path:"./image/spring_bed_SpriteSheet.png"},
{name:"sea",path:"./image/sea.png"},
{name:"timber",path:"./image/timber.png"},
{name:"wood",path:"./image/wood.png"},
{name:"taco",path:"./image/taco1.png"},
{name:"hat",path:"./image/hat.png"},
{name:"cursor",path:"./image/cursor.png"},
{name:"hint1",path:"./image/hint1.png"},
{name:"hint2",path:"./image/hint2.png"},
];

var dataList = {};
var stageIndex = -1;
var startTime,stages = 0,stars=0;
var sound_player,sound_name="main",clear_sound=0;
var sound_select=0;
var key,keylist=[67,85,84,190,84,72,69,190,82,79,80,69],keyCount=0;

function main(){
	LGlobal.stageScale = LStageScaleMode.SHOW_ALL;
	LSystem.screen(LStage.FULL_SCREEN);
	//预读取音频
	var loadsound = true;
	var protocol = location.protocol;
	if (protocol == "http:" || protocol == "https:") {
		if (LGlobal.ios && !LSound.webAudioEnabled){
			//如果IOS环境，并且不支持WebAudio，则无法预先读取
			loadsound = false;
		}
	} else if (LGlobal.mobile) {
		//如果是移动浏览器本地访问，则无法预先读取
		loadsound = false;
	}
	if(loadsound){
		LoadData.push({name : "sound_main",path : "./sound/main.mp3"});
		if(LSound.webAudioEnabled || LGlobal.os == OS_PC){
			//浏览器支持WebAudio，或者环境为PC，则预先读取所有音频
			LoadData.push({name : "sound_click",path : "./sound/click.mp3"});
			LoadData.push({name : "sound_cut",path : "./sound/cut.mp3"});
			LoadData.push({name : "sound_cleared",path : "./sound/clear.mp3"});
			LoadData.push({name : "sound_eat",path : "./sound/eat.mp3"});
			LoadData.push({name : "sound_sad",path : "./sound/sad.mp3"});
			LoadData.push({name : "sound_star_1",path : "./sound/star_1.mp3"});
			LoadData.push({name : "sound_star_2",path : "./sound/star_2.mp3"});
			LoadData.push({name : "sound_star_3",path : "./sound/star_3.mp3"});
			LoadData.push({name : "sound_level",path : "./sound/level.mp3"});
		}
	}
	if(LGlobal.mobile){
		LGlobal.stageScale = LStageScaleMode.SHOW_ALL;
		LSystem.screen(LStage.FULL_SCREEN);
	}

	LMouseEventContainer.set(LMouseEvent.MOUSE_DOWN,true);
	LMouseEventContainer.set(LMouseEvent.MOUSE_UP,true);
	LMouseEventContainer.set(LMouseEvent.MOUSE_MOVE,true);
	LMouseEventContainer.set(LMouseEvent.MOUSE_OUT,true);
	LGlobal.stage.addEventListener(LKeyboardEvent.KEY_DOWN,keydown); 
	
	loadingLayer = new LoadingSample5();
	addChild(loadingLayer);	
	LLoadManage.load(
		LoadData,
		function(progress){
			loadingLayer.setProgress(progress);
		},
		gameInit
	);
}
function gameInit(result){
	LGlobal.setDebug(true);
	dataList = result;
	removeChild(loadingLayer);
	loadingLayer = null;
	backLayer = new LSprite();
	addChild(backLayer);
	sound_player= new SoundPlayer();
	gameLogoShow();
	LGlobal.box2d = new LBox2d();
}
function gameLogoShow(){
	sound_player.playSound("logo");
	var layer = new GameLogo();
	backLayer.addChild(layer);
}

function menuShow(){
	if (typeof(Storage) != "undefined"){
		for(var i=0;i<stageMenu.length;i++){
			if(localStorage.getItem("stars"+i)!=null&&localStorage.getItem("opens"+i)!=null){
				stageMenu[i].stars=parseInt(localStorage.getItem("stars"+i));
				stageMenu[i].open=localStorage.getItem("opens"+i);
			}
		}
	}
	else{
		for(var i=0;i<stageMenu.length;i++){
    		localStorage.setItem("stars"+i, stageMenu[i].stars);
    		localStorage.setItem("opens"+i, stageMenu[i].open);
    	}
	}
	if(stageIndex!=-1)sound_player.playSound("menu");
	backLayer.removeAllChild();
	backLayer.die();
	
	var layer = new GameMenu();
	backLayer.addChild(layer);
}
function gameStart(index){
	backLayer.removeAllChild();
	backLayer.die();
	
	
	if(sound_name!="restart") sound_player.playSound("level");
	else sound_player.playSound("restart");


	clear_sound=0;

	stageIndex=index;
	var level
	switch(index+1){
		case 1:{
			level=new Level_01();
			break;
		}
		case 2:{
			level=new Level_02();
			break;
		}
		case 3:{
			level=new Level_03();
			break;
		}
		case 4:{
			level=new Level_04();
			break;
		}
		case 5:{
			level=new Level_05();
			break;
		}
		case 6:{
			level=new Level_06();
			break;
		}
		case 7:{
			level=new Level_07();
			break;
		}
		case 8:{
			level=new Level_08();
			break;
		}
		case 9:{
			level=new Level_09();
			break;
		}
	}
	backLayer.addChild(level);
}
function onframe(){
}
function keydown(e){
	key=e.keyCode;
	if(key==keylist[keyCount]) keyCount++;
	else keyCount=0;

	if(keyCount==keylist.length) openAllLevel();
}
function openAllLevel(){
	if (typeof(Storage) != "undefined") {
    // Store
    	for(var i=0;i<stageMenu.length;i++){
    		localStorage.setItem("opens"+i, "true");
    		localStorage.setItem("stars"+i, "3");
    	}
	}
	menuShow();
}