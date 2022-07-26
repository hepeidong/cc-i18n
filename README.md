# cc-i18n
基于cocos creator引擎的游戏开发i18n多语言模块，是在nodejs环境下运行的i18n工具，所以需要确保安装nodejs环境。
该工具可以帮助你自动检测游戏预制体中的cc.Label组件，并生成相应的key存储在json文件中，并把相对应的key设置在
I18nLabel组件中，同时也支持自动给预制体增加I18nLabel组件

## 安装
    搭建nodejs环境，并查看是否有nodejs和npm版本 node --version npm --version，如果以确定安装了相应环境，
    则执行下面命令进行安装：
            npm install  cc-i18n -g
    
## 命令行
 工具通过五个命令可以启动运行：

### cc-i18n create:
        这个命令会在项目的scripts/i18n目录下生成i18n模块代码，同时在resources/i18n生成相应目录结构

### cc-i18n gen-key:
        这个命令是根据预制体Label节点中挂载的I18nLabel组件生成相应的key，并把key保存到一个Json文件中;
        注意：每一个需要自动生成多语言key的label节点，都需要手动挂载I8nLabel组件，如果想自动挂载，请使用
        cc-i18n run-gen-set-key --g 这个命令，但这个命令会在所有label节点上挂载I18nLabel组件，故使用前
        需要考虑清楚是不是所有label节点都是静态文本。
        

### cc-i18n set-key:
        这个命令会检查挂有cc.Label组件的这些节点是否有挂载I18nLabel组件，如果有，则把相应的key设置到组件上

### cc-i18n run-gen-set-key:
        这个命令是根据预制体节点中挂载的cc.Label组件生成相应的key，并把key保存到一个Json文件中，然后再检
        查挂有cc.Label组件的这些节点是否有挂载I18nLabel组件，如果有，则把相应的key设置到组件上

### cc-i18n run-gen-set-key --g:
        这个命令是根据预制体节点中挂载的cc.Label组件生成相应的key，并把key保存到一个Json文件中，然后再在挂载了
        cc.Label组件的节点上增加I18nLabel组件，并把相应的key设置到组件上（这个功能在大项目中可能会存在问题）
    
## 功能使用

### 初始化
        使用时，需要在游戏项目的根目录运行上面所介绍的功能命令，例如TestGame项目在D:\proj\TestGame，那么需要进入
        当前这个项目的根目录也就是D:\proj\TestGame目录下工作，第一次在该项目使用时，需要先运行cc-i18n create
        此命令是初始化一些配置信息，以及把相关的代码文件和目录拷贝和创建到游戏项目的assets目录下。

### 静态文本
        对于静态文本，需要开发者自行在挂在了cc.Label组件的节点上挂在I18nLabel组件，或者可以使用
        cc-i18n run-gen-set-key --g 自动给相应节点挂在I18nLabel组件，需要注意这个命令会给所有挂载了cc.Label组件
        的节点自动挂载I18nLabel组件，故需要考虑是否所有label节点都是静态文本。
    
### 动态文本
        对于动态文本，可以通过调用 I18nManager.getInstance().getText()接口去获取相应的文本，该接口通过传入的key获取
        json文件中的内容，开发者可以事先在相应的json文件中增加对应的键值对，例如在zh.json文件增加 "hello": "你好"，
        则在代码中可以通过 I18nManager.getInstance().getText("hello") 获取对应语言文件的 "hello" 对应的文本内容。
        动态文本还支持动态替换json中设定的文本内容，例如zh.json文件中 "hello": "你好{0}"，那么使用时可以通过
        I18nManager.getInstance().getText("hello", "i18n工具")，那么返回的字符串就是 "你好i18n工具"，也可以在
        I18nLabel组件上面的 params 属性增加相应的文本内容用于替换{0}，需要注意，文本中有多少个{}，params 参数就可以传多少个
        用于替换，而且有{}必须严格按照{0}，{1}，{2}...以此类推，{}里面必须带有当前第几个的数字，从0开始。
        
## 如何增加语言
        可以在LanguageEnum文件中增加语言枚举，例如：
        enum Language {
            'zh',
            'en',
        }
        同时在resources/i18n.text目录下增加与枚举同名的json文件即可
    
## 如何使用变成多语言
        只需要在项目完成后，把zh.json翻译成所需要的语言版本即可，注意key必须一样，不能改变，即把key对应的文本翻译成不同语言即可。
    
## cocos creator 版本
  3.x以上

## 后续将逐步完善对于sprite的多语言支持，敬请期待
