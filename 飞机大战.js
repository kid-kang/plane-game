//主界面盒子
let planeBox = document.getElementById('plane')
  , planeInfo = {
    weak: {
      srcFile: './img/plane_0.png'
    },
    strong: {
      srcFile: './img/plane_1.png'
    },
  }
  , enemyInfo = {
    weak: {
      blood: 2
    },
    strong: {
      blood: 5
    },
  }
  , enemyTime = [800, 600, 400, 250]
  //我机
  , plane = document.getElementsByClassName('plane')
  //敌军
  , enemy = document.getElementsByClassName('enemy')

  //奖励
  , prize = document.getElementsByClassName('prize')
  , score = document.getElementsByClassName('score')
  , arr = [];
for (let i = 0; i < 15; i++) {
  arr[i] = 0;
}
arr[7] = 1;

//新建 初始界面函数 
defaultView();
function defaultView() {
  planeBox.innerHTML = '';
  planeBox.className = '';
  let h1 = document.createElement('h1')
    , pattern = ['简单模式', '一般模式', '困难模式', '炼狱模式']
    , frag = document.createDocumentFragment();

  h1.innerHTML = '康氏飞机大战';
  frag.appendChild(h1);
  pattern.forEach((item, index) => { //通过序号 存模式
    let p = document.createElement('p');
    p.innerHTML = item;
    p.classList.add('option');
    p.addEventListener('click', () => {
      // 开启游戏函数
      startGame(index);
    });
    frag.appendChild(p);
  });

  planeBox.appendChild(frag);

}

function startGame(index) {
  //通过index 去确定 到底难度模式是一层
  //清空界面 
  planeBox.innerHTML = '';
  //记录分数
  planeBox.score = 0;
  //修改背景
  planeBox.classList.add(`bg${index + 1}`);

  //创建我军 函数
  createMyPlane(index);

  //创建敌机 函数 按照间隔时间
  planeBox.eneTimer = setInterval(createEnemy.bind(document, index), enemyTime[index]);



  //分数开启 函数
  scoreCount();


}

