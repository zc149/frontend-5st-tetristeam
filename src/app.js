import Blocks from './blocks.js'

const HEIGHT = 20;
const WIDTH = 10;
const DURATION = 100;

let movingBlock = {};
let nextBlocks = [];
let blockInfo = {};
let downInterval;

const stage = document.querySelector('.stage')
const popup = document.getElementById('popup')
const restartButton = document.getElementById('restart')

// 판 만들기
const makeGround = () => {
    let ground = []
    for (let i = 0; i < HEIGHT; i++) {
        ground.push('<tr>')
        for (let j = 0; j < WIDTH; j++) {
            ground.push('<td></td>')
        }
        ground.push('</tr>')
    }
    stage.innerHTML = ground.join('')
}

// 새로운 블럭 만들기
const makeNewBlock = () => {
    const next = nextBlocks.shift()

    clearInterval(downInterval)
    downInterval = setInterval(() => {
        moveBlock('n', 1)
    }, DURATION)

    blockInfo = {
        type: next,
        direction: 0,
        n: 0,
        m: 3
    };
    movingBlock = { ...blockInfo }

    renderBlock()
    checkNextBlock('start')
    makeNextBlock()
}

// 블록 렌더링
const renderBlock = () => {
    const { type, direction, n, m } = movingBlock

    const temp = document.querySelectorAll('.moving')
    temp.forEach((x) => x.classList.remove(type, 'moving'))

    Blocks[type][direction].forEach((block) => {
        const x = block[0] + n
        const y = block[1] + m
        const target = stage.childNodes[x].childNodes[y]
        target.classList.add(type, 'moving')
    })
}

// 다음에올 블럭 랜덤 세팅
const makeNextBlock = () => {
    const blockArray = Object.entries(Blocks)
    const randomIndex = Math.floor(Math.random() * blockArray.length)
    nextBlocks.push(blockArray[randomIndex][0])
}

// 바닿에 닿은 블럭 finish 처리
const finishBlock = () => {
    clearInterval(downInterval)

    const temp = document.querySelectorAll('.moving')
    temp.forEach((block) => {
        block.classList.remove('moving')
        block.classList.add('finish')
    })
    makeNewBlock()
}

// 게임 종료
const finishGame = () => {
    popup.style.display = 'flex'
    clearInterval(downInterval)
}

// 다음에 올 블럭 검사
const checkNextBlock = (where = '') => {
    const { type, direction, n, m } = movingBlock
    let isFinished = false

    Blocks[type][direction].some((block) => {
        const x = block[0] + n
        const y = block[1] + m

        if (x >= HEIGHT) {
            movingBlock = { ...blockInfo }
            isFinished = true
            finishBlock()
            return true
        } else {
            const target = stage.childNodes[x]
                ? stage.childNodes[x].childNodes[y]
                : null
            if (target && target.classList.contains('finish')) {
                isFinished = true
                movingBlock = { ...blockInfo }
                if (where === 'start') {
                    setTimeout(() => {
                        finishGame()
                    }, 0)
                    return true
                } else {
                    finishBlock()
                    return true
                }
            }

        }
    })

    if (where === 'n' && !isFinished) {
        renderBlock();
    }


}

// 다시 시작
const restart = () => {
    popup.style.display = 'none'
    init()
}

// 블럭 이동
const moveBlock = (where, amount) => {
    movingBlock[where] += amount
    checkNextBlock(where)
}

// 초기화
const init = () => {
    makeNextBlock();
    makeGround()
    makeNewBlock()
}

init()

restartButton.addEventListener('click', restart)
