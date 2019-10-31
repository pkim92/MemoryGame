/* Single global object, holding all game states that needs updating as the game progresses. */
const state = {
    gameInProgress: false,
    row: 5,
    column: 5,
    rowLimit: 8,
    columnLimit: 8,
    numberOfCells: 4,
    numberOfCellsLimit: 4,
    matrixSizeChanged: true,
    initialTimeOut: 1000,
    answerTimeOut: 1500,
    rotateTimeOut: 1000,
    trialTimeOut: 2000,
    transitionTime: 500,
    trialCount: 0,
    trialFinished: false,
    numberOfClickedInTrial: 0,
    numberOfCorrectInTrial: 0,
    numberOfIncorrectInTrial: 0,
    correctCells: [],
    incorrectCells: [],
    score: 0
}

function initialize() {
    if (state.difficultyIncrease) {
        state.numberOfCells += 1
    }
    generateMatrix(state.row, state.column)
    displayAnswerCellsAndRotate(state.initialTimeOut, state.answerTimeOut, state.rotateTimeOut, state.numberOfCells)
}

/* Generates Matrix. */
function generateMatrix(row, column) {
    const root = document.getElementById('root')
    const matrix = document.createElement('div')
    matrix.setAttribute('id', 'matrix')
    matrix.style.width = (row * 54) + "px"
    matrix.style.height = (column * 54) + "px"
    const totalNumberOfCells = row * column

    for (let i = 0; i < totalNumberOfCells; i++) {
        let cellDiv = document.createElement('div')
        cellDiv.setAttribute('class', 'cell')
        let cellInnerDiv = document.createElement('div')
        cellInnerDiv.setAttribute('class', 'cell-inner')
        let cellFrontDiv = document.createElement('div')
        cellFrontDiv.setAttribute('class', 'cell-front')
        let cellBackDiv = document.createElement('div')
        cellBackDiv.setAttribute('class', 'cell-back')
        /* Appends accordingly.*/
        cellInnerDiv.appendChild(cellFrontDiv)
        cellInnerDiv.appendChild(cellBackDiv)
        cellDiv.appendChild(cellInnerDiv)
        matrix.appendChild(cellDiv)
    }
    root.appendChild(matrix)
}

function addEventListeners() {
    let correctList = state.correctCells
    let incorrectList = state.incorrectCells

    correctList.forEach((elem) => {
        elem.addEventListener('click', flipCorrectCell)
    })

    incorrectList.forEach((elem) => {
        elem.addEventListener('click', flipIncorrectCell)
    })

    state.gameInProgress = true
}

function flipCorrectCell() {
    if (state.gameInProgress) {
        this.firstElementChild.children[1].classList.toggle('correct')
        this.firstElementChild.classList.toggle('flip')
        this.removeEventListener("click", flipCorrectCell)
        state.score += 1
        state.numberOfClickedInTrial += 1
        state.numberOfCorrectInTrial += 1
        updateScore()
        if (state.numberOfClickedInTrial == state.correctCells.length) {
            state.trialFinished = true
            checkTrialStatus()
        }
    }
}

function flipIncorrectCell() {
    if (state.gameInProgress) {
        this.firstElementChild.children[1].classList.toggle('incorrect')
        this.firstElementChild.classList.toggle('flip')
        this.removeEventListener("click", flipIncorrectCell)
        state.score -= 1
        state.numberOfClickedInTrial += 1
        state.numberOfIncorrectInTrial += 1
        updateScore()
        if (state.numberOfClickedInTrial == state.correctCells.length) {
            state.trialFinished = true
            checkTrialStatus()
        }
    }
}

function checkTrialStatus() {
    const status = document.getElementById('status')
    /* Perfect Score */
    if (state.numberOfCorrectInTrial == state.correctCells.length) {
        determineDifficulty(true)
        status.innerText = "Nicely done! Perfect!"
        clearState()
        delay(state.trialTimeOut).then(() =>
            prepareAndMoveToNextTrial())
        /* Not a perfect score */
    } else {
        determineDifficulty(false)
        status.innerText = "Good luck next round!"
        clearState()
        delay(state.trialTimeOut).then(() =>
            displayCorrectAnswers()).then(() =>
            delay(state.trialTimeOut).then(() =>
                reset()).then(() =>
                delay(state.transitionTime).then(() =>
                    prepareAndMoveToNextTrial())))
    }
}

