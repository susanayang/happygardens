const box = document.getElementById('box');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const shopBtn = document.getElementById('shopBtn');
const shopWindow = document.getElementById('shopWindow');
const closeShopBtn = document.getElementById('closeShopBtn');
const waterBtn = document.getElementById('waterBtn');
// const deleteBtn = document.getElementById('deleteBtn');
const closeEmailBtn = document.getElementById('closeEmailBtn');
const sendEmailBtn = document.getElementById('sendEmailBtn');
const emailWindow = document.getElementById('emailWindow');
const potData = new Map; 

let selectedFlower = null;
let watering = false;
let sendFlowerSrc = null;

document.querySelectorAll('.flower').forEach(flower => {
    flower.addEventListener('click', () => {
        selectedFlower = flower.getAttribute('src');
        watering = false;
        const encodedSrc = encodeURI(selectedFlower);
        document.body.style.cursor = `url(${encodedSrc}) 16 16, auto`;
        shopWindow.style.display = 'none';
    });
});

document.querySelectorAll('.pot').forEach(pot => {
    pot.addEventListener('click', () => {
        const index = pot.dataset.index;
        const wrapper = pot.closest('.pot-wrapper');
        const leaves = wrapper.querySelector('.leaves')

        if (selectedFlower) {
            if (!potData.has(index)) {
                potData.set(index, {flower: selectedFlower, grown: false});
                leaves.style.display = 'block';
                document.body.style.cursor = 'default';
                selectedFlower = null;
            }
        }
        if (watering) {
            const potInfo = potData.get(index);
            if (potData.has(index) && !potInfo.grown) {
                leaves.src = potInfo.flower;
                potInfo.grown = true;
                document.body.style.cursor = 'default';
                watering = false;
                const pickBtn = wrapper.querySelector('.pick-flower-btn');
                pickBtn.style.display = 'block';
            }
        }
    });
});

document.querySelectorAll('.pick-flower-btn').forEach((btn, i) => {
    btn.addEventListener('click', () => {
        const index = i + 1;
        const potInfo = potData.get(index.toString());
        if (potInfo && potInfo.grown) {
            sendFlowerSrc = potInfo.flower;
            document.getElementById('emailWindow').style.display = 'block';
        }
    })
})


fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        box.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});
shopBtn.addEventListener('click', () => {
    shopWindow.style.display = 'block';
})
closeShopBtn.addEventListener('click', () => {
    shopWindow.style.display = 'none'
}) 
waterBtn.addEventListener('click', () => {
    watering = true;
    document.body.style.cursor = 'url("art_assets/water-cursor.cur"), auto';
}) 
closeEmailBtn.addEventListener('click', () => {
    emailWindow.style.display = 'none';
})
sendEmailBtn.addEventListener('click', ()=> {
    const email = document.getElementById('emailInput').value;
    const message = document.getElementById('messageInput').value;

    fetch('/send-flower', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email,
            message,
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log("Email sent successfully")
            emailWindow.style.display = 'none';
        } 
    })
    .catch(error => {
        console.error('Error:', error);
    });
});