function createMyPlane(index) {
  //创建我军 飞机节点 以及图片  
  let plane = document.createElement('div')
    , planeImg = document.createElement('img');

  planeImg.src = planeInfo.weak.srcFile;

  plane.classList.add('plane');
  //储存一下当前的机型
  plane.model = 'weak';
  //默认子弹列数 
  plane.bullet = 1;
  planeBox.appendChild(plane).appendChild(planeImg);

  // 边界确定
  let maxTop = planeBox.clientHeight - plane.clientHeight
    , minLeft = - plane.clientWidth / 2
    , maxLeft = planeBox.clientWidth - plane.clientWidth / 2;

  //确定飞机位置 offsetY 鼠标停留在那个元素上方 返回鼠标在这个元素内的坐标
  plane.style.top = event.clientY - planeBox.offsetTop - plane.clientHeight / 2 + 'px';
  plane.style.left = event.clientX - planeBox.offsetLeft - plane.clientWidth / 2 + 'px';

  // 飞机动起来
  document.addEventListener('mousemove', () => {
    //根据鼠标位置的变化 重新获取飞机的top left
    let nowTop = event.clientY - planeBox.offsetTop - plane.clientHeight / 2
      , nowLeft = event.clientX - planeBox.offsetLeft - plane.clientWidth / 2;

    nowTop = Math.max(0, Math.min(nowTop, maxTop));
    nowLeft = Math.max(minLeft, Math.min(nowLeft, maxLeft));

    plane.style.top = nowTop + 'px';
    plane.style.left = nowLeft + 'px';


    // 判断一下 是否和 福利碰撞 
    for (let i = 0; i < prize.length; i++) {
      if (boomJudge(prize[i], plane)) {//相撞
        // 我军加子弹 列数最多 3 列
        plane.bullet = Math.min(3, ++plane.bullet);
        if (plane.prizeTimer) {
          clearTimeout(plane.prizeTimer);
        }
        if (plane.bullet > 1) {
          plane.prizeTimer = setTimeout(reduce, 5000);
        }

        prize[i].remove();
        //修改机型  修改类名
        plane.model = 'strong';
        planeImg.src = planeInfo[plane.model].srcFile;

      }
    }
    // 1 吃了一个奖励 瞬间 2 开启了一个reduce 
    // 又吃了一个奖励  瞬间 3 上一次reduce不执行了 开启了一个reduce
    // 3  什么都不做 等待 reduce    2 开启一个 reduce 
    function reduce() {//奖励削弱 一段时间后 奖励消失
      plane.bullet = Math.max(1, --plane.bullet);
      //减完只有一列
      if (plane.bullet === 1) {
        plane.model = 'weak';
        planeImg.src = planeInfo[plane.model].srcFile;
      }
      //减完还有两列
      if (plane.bullet === 2) {
        plane.prizeTimer = setTimeout(reduce, 5000);
      }

    }
  });


  //生成子弹 子弹生成频率 子弹的运行速度 依据游戏模式决定
  let bulletTime = [175, 175, 175, 150][index]
    , bulletSpeed = [5.5, 6, 6.5, 7][index];

  plane.timer = setInterval(() => {
    //生成子弹函数 1(子弹函数 运行1次)  2(子弹函数 运行2次)  3(子弹函数 运行3次) 

    for (let i = 0; i < plane.bullet; i++) {
      //判断 几列子弹 是几列子弹中的排名 

      createBullet(i, plane.bullet);
    }

  }, bulletTime);

  function createBullet(i, bullet) {
    let bb = document.createElement('img');
    bb.src = 'img/fire.png';
    bb.classList.add('biu', 'strong2');

    //设置子弹的初始出现的位置
    bb.style.top = plane.offsetTop - 12 + 'px';
    // 子弹总列数:3列  生成第一列 i = 0  生成第二列  i = 1 生成第二列i = 2
    switch (bullet) {
      // 子弹总列数:1列  生成第一列 i = 0
      case 1:
        bb.style.left = plane.offsetLeft + plane.offsetWidth / 2 - 10 + 'px';
        break;
      // 子弹总列数:2列  生成第一列  i = 0 生成第二列  i = 1
      case 2:
        // if (i == 0) {
        //   bb.style.left = plane.offsetLeft + 'px'
        // }else{
        //   bb.style.left = plane.offsetLeft + plane.offsetWidth - 20 + 'px'
        // }
        bb.style.left = [
          plane.offsetLeft,
          plane.offsetLeft + plane.offsetWidth - 20
        ][i] + 'px';
        break;
      // 子弹总列数:3列  生成第一列 i = 0  生成第二列  i = 1 生成第二列i = 2
      case 3:
        bb.style.left = [
          plane.offsetLeft,
          plane.offsetLeft + plane.offsetWidth / 2 - 10,
          plane.offsetLeft + plane.offsetWidth - 20
        ][i] + 'px';
        break;
    }
    planeBox.appendChild(bb);

    bulletRun();
    function bulletRun() {
      bb.style.top = bb.offsetTop - bulletSpeed + 'px';

      if (bb.offsetTop <= 0) {
        //到达顶部 清除子弹
        bb.remove();
      } else {
        //还在运行中

        //检测 子弹是否碰到了敌机  把页面中的敌机全部进来判断一遍
        for (let i = 0; i < enemy.length; i++) {
          //有可能 获取来的敌机 不存在界面了 为了防止报错 如果不存在此敌机 这一次 return
          if (!enemy[i]) continue;
          //判断子弹是否与我相撞
          if (boomJudge(bb, enemy[i])) {
            // 降低敌机的血量  血量清空 敌机爆炸 子弹清除 
            // 子弹威力  清除一格血量 
            enemy[i].blood--;
            // 总血量5  现血量3
            // 总宽度100  现宽度    宽度 = 100 * 3 / 5

            //改血量条
            enemy[i].bloodP.style.width = enemy[i].bloodWrap.clientWidth * enemy[i].blood / enemyInfo[enemy[i].model].blood + 'px';

            // 血量没了
            if (enemy[i].blood <= 0) {
              // 加分 
              if (enemy[i].model === 'weak') {
                // 分数 + 2
                planeBox.score += 2;
              } else {
                // 分数 + 5
                planeBox.score += 5;
              }
              //更新页面中的 分数显示
              score[0].innerHTML = planeBox.score;

              //奖励生不生成
              if (enemy[i].prize) { //取到 1 生成福利 取到0 不生成 
                //触发奖励生成函数 
                createPrize(enemy[i]);

              }
              boom(enemy[i]);
            }

            bb.remove();

          }

        }


        requestAnimationFrame(bulletRun);
      }
    }
  }

}


