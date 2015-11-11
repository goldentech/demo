//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends egret.DisplayObjectContainer {

    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView:LoadingUI;
    // hit counter
    private hits: number;


    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event:egret.Event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }

    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    private onConfigComplete(event:RES.ResourceEvent):void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.loadGroup("obj");
    }

    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    private onResourceLoadComplete(event:RES.ResourceEvent):void {
        if (event.groupName == "obj") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            this.createGameScene();
        }
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onResourceLoadError(event:RES.ResourceEvent):void {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    }

    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    private onResourceProgress(event:RES.ResourceEvent):void {
        if (event.groupName == "obj") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    private textfield:egret.TextField;

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene():void {
        this.hits = 0;
        var bg: egret.Shape = new egret.Shape;
        bg.graphics.beginFill(0x336699);
        bg.graphics.drawRect(0,0,this.stage.stageWidth,this.stage.stageHeight);
        bg.graphics.endFill();
        this.addChild(bg);
        
        // add monster to scene
        var monster: egret.Bitmap = new egret.Bitmap(RES.getRes("monster"));
        monster.x = 350;
        monster.y = 100;
        this.addChild(monster);
        
        // add monster2 to scene
        var monster2: egret.Bitmap = new egret.Bitmap(RES.getRes("monster2"));
        monster2.x = 200;
        monster2.y = 300;
        this.addChild(monster2);
        
        // add sword to scene
        var sword: egret.Bitmap = new egret.Bitmap(RES.getRes("sword"));
        sword.x = 50;
        sword.y = 150;
        this.addChild(sword);
        
        // touch event
        monster.touchEnabled = true;
        // Monster: change alpha filter and size when under attack, sword: move while touching monster
        monster.addEventListener(egret.TouchEvent.TOUCH_TAP,function() { egret.Tween.get(sword).to({ x: 250 },30).to({ x: 50 },350); },this);
        monster.addEventListener(egret.TouchEvent.TOUCH_TAP,function() { egret.Tween.get(monster).to({ scaleX: .95,scaleY: .95,alpha: .2 },250,egret.Ease.circIn).to({ scaleX: 1,scaleY: 1,alpha: 1 },250,egret.Ease.circIn); },this);


        monster2.touchEnabled = true;
        monster2.addEventListener(egret.TouchEvent.TOUCH_TAP,function() { egret.Tween.get(sword).to({ x: 250,y: 340,rotation: 35 },30).to({ x: 50,y: 150,rotation: 0 },350); },this);
        monster2.addEventListener(egret.TouchEvent.TOUCH_TAP,
            function() {
                this.hits++;
                
                // when hits equal to 4, monster disappear
                if(this.hits == 4) {
                    this.hits = 0;
                    this.removeChild(monster2);
                    return;
                }
                egret.Tween.get(monster2).to({ scaleX: .95,scaleY: .95,alpha: .2 },250,egret.Ease.circIn).to({ scaleX: 1,scaleY: 1,alpha: 1 },250,egret.Ease.circIn);
            },
            this);  
    }
}


