const score=document.querySelector('.Score'); /*JavaScript tìm kiếm phần
tử HTML đầu tiên trong tài liệu có class là 'Score', và lưu nó vào một biến const tên là score.
*/
const startscreen=document.querySelector('.StartScreen');
const gamearea=document.querySelector('.GameArea');
let player={ speed:5,score:0}; /* tốc độ ban đầu là 5, điểm ban đầu là 0*/
let highest=0;
document.getElementById("reset").addEventListener('click', Reset); /*document.getElementById("reset"):
 Truy cập phần tử HTML có ID là "reset".
addEventListener('click', Reset): Thêm một sự kiện click vào phần tử này.
Khi phần tử được click, hàm Reset() sẽ được gọi.*/
document.getElementById("start").addEventListener('click', start);

// Hiện cảnh báo khi bắt đầu chơi
document.querySelector('.warning').style.visibility = 'visible'; /*Tìm phần tử HTML đầu tiên
trong tài liệu với class 'warning'. Nếu có nhiều phần tử với class này, chỉ có phần tử đầu tiên được chọn.
.style.visibility = 'visible': Thao tác này thay đổi trạng thái visibility của phần tử đã được chọn.
Khi đặt giá trị là 'visible', phần tử sẽ hiển thị.*/

let keys={ArrowUp: false, ArrowDown: false, ArrowRight: false, ArrowLeft: false}; /* Thuộc tính bàn phím
chưa nhấn là false, được nhấn là True*/

document.addEventListener('keydown',keyDown); /*Thêm sự kiện 'keydown' vào tài liệu.
 Sự kiện 'keydown' được kích hoạt khi một phím trên bàn phím được nhấn xuống.
 Khi sự kiện này xảy ra, nó sẽ gọi đến hàm keyDown()*/
document.addEventListener('keyup',keyUp);
function keyDown(ev){ /* Các sự kiện nhấn phím, nhấn phím mũi tên xuống*/
    ev.preventDefault();
    keys[ev.key]=true;
}
function keyUp(ev){
    ev.preventDefault();
    keys[ev.key]=false;

}
function isCollide(a,b){ /*Hàm kiểm tra xe va chạm*/
    aRect=a.getBoundingClientRect(); /*Lấy thông tin, vị trí, kích thước của đối tượng a
    thông qua phương thức getBoundingClientRect(). Kết quả trả về là một đối tượng chứa
    thông tin gồm top, right, bottom, left, width, và height của đối tượng*/
    bRect=b.getBoundingClientRect();
    return !((aRect.bottom<bRect.top)||(aRect.top>bRect.bottom)||(aRect.right<bRect.left)||(aRect.left>bRect.right));
    // phép kiểm tra va chạm. //
    /* Đáy của a không nằm trên đỉnh của b.
    Đỉnh của a không nằm dưới đáy của b.
    Cạnh phải của a không nằm bên trái của b.
    Cạnh trái của a không nằm bên phải của b.*/
}
function moveLines(){ /*Hàm di chuyển các đường kẻ*/
    let lines=document.querySelectorAll('.lines');
    lines.forEach(function(item){
        if(item.y>=700){ /*Hiệu ứng chuyển động theo chiều y*/
            item.y-=750;
        }
        item.y+=player.speed; /*tăng vị trí của 'item' theo tốc độ (speed) của 'player'.*/
        item.style.top=item.y+'px'; /*cập nhật vị trí theo chiều dọc của 'item' trên trang web,
        theo đơn vị pixel.*/

    })
}
function endGame(){
    player.start=false; /*Ngừng chuyển động trò chơi*/
    startscreen.classList.remove('hide'); /*ẩn start screen khi trò chơi bắt đầu.
     Khi trò chơi kết thúc, start screen được hiển thị lại bằng cách loại bỏ class 'hide'.*/
    // Xóa tất cả các xe trên màn hình
    let otherCars = document.querySelectorAll('.other');
    otherCars.forEach(function(car) {
        car.remove();
    });
    alert("Bạn đã thua!\nSố điểm bạn đạt được là: " + player.score);    // Thêm thông báo người chơi thua và số điểm
}
let carsPassed = 0;  // Khởi tạo biến để theo dõi số lượng xe vượt qua
function moveCar(car){
    let other=document.querySelectorAll('.other'); /*Các xe khác trên đường*/
    other.forEach(function(item){ /*Lặp qua mỗi xe*/
        if(isCollide(car,item)){ /*Kiểm tra xem xe của người chơi có va chạm với các xe khác không*/
            console.log('HIT'); /* Có va chạm se ghi vào bảng điều khiển */
            endGame(); /*và kết thúc trò chơi*/
        }
        if(item.y>=750){ /*Khoảng các theo chiều dọc để xuất hiện các xe*/
            item.y=-300;
            item.style.left=Math.floor(Math.random()*350) + 'px'; /*Xuất hiện ngẫu nhiên*/
            carsPassed++;  // Tăng số lượng xe vượt qua
            player.speed = 6 + Math.floor(carsPassed / 10);  // Tăng tốc độ dựa vào số lượng xe vượt qua
        }
        /*Hiệu ứng di chuyển xe trên màn hình*/
        item.y+=player.speed; /*vị trí hiện tại cua xe theo chiều dọc*/
        item.style.top=item.y+'px'; /*Cập nhật lại vị trí trên màn hình*/

    })
}

