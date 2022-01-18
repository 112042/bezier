//畫布的初始設計
var canvas = document.getElementById('canvas'); //一般畫布宣告的方式
var ctx = canvas.getContext('2d');    //做2d圖

//針對貝茲曲線的函式繪圖做宣告
var t = 0;            //貝茲函數的參數式，0<=t<=1
var clickNodes = [];  //滑鼠點選的位置
var bezierNodes = [];  //貝茲取線內的點數控制
var isPrinted = false;  //判定當前是否有曲線
var isPrinting = false;  //是否正在繪製

//真對滑鼠的行為做控制
var num = 0; //控制點數
var isDrag = false; //拖拽的控制
var isDragNode = false; //判定是否有碰到控制點
var dragIndex = 0; //被拖拽的點索引
var clickon = 0 ;//滑鼠按下的時間
var clickoff = 0 ;//放開滑鼠

//對滑鼠的行為操作使用jquery
$(canvas).mousedown(function(e){      //按下滑鼠要做的事
    isDrag = true;    
    clickon = new Date().getTime()            //按下時的時間
    var diffLeft = $(this).offset().left,     //到螢幕左邊的距離
        diffTop = $(this).offset().top,       //到頂點的距離
        clientX = e.clientX,                  //滑鼠按到的x點的座標(含距離)
        clientY = e.clientY,                  //滑鼠按到的y點的座標(含距離)
        x = clientX - diffLeft,               //抓取x的座標
        y = clientY - diffTop                 //抓取y的座標

    clickNodes.forEach(function(item, index) {     //讀取按下每個點      
        var absX = Math.abs(item.x - x),          //計算絕對值x的距離
            absY = Math.abs(item.y - y)           //計算絕對值y的距離
        if(absX < 5 && absY < 5) {                         
            isDragNode = true
            dragIndex = index
        }
    })

}).mousemove(function(e) {                          //移動的處理方式
    if(isDrag && isDragNode) {
        var diffLeft = $(this).offset().left,
        diffTop = $(this).offset().top,
        clientX = e.clientX,
        clientY = e.clientY,
        x = clientX - diffLeft,
        y = clientY - diffTop
        clickNodes[dragIndex] = {
            x: x,
            y: y
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height)       //清除


        
    }

}).mouseup(function(e) {    //鬆開處理的方式
    isDrag = false
    isDragNode = false
    clickoff = new Date().getTime()
})

//繪製鈕的處理
$('#print').click(function() {   
    if(!num) return
    if(!isPrinting) {
        isPrinted = true
        drawBezier(ctx, clickNodes)
    }
})

//清除扭的處理
$('#clear').click(function() {   
    if(!isPrinting) {
        isPrinted = false
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        clickNodes = []
        bezierNodes = []
        t = 0
        num = 0
    }
})


//bezier的處理
function drawBezier(ctx, origin_nodes) {        //匯出曲線
    if(t > 1) {
        isPrinting = false
        return
    }
    isPrinting = true
    var nodes = origin_nodes
    t += 0.01
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawnode(nodes)
    window.requestAnimationFrame(drawBezier.bind(this, ctx, nodes))
}


function drawnode(nodes) {
    if(!nodes.length) return
    var _nodes = nodes
    var next_nodes = []
    _nodes.forEach(function(item, index) {
        var x = item.x,
            y = item.y    
        if(_nodes.length === num) {
            ctx.font = "16px Microsoft YaHei"
            var i = parseInt(index, 10) + 1
            ctx.fillText("p" + i, x, y + 20)
            ctx.fillText("p" + i + ': ('+ x +', '+ y +')', 10, i * 20)
        }
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2, false)
        ctx.fill()
    })  
    if(_nodes.length) {
        for(var i = 0; i < _nodes.length - 1; i++) {
            var arr = [{
                x: _nodes[i].x,
                y: _nodes[i].y
            }, {
                x: _nodes[i + 1].x,
                y: _nodes[i + 1].y 
            }]
            next_nodes.push(bezier(arr, t))
        }
        drawnode(next_nodes)
    }

}

function factorial(num) { //遞迴階層
    if (num <= 1) {
        return 1;
    } else {
        return num * factorial(num - 1);
    }
}

function bezier(arr, t) {    //通過各控制點與  //貝茲的公式
    var x = 0,
        y = 0,
        n = arr.length - 1
    arr.forEach(function(item, index) {
        if(!index) {
            x += item.x * Math.pow(( 1 - t ), n - index) * Math.pow(t, index) 
            y += item.y * Math.pow(( 1 - t ), n - index) * Math.pow(t, index) 
        } else {
            x += factorial(n) / factorial(index) / factorial(n - index) * item.x * Math.pow(( 1 - t ), n - index) * Math.pow(t, index) 
            y += factorial(n) / factorial(index) / factorial(n - index) * item.y * Math.pow(( 1 - t ), n - index) * Math.pow(t, index) 
        }
    })
    return {
        x: x,
        y: y
    }
}