function createEnemy() {
  // 随机生成 弱机敌机和战斗机敌机 
  let ene = document.createElement('div'),
    bloodWrap = document.createElement('div'),
    bloodP = document.createElement('p'),
    eneImg = document.createElement('img');

  ene.model = ['weak', 'weak', 'strong', 'weak'][randomNum(0, 3)];
  ene.blood = enemyInfo[ene.model].blood;
  ene.bloodWrap = bloodWrap;
  ene.bloodP = bloodP;
  // 概率性 是否有奖励  如果是1 幸运的带buff的敌机 
  ene.prize = arr[randomNum(0, 14)];

  // 挂载类名
  ene.classList.add(ene.model, 'enemy');

  bloodWrap.classList.add('blood');

  eneImg.src = `img/enemy_${ene.model}.png`;
  planeBox.appendChild(ene).appendChild(bloodWrap).appendChild(bloodP);
  ene.appendChild(eneImg);

  //随机left位置  0 ~ 边界值
  ene.style.top = 0;
  ene.style.left = randomNum(0, planeBox.offsetWidth - ene.offsetWidth) + 'px';

  //动起来 方向随机 下落速度 左右移动的速度一定范围内随机
  // 下坠速度 + 水平移动速度(方向不定)
  ene.speedY = randomNum(2, 4);
  ene.speedX = randomNum(0, 2) * [-1, 1][randomNum(0, 1)];
  let nowTop = ene.offsetTop,
    nowLeft = ene.offsetLeft;

  eneRun();
  function eneRun() {
    nowLeft += ene.speedX;
    nowTop += ene.speedY;

    if (nowLeft <= 0 || nowLeft >= planeBox.offsetWidth - ene.offsetWidth) {
      //敌机碰到左边边壁的情况 方向取反
      ene.speedX = -ene.speedX;
    }

    ene.style.top = nowTop + 'px';
    ene.style.left = nowLeft + 'px';

    if (nowTop >= planeBox.offsetHeight - ene.offsetHeight / 2) {
      //到达底部
      ene.remove();
    } else if (plane[0] && boomJudge(plane[0], ene)) {//发生了 我军和敌军的碰撞
      //我军爆炸函数
      boom(plane[0]);
      //敌机爆炸函数
      boom(ene);
      //游戏结束函数
      setTimeout(gameover, 1000);
    } else {
      requestAnimationFrame(eneRun);
    }

  }

}


//判断是否相撞 函数
function boomJudge(ele1, ele2) {
  // 假设 ele1是我军 ele2敌机
  // 我机顶部相撞 我军top a   敌军top+height b   a <= b
  // 我机右翼相撞 我军left + width   敌军 left  a >= b 
  // 我机左翼相撞 我军left   敌军 left + width  a <= b
  // 我机底部相撞 我军top+ height   敌军 top   a >= b
  let left1 = ele1.offsetLeft
    , top1 = ele1.offsetTop
    , right1 = ele1.offsetLeft + ele1.offsetWidth
    , bottom1 = ele1.offsetTop + ele1.offsetHeight

    , left2 = ele2.offsetLeft
    , top2 = ele2.offsetTop
    , right2 = ele2.offsetLeft + ele2.offsetWidth
    , bottom2 = ele2.offsetTop + ele2.offsetHeight;

  // return true 相撞  false 没相撞 

  return top1 <= bottom2 && right1 >= left2 && left1 <= right2 && bottom1 >= top2;

}


function boom(ele) {
  //生成爆炸云 
  let boomImg = document.createElement('img');
  boomImg.classList.add('boom');
  //weak机型 爆炸云 strong机型 爆炸火云  敌机 我机
  // ele.model 
  boomImg.src = "img/boom_" + ele.model + ".png";

  //爆照图的大小
  boomImg.style.cssText = `
        width:${ele.offsetWidth}px;
        height:${ele.offsetHeight}px;
        top:${ele.offsetTop}px;
        left:${ele.offsetLeft}px;
      `;

  planeBox.appendChild(boomImg);

  ele.remove();

  setTimeout(() => {
    boomImg.remove();
  }, 800);
}

function createPrize(enemyPrize) {
  if (prize.length >= 2) return;
  let prizeWrap = document.createElement('div')
    //出现在 炸毁敌军的位置
    , prizeTop = enemyPrize.offsetTop
    , prizeLeft = enemyPrize.offsetLeft;

  prizeWrap.classList.add('prize');
  prizeWrap.style.top = prizeTop + 'px';
  prizeWrap.style.left = prizeLeft + 'px';
  planeBox.appendChild(prizeWrap);

  prizeRun();
  function prizeRun() {
    prizeWrap.style.top = prizeWrap.offsetTop + 3 + 'px';
    if (prizeWrap.offsetTop >= planeBox.offsetHeight - prizeWrap.offsetHeight / 2) {
      //到达底部
      prizeWrap.remove();
    } else {
      requestAnimationFrame(prizeRun);
    }

  }
}

function scoreCount() {
  let score = document.createElement('span');

  score.innerHTML = planeBox.score;

  score.classList.add('score');
  planeBox.appendChild(score);

}

function gameover() {
  planeBox.innerHTML = '';
  clearTimeout(planeBox.eneTimer);
  let scoreWrap = document.createElement('div')
    , scoreP = document.createElement('p')
    , again = document.createElement('div');

  scoreWrap.classList.add('record');
  again.classList.add('btn');
  scoreWrap.innerHTML = '游戏结算分数';
  scoreP.innerHTML = planeBox.score;
  again.innerHTML = '再来一次';

  again.addEventListener('click', () => {
    //回到初始界面
    defaultView();
  });

  planeBox.appendChild(scoreWrap).appendChild(scoreP);

  planeBox.appendChild(again);
}

function randomNum(num1, num2) {
  return Math.floor(Math.random() * (num2 + 1 - num1) + num1);
}

