# 简介
基于cocos creator引擎的游戏开发i18n多语言模块，是在nodejs环境下运行的i18n工具，所以需要确保安装nodejs环境。
该工具可以帮助你自动检测游戏预制体中的cc.Label组件，并生成相应的key存储在json文件中，并把相对应的key设置在
I18nLabel组件中，同时也支持自动给预制体增加I18nLabel组件

## 介绍
> + 安装
> + 命令行
> + 功能使用
> + 如何增加新语言
> + 如何使用标签多语言json文件
> + 版本
> + 使用说明链接

### 安装
> 搭建nodejs环境，并查看是否有nodejs和npm版本 node --version npm --version，如果以确定安装了相应环境，
> 则执行下面命令进行安装：
> *npm install  cc-i18n -g*
    
### 命令行
 > **工具通过五个命令可以启动运行：**

> + cc-i18n create:
> > 这个命令会在项目的scripts/i18n目录下生成i18n模块代码，同时在resources/i18n生成相应目录结构

> + cc-i18n gen-key:

> > + label多语言：
> > > 这个命令是根据预制体Label节点中挂载的I18nLabel组件生成相应的key，并把key保存到一个Json文件中;
> > > 注意：每一个需要自动生成多语言key的label节点，都需要手动挂载I8nLabel组件，如果想自动挂载，请使用
> > > cc-i18n gen-set-key --g 这个命令，但这个命令会在所有label节点上挂载I18nLabel组件，故使用前
> > > 需要考虑清楚是不是所有label节点都是静态文本。

> > + sprite多语言：
> > > 对于sprite多语言来说，会检测assets/resources/i18n/sprite目录下的所有图片资源，并获取图片资源的uuid，
> > > 把uuid存储在json文件中。在使用时，必须先在i18n/sprite/路径下根据不同的语言增加相应的目录，比如，如果
> > > 你只发布中文和英语两种语言，那么就在i18n/sprite路径下建zh和en两个文件夹，在这两个文件夹下各自语言的图片，
> > > 必须要确保同一种图片，在不同语言文件夹下的图片文件名相同。

> > > **注意：i18n/sprite/json路径下的文件内容不得更改，除非你完全了解更改后会产生什么后果**
        

> + cc-i18n set-key:
> > 需要开发者实现在须要进行多语言适配的挂有cc.Label组件或者cc.Sprite组件的节点挂载I18nLabel组件或者I18nSprite组件，
> > 只有挂载了对应的I18nLabel组件和I18nSprite组件，才能对这两个组件设置key。

> > + label多语言：
> > > 这个命令会检查挂有cc.Label组件的这些节点是否有挂载I18nLabel组件，如果有，则把相应的key设置到组件上

> > + sprite多语言：
> > > 这个命令会检查挂有cc.Sprite组件的这些节点是否有挂载I18nSprite组件，如果有，则会根据cc.Sprite组件上挂载的
> > > 相应图片，把这张图片的uuid设置到I18nSprite组件上。

> + cc-i18n gen-set-key:
> > 这个命令会同时执行 cc-i18n gen-key, cc-i18n set-key命令。

> + cc-i18n gen-set-key -g:
> > 这个命令是根据预制体节点中挂载的cc.Label组件生成相应的key，并把key保存到一个Json文件中，然后再在挂载了
> > cc.Label组件的节点上增加I18nLabel组件，并把相应的key设置到组件上（这个功能在大项目中可能会存在问题）

> > **注意：这个命令对sprite多语言不起作用，只有label多语言才有用，当使用这个命令时，sprite多语言不会生成key，**
> > **以及设置key。**
    
### 功能使用

> + 初始化
> > 在项目根目录下运行命令 ***cc-i18n create***

> > + 静态文本
> > > 在项目根目录运行 ***cc-i18n gen-set-key*** 可以生成并设置多语言key
> > + 动态文本
> > > 可以使用下面方法设置动态文本：

    node.getComponent(I18nLabel).setLabel("hello")
        
        
### 如何增加语言
> 可以在LanguageEnum文件中增加语言枚举，例如：

    enum Language {
        'zh',
        'en',
    }
    
> 同时在resources/i18n.text目录下增加与枚举同名的目录，再在这个目录下增加枚举同名的json文件即可
    
### 如何使用标签多语言
> 只需要在项目完成后，把zh.json翻译成所需要的语言版本即可，注意key必须一样，不能改变，即把key对应的文本翻译成不同语言即可。

    
### cocos creator 版本
  3.x以上

### 使用说明
> [详细说明文档] https://blog.csdn.net/UchihaMadara_2022/article/details/126219095?spm=1001.2014.3001.5502
