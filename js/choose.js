const agree = document.getElementById('agree');
const disagree = document.getElementById('disagree');

let d_scale = 1;
let a_scale = 1;
let a_x = 0;

function agree_movement() {
    const rect = agree.getBoundingClientRect();
    const window_x = window.innerWidth / 2;
    const agree_x = rect.left + rect.width / 2;
    return (agree_x - window_x) / 8;
}

disagree.addEventListener('click', () => {
    //d_scale -= 0.05;
    a_scale += 0.5;
    //disagree.style.transform = `scale(${d_scale})`;

    /*if (a_scale >= 5) {
        a_x -= agree_movement();
        agree.style.transform = `scale(${a_scale}) translateX(${a_x}px)`;
        return;
    }*/
    agree.style.transform = `scale(${a_scale})`;
});

agree.addEventListener('click', () => {
    const overlay = document.createElement("div");
    overlay.className = "overlay";

    const text = document.createElement("span");
    text.className = "text";
    text.textContent = "好耶！";

    overlay.appendChild(text);
    document.body.appendChild(overlay);
});