function determineDifficulty(perfect) {
    state.matrixSizeChanged = !state.matrixSizeChanged
    
    if (perfect) {
        if (state.matrixSizeChanged) {
            if (state.row < state.column && state.row < state.rowLimit) {
                state.row += 1
            } else if (state.row > state.column && state.column < state.columnLimit) {
                state.column += 1
            } else if (state.row < state.rowLimit) {
                state.row += 1
            }
        } else {
            state.numberOfCells += 1
        }
    } else {
        if (state.matrixSizeChanged) {
            if (state.row > state.column && state.row > 5) {
                state.row -= 1
            } else if (state.row < state.column && state.column > 5) {
                state.column -= 1
            } else if (state.row > 5) {
                state.row -= 1
            }
        } else {
            if (state.numberOfCells > state.numberOfCellsLimit) {
                state.numberOfCells -= 1
            }
        }
    }

}

function prepareAndMoveToNextTrial() {
    let status = document.getElementById('status')
    status.innerText = ""
    triggerTrialTransitionAnimation()
    delay(state.trialTimeOut).then(() => {
        destroyMatrix()
        initialize()
    })
}

function triggerTrialTransitionAnimation() {
    delay(state.transitionTime).then(() =>
        flipAllCells()).then(() =>
        delay(state.transitionTime).then(() =>
            reset(true)))
}

function flipAllCells() {
    let matrix = document.getElementById('matrix')
    let array = Array.from(matrix.children)
    array.forEach((elem) => {
        if (elem.firstElementChild.className.indexOf('correct')) {
            elem.firstElementChild.children[1].classList.remove('correct')
        }
        if (elem.firstElementChild.className.indexOf('incorrect')) {
            elem.firstElementChild.children[1].classList.remove('incorrect')
        }
        elem.firstElementChild.classList.toggle('transition')
    })
}

function displayCorrectAnswers() {
    state.correctCells.forEach((elem) => {
        if (elem.firstElementChild.className.indexOf('flip') == -1) {
            elem.firstElementChild.children[1].classList.toggle('correct')
            elem.firstElementChild.classList.toggle('flip')
        }
    })
}

function destroyMatrix() {
    let root = document.getElementById('root')
    root.removeChild(root.firstElementChild)
}

function reset(transition = false) {
    cells = document.getElementsByClassName('cell')
    Array.from(cells).forEach((elem) => {
        if (elem.firstElementChild.className.indexOf('flip') !== -1) {
            elem.firstElementChild.classList.toggle('flip')
        }
    })
    if (transition) {
        Array.from(cells).forEach((elem) => {
            if (elem.firstElementChild.className.indexOf('transition') !== -1) {
                elem.firstElementChild.classList.toggle('transition')
            }
        })
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getRandomUniqueCells(numberOfCells) {
    let cells = document.getElementsByClassName('cell')
    let shuffledCells = shuffle(Array.from(cells))
    let answerCells = shuffledCells.slice(0, numberOfCells)
    let incorrectCells = shuffledCells.slice(numberOfCells)
    state.correctCells = answerCells
    state.incorrectCells = incorrectCells
}

function initializeTrial(numberOfCells) {
    state.trialCount += 1
    let trial = document.getElementById('trial')
    trial.innerText = "Trial: " + state.trialCount
    getRandomUniqueCells(numberOfCells)
    state.correctCells.forEach((elem) => {
        elem.firstElementChild.classList.toggle('flip')
    })
}

function displayAnswerCellsAndRotate(timeOut, answerTimeOut, rotateTimeOut, numberOfCells) {
    delay(timeOut).then(() =>
        initializeTrial(numberOfCells)).then(() =>
        delay(answerTimeOut).then(() =>
            reset()).then(() =>
            delay(rotateTimeOut).then(() =>
                rotateMatrix()).then(() =>
                delay(rotateTimeOut).then(() =>
                    addEventListeners()))))
}

function rotateMatrix() {
    let matrix = document.getElementById('matrix')
    matrix.classList.add('rotate')
}

function updateScore() {
    let scoreDiv = document.getElementById('score')
    scoreDiv.innerText = "Score: " + state.score
}

function clearState() {
    state.numberOfClickedInTrial = 0
    state.gameInProgress = false
    state.numberOfCorrectInTrial = 0
    state.numberOfInCorrectInTrial = 0

}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function terminate(e) {
    let form = document.getElementById('form')
    e.preventDefault()
    let confirmation = confirm("Do you really want to terminate the current game session?")
    if (confirmation) {
        let scoreSubmit = document.getElementById('scoreSubmit')
        scoreSubmit.value = state.score
        form.submit()
    }
}

function summaryPost(e) {
    let form = document.getElementById('summaryForm')
    e.preventDefault()
    let summaryScore = document.getElementById('summaryScore')
    summaryScore.value = state.score
    form.submit()
}

function retry() {
    window.location.replace('/')
}