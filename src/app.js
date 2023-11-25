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

    blockInfo.n = n
    blockInfo.m = m
    blockInfo.direction = direction
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

        }
        else if (y < 0 || y >= WIDTH) {
            movingBlock = { ...blockInfo }
            renderBlock()
            console.log(blockInfo.n);
            return true
        }

        else {
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

// 블럭 방향 변경
const changeDirection = () => {
    const direction = movingBlock.direction
    if (direction === 3) {
        movingBlock.direction = 0
    }
    else {
        movingBlock.direction += 1
    }
    moveAndTurn();
    renderBlock();
}

// 블럭 방향 변경시 위치 조정
const moveAndTurn = () => {
    if (movingBlock.m < 0) {
        movingBlock.m = 0
    }
    else if (movingBlock.m + 3 >= WIDTH) {
        if (movingBlock.type === 'I') {
            movingBlock.m = 6
        }
        else {
            movingBlock.m = 7
        }
    }
}

// 블록 드랍
const dropBlock = () => {
    clearInterval(downInterval)
    downInterval = setInterval(() => {
        moveBlock('n', 1)
    }, 1)

}

document.addEventListener('keydown', (event) => {

    switch (event.key) {
        case 'ArrowRight':
            moveBlock('m', 1)
            break
        case 'ArrowLeft':
            moveBlock('m', -1)
            break
        case 'ArrowDown':
            moveBlock('n', 1)
            break
        case 'ArrowUp':
            changeDirection()
            break
        case ' ':
            dropBlock()
            break
        default:
            break
    }
})

// 초기화
const init = () => {
    makeNextBlock();
    makeGround()
    makeNewBlock()
}

init()

restartButton.addEventListener('click', restart)



