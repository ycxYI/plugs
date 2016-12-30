//=============================================================================
// Ycx_VersionCheck.js
//=============================================================================
var Imported = Imported || {};
Imported.Ycx_VersionCheck = true;

var Ycx = Ycx || {};
Ycx.CHECK = Ycx.CHECK || {};
/*:
 * @plugindesc 基于代码托管网站的检测游戏版本插件 v1.0.0
 * @author ycx
 * 
 * @param nowVersion
 * @desc 目前游戏版本
 * @default 1.0.0
 * 
 * 
 * @param urlText
 * @desc 检测版本的url地址
 * @default http://ycxm.coding.me/jquery/version.txt
 * 
 * @param showInTitle
 * @desc 菜单是否显示版本检查  false 不显示  true 显示
 * @default true
 * 
 *  @param showInTitleText
 * @desc showInTitle为true，即要显示的标题命令文字
 * @default 版本检测
 * 
 *  
 * @param urlOpen
 * @desc 有新版本则要打开的url地址
 * @default http://ycxm.coding.me/jquery/version.rar
 * 
 * @param startCheck
 * @desc 是否开始游戏就检查版本  false 不检查  true 检查
 * @default true
 * 
 * 
 * @help 
 * ================================================================
 * 检测游戏版本 
 * ================================================================
 *   依赖项：需要导入Jquery.js
 * 
 *   nowVersion:当前游戏版本。
 * 
 *   urlText:检测版本的url地址,代码托管网站的文件地址，得到的是版本号，不要写其他的。
 *   
 *   showInTitle：是否在标题显示版本检查这一项。  false 不显示  true 显示
 * 
 *   showInTitleText：showInTitle为true时，即要显示的标题命令文字。
 * 
 *   urlOpen：检测到有新版本则要打开的url地址，可打开官网之类。
 * 
 *   startCheck：是否开始游戏就检查版本。   false 不检查  true 检查
 * 
 *   插件命令：“命令 内容” 形式，示例如下：
 *       1. checkversion http://ycxm.coding.me/jquery/version.txt      检测游戏版本
 * 
 *       2. openurl  https://www.baidu.com                             打开网址，可打开游戏官网等。
 * 
 *  最后qq：1359762297 
 *  ycx插件库：https://github.com/ycxYI/plugs（待更新）
 * 
 */
　

Ycx.parameters = PluginManager.parameters('Ycx_VersionCheck');

Ycx.nowVersion = String(Ycx.parameters['nowVersion'] || '1.0.0');
Ycx.urlText = String(Ycx.parameters['urlText'] || 'http://ycxm.coding.me/jquery/version.txt');
Ycx.showInTitle = String(Ycx.parameters['showInTitle'] || 'true');
Ycx.showInTitleText = String(Ycx.parameters['showInTitleText'] || '版本检测');
Ycx.urlOpen = String(Ycx.parameters['urlOpen'] || 'http://ycxm.coding.me/jquery/version.rar');
Ycx.startCheck = String(Ycx.parameters['startCheck'] || 'true');

//=============================================================================
// SceneManager
//=============================================================================

SceneManager.openPopupBlockerMessage = function() {
	this._scene.openPopupBlockerMessage();
};

//=============================================================================
// Game_Interpreter
//=============================================================================

Ycx.CHECK.Game_Interpreter_pluginCommand =
    Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    Ycx.CHECK.Game_Interpreter_pluginCommand.call(this, command, args)
    if (command === 'checkversion') this.checkVersion(args);
    if (command === 'openurl') this.openurl(args);
};

Game_Interpreter.prototype.checkVersion = function(args) {
    TouchInput.clear();
    Input.clear();
    var url = String(args[0]);
    $(document).load(url, function(responseText, textStatus) {
        if (Ycx.nowVersion == responseText) {
            alert("已经是最新版本！");
        } else {
            if (confirm("存在最新版本是否更新？")) {
                var win = window.open(url);
                if (win) {
                    win.focus();
                } else {
                    SceneManager.openPopupBlockerMessage();
                }
            }
        }

    });
};

Game_Interpreter.prototype.openurl = function(args) {
    TouchInput.clear();
    Input.clear();
    var url = String(args[0]);
    var win = window.open(url);
    if (win) {
        win.focus();
    } else {
        SceneManager.openPopupBlockerMessage();
    }
           
};

//-----------------------------------------------------------------------------
//开始检测
//-----------------------------------------------------------------------------
if (Ycx.startCheck == "true") {
    $(document).load(Ycx.urlText, function(responseText, textStatus) {

        if (Ycx.nowVersion == responseText) {
            alert("已经是最新版本！");
        } else {
            if (confirm("存在最新版本是否更新？")) {
                var win = window.open(Ycx.urlOpen);
                if (win) {
                    win.focus();
                } else {
                    SceneManager.openPopupBlockerMessage();
                }
            }
        }

    });
}

//-----------------------------------------------------------------------------
// Scene_Title
//-----------------------------------------------------------------------------

Scene_Title.prototype.createCommandWindow = function() {
    this._commandWindow = new Window_TitleCommand();
    this._commandWindow.setHandler('newGame', this.commandNewGame.bind(this));
    this._commandWindow.setHandler('continue', this.commandContinue.bind(this));
    this._commandWindow.setHandler('options', this.commandOptions.bind(this));
    if (Ycx.showInTitle == "true") {
        this._commandWindow.setHandler('Check', this.versionCheck.bind(this));
    }
    this.addWindow(this._commandWindow);
};

Scene_Title.prototype.versionCheck = function() {
    this._commandWindow.close();
    $(document).load(Ycx.urlText, function(responseText, textStatus) {
        if (Ycx.nowVersion == responseText) {
            alert("已经是最新版本！");
        } else {
            if (confirm("存在最新版本是否更新？")) {
                var win = window.open(Ycx.urlOpen);
                if (win) {
                    win.focus();
                } else {
                    SceneManager.openPopupBlockerMessage();
                }
            }
        }
    });
    SceneManager.goto(Scene_Title);
};

//-----------------------------------------------------------------------------
// Window_TitleCommand
//-----------------------------------------------------------------------------

Window_TitleCommand.prototype.makeCommandList = function() {
    this.addCommand(TextManager.newGame, 'newGame');
    this.addCommand(TextManager.continue_, 'continue', this.isContinueEnabled());
    this.addCommand(TextManager.options, 'options');
    if (Ycx.showInTitle == "true") {
        this.addCommand(Ycx.showInTitleText, 'Check');
    }
};