function gamePlay(){

    let car=document.querySelector('.car');
    let road=gamearea.getBoundingClientRect();

    if(player.start){

        moveLines();
        moveCar(car);
        if(keys.ArrowUp && player.y>(road.top+70)){
            player.y-=player.speed;
        }
        if(keys.ArrowDown && player.y<(road.bottom-70)){
            player.y+=player.speed;
        }
        if(keys.ArrowLeft && player.x>0){
            player.x-=player.speed;
        }
        if(keys.ArrowRight && player.x<(road.width-50)){
            player.x+=player.speed;
        }

        car.style.top=player.y + 'px';
        car.style.left=player.x + 'px';

        window.requestAnimationFrame(gamePlay);
        //console.log(player.score++);
        player.score++;
        if(player.score>=highest)
        {
            highest=player.score;
        }
        score.innerHTML="Điểm:"+ player.score+"<br><br>"+"Điểm cao nhất:"+highest;


    }

}
function Reset(){
    player.score = 0;
    highest=0;
    score.innerHTML = "Điểm:" + player.score + "<br><br>" + "Điểm cao nhất:" + highest;
}

function start(){

    startscreen.classList.add('hide');
    gamearea.innerHTML="";
    player.start = true;
    player.speed = 6;    //khi nhấn nút start thì tốc độ sẽ trở về tốc độ ban đâù
    player.score = 0;
    carsPassed = 0;
    window.requestAnimationFrame(gamePlay);

    for(x=0;x<5;x++){
        let roadline=document.createElement('div');
        roadline.setAttribute('class','lines');
        roadline.y=(x*150);
        roadline.style.top=roadline.y+'px';
        gamearea.appendChild(roadline);
    }

    let car=document.createElement('div');
    car.setAttribute('class','car');
    gamearea.appendChild(car);

    player.x=car.offsetLeft;
    player.y=car.offsetTop;


    let carImages = ['Images/car.jpg', 'Images/car4.jpg', 'Images/car3.jpg']; //các chứng ngại vật

    for(x=0; x<3; x++){
        let othercar = document.createElement('div');
        othercar.setAttribute('class','other');
        othercar.style.backgroundImage = "url('" + carImages[x] + "')";
        othercar.y=((x+1)*350)* -1;
        othercar.style.top = othercar.y+'px';
        othercar.style.left = Math.floor(Math.random()*350) + 'px';
        gamearea.appendChild(othercar);
    }
}