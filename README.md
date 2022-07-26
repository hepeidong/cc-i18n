# cc-i18n
基于cocos creator引擎的游戏开发i18n多语言模块，是在nodejs环境下运行的i18n工具，所以需要确保安装nodejs环境。
该工具可以帮助你自动检测游戏预制体中的cc.Label组件，并生成相应的key存储在json文件中，并把相对应的key设置在I18nLabel组件中，同时也支持自动给预制体增加I18nLabel组件

## 安装
    搭建nodejs环境，并查看是否有nodejs和npm版本 node --version npm --version，如果以确定安装了相应环境，则执行下面命令进行安装：
    npm install  cc-i18n -g
    
## 命令行
 工具通过五个命令可以启动运行：

    cc-i18n create  这个命令会在项目的scripts/i18n目录下生成i18n模块代码，同时在resources/i18n生成相应目录结构

    cc-i18n gen-key  这个命令是根据预制体节点中挂载的cc.Label组件生成相应的key，并把key保存到一个Json文件中

    cc-i18n set-key  这个命令会检查挂有cc.Label组件的这些节点是否有挂载I18nLabel组件，如果有，则把相应的key设置到组件上

    cc-i18n run-gen-set-key  这个命令是根据预制体节点中挂载的cc.Label组件生成相应的key，并把key保存到一个Json文件中，然后再检
    查挂有cc.Label组件的这些节点是否有挂载I18nLabel组件，如果有，则把相应的key设置到组件上

    cc-i18n run-gen-set-key --g 这个命令是根据预制体节点中挂载的cc.Label组件生成相应的key，并把key保存到一个Json文件中，然后再在挂载了
    cc.Label组件的节点上增加I18nLabel组件，并把相应的key设置到组件上（这个功能在大项目中可能会存在问题）
    
## 功能
    对于静态文本，需要开发者自行在挂在了cc.Label组件的节点上挂在I18nLabel组件，或者可以使用cc-i18n run-gen-set-key --g自动给相应节点挂在I18nLabel组件，
    需要注意这个命令会给所有挂在了cc.Label组件的节点自动挂在I18nLabel组件，故需要考虑是否所有label节点都是静态文本
    
    对于动态文本，可以通过调用 I18nManager.getInstance().getText()接口去获取相应的文本，该接口通过传入的key获取json文件中的内容，开发者可以事先在相应的json文件中增加对应的键值对。
    
## 如何增加语言
  可以在LanguageEnum文件中增加语言枚举，例如：
     enum Language {
        'zh',
        'en',
     }
    同时在resources/i18n.text目录下增加与枚举同名的json文件即可
    
## cocos creator 版本
  3.x以上
