// 获取页面元素
const input = document.getElementById("input");
const result = document.querySelector(".result");
const list = document.querySelector(".list");
const historyTextarea = document.querySelector(".history");
const resultTextArea = document.querySelector("#result");
const startBtn = document.querySelector("#startBtn");
const stopBtn = document.querySelector("#stopBtn");
const resetBtn = document.querySelector("#reset");
const defaultArray = ["剑魂", "鬼泣", "狂战士", "阿修罗", "剑影", "驭剑士", "契魔者", "流浪武士", "暗殿骑士", "刃影", "男气功", "男散打", "男街霸", "男柔道", "女气功", "女散打", "女街霸", "女柔道", "合金战士", "男漫游", "男枪炮", "男机械", "男弹药", "女漫游", "女枪炮", "女机械", "女弹药", "元素爆破师", "冰结师", "血法师", "逐风者", "次元行者", "元素师", "召唤师", "战斗法师", "魔道学者", "小魔女", "男圣骑士", "蓝拳圣使", "驱魔师", "复仇者", "女圣骑士", "异端审判者", "巫女", "诱魔者", "刺客", "死灵术士", "忍者", "影舞者", "精灵骑士", "混沌魔灵", "帕拉丁", "龙骑士", "征战者", "决战者", "狩猎者", "暗骑士", "特工", "战线佣兵", "暗刃", "源能专家", "黑暗武士", "缔造者"]
// 初始化候选项数组、定时器 ID 和开始时间
var candidates = [];
var used = [];
var timerId = null;
var startTime = null;
stopBtn.disabled = true;

window.onload = function () {
  localforage.getItem('used').then(function (value) {
    console.log(value); // 打印获取到的候选项数组
    if (value == null || value.length == 0) {
      return
    }
    used = value
    value.forEach(element => {
      historyTextarea.value = historyTextarea.value != "" ? historyTextarea.value + "\n" + element : element;
    });
  }).catch(function (err) {
    console.log(err); // 处理可能出现的错误
  });
}

resultTextArea.addEventListener("blur", function () {
  if (this.value === "") {
    this.placeholder = "这是抽取过的";
  }
});

function show() {
  startBtn.disabled = true;
  stopBtn.disabled = false;
  resetBtn.disabled = true
  // 记录开始时间
  startTime = new Date().getTime();

  if (historyTextarea.value != "") {
    used = historyTextarea.value.split("\n")
    candidates = candidates.filter(function (item) {
      return !used.includes(item);
    });
  }
  // 开始定时器，每隔 50 毫秒更新页面上的候选项
  timerId = setInterval(() => {
    const index = Math.floor(Math.random() * (candidates.length - 1));
    // 显示正在滚动的候选项
    result.innerHTML = candidates[index];
    console.log(candidates[index])
  }, 50);
}

// 开始抽奖
function start() {
  // 获取输入框中的字符串并去掉空格
  const str = input.value.trim();
  // 判断是否为空
  if (str === "" && candidates.length == 0) {
    localforage.getItem('candidates').then(function (value) {
      console.log(value); // 打印获取到的候选项数组
      if (value == null || value.length == 0) {
        candidates = defaultArray;
      } else {
        candidates = value;
      }
      show()
    }).catch(function (err) {
      console.log(err); // 处理可能出现的错误
    });

  }
  else {
    // 以空格分割字符串并添加到候选项数组
    candidates = candidates.concat(str.split(" "));
    show()
  }

}

// 停止抽奖
function stop() {
  startBtn.disabled = false;
  stopBtn.disabled = true;
  resetBtn.disabled = false
  // 清除定时器
  clearInterval(timerId);
  used.push(result.innerHTML)
  // 显示抽奖结果
  historyTextarea.value = historyTextarea.value != "" ? historyTextarea.value + "\n" + result.innerHTML : result.innerHTML;
  var indexOfItem = candidates.indexOf(result.innerHTML);
  console.log(indexOfItem)
  if (indexOfItem !== -1) {
    // 在数组中找到了元素，现在可以从数组中删除它
    candidates.splice(indexOfItem, 1);
  }
  result.innerHTML = `决定就是你了： ${result.innerHTML} ！`;
  // 清空定时器 ID 和候选项数组
  timerId = null;
  candidates = candidates.filter(function (item) {
    return item !== "";
  });
  used = used.filter(function (item) {
    return item !== "";
  });
  localforage.setItem('candidates', candidates)
  localforage.setItem('used', used)
  if (candidates.length == 0){
    alert("所有选项都选择过了！点击确定后会自动重置！")
    reset()
  }
}
function reset() {
  candidates = []
  used = []
  startBtn.disabled = false;
  stopBtn.disabled = true;
  resetBtn.disabled = false;
  historyTextarea.value = ""
  resultTextArea.value = ""
  result.innerHTML = ""
  localforage.setItem('candidates', candidates)
  localforage.setItem('used', used)
}
