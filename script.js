const nextBlockBricksEl = document.querySelector("#next-block-bricks");
const nextBlockSvg = document.querySelector(".next-block-svg");

if (nextBlockBricksEl && nextBlockSvg) {
  const brickSources = [
    "images/кирпичик1.png",
    "images/кирпичик3.png",
    "images/кирпичик5.png",
    "images/кирпичик7.png",
    "images/кирпичик9.png",
    "images/кирпичик11.png",
    "images/кирпичик10.png",
    "images/кирпичик8.png",
    "images/кирпичик6.png",
    "images/кирпичик4.png",
    "images/кирпичик2.png",
  ];

  const parsePoints = (pointsString) => {
    const values = pointsString
      .trim()
      .split(/\s+/)
      .map(Number)
      .filter((value) => Number.isFinite(value));

    const points = [];
    for (let i = 0; i < values.length; i += 2) {
      points.push([values[i], values[i + 1]]);
    }
    return points.filter(([x, y]) => Number.isFinite(x) && Number.isFinite(y));
  };

  const renderBrickPath = () => {
    nextBlockBricksEl.innerHTML = "";
    const polylines = [...nextBlockSvg.querySelectorAll("polyline")];
    let brickIndex = 0;
    const step = 30;

    polylines.forEach((polyline, polylineIndex) => {
      const points = parsePoints(polyline.getAttribute("points") || "");

      for (let i = 1; i < points.length; i += 1) {
        const [x1, y1] = points[i - 1];
        const [x2, y2] = points[i];
        const dx = x2 - x1;
        const dy = y2 - y1;
        const length = Math.hypot(dx, dy);

        if (!length) {
          continue;
        }

        const segments = Math.max(1, Math.round(length / step));
        const angle = Math.abs(dx) >= Math.abs(dy) ? 90 : 0;

        for (let j = 0; j <= segments; j += 1) {
          if (polylineIndex > 0 && i === 1 && j === 0) {
            continue;
          }
          if (i > 1 && j === 0) {
            continue;
          }

          const t = j / segments;
          const x = x1 + dx * t;
          const y = y1 + dy * t;
          const img = document.createElement("img");
          img.src = brickSources[brickIndex % brickSources.length];
          img.alt = "";
          img.className = "next-path-brick";
          img.setAttribute("aria-hidden", "true");
          img.style.left = `${x / 10}%`;
          img.style.top = `${y / 8.6}%`;
          img.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
          img.style.outline = "3px solid rgba(82, 255, 136, 0.95)";
          img.style.outlineOffset = "2px";
          img.style.background = "rgba(82, 255, 136, 0.12)";
          img.style.filter =
            "brightness(1.08) saturate(1.08) drop-shadow(0 0 8px rgba(82, 255, 136, 0.95))";
          nextBlockBricksEl.appendChild(img);
          brickIndex += 1;
        }
      }
    });
  };

  renderBrickPath();
  window.addEventListener("resize", renderBrickPath);
}

const boardEl = document.querySelector("#match3-board");
const statusEl = document.querySelector("#match3-status");
const movesEl = document.querySelector("#match3-moves");
const scoreEl = document.querySelector("#match3-score");

if (boardEl && statusEl && movesEl && scoreEl) {
  const size = 4;
  const hammerGoal = 15;
  const maxMoves = 12;
  const items = [
    { type: "sword", src: "images/меч.png", alt: "Меч" },
    { type: "bow", src: "images/лук.png", alt: "Лук" },
    { type: "hammer", src: "images/молоток.png", alt: "Молот" },
  ];
  const frameSets = [
    {
      corner: "images/кирпичик10.png",
      top: [
        "images/кирпичик11.png",
        "images/кирпичик1.png",
        "images/кирпичик3.png",
        "images/кирпичик5.png",
        "images/кирпичик7.png",
        "images/кирпичик9.png",
        "images/кирпичик10.png",
        "images/кирпичик8.png",
      ],
      side: [
        "images/кирпичик11.png",
        "images/кирпичик3.png",
        "images/кирпичик5.png",
        "images/кирпичик7.png",
        "images/кирпичик11.png",
      ],
    },
    {
      corner: "images/кирпичик8.png",
      top: [
        "images/кирпичик10.png",
        "images/кирпичик9.png",
        "images/кирпичик7.png",
        "images/кирпичик5.png",
        "images/кирпичик3.png",
        "images/кирпичик1.png",
        "images/кирпичик11.png",
        "images/кирпичик6.png",
      ],
      side: [
        "images/кирпичик10.png",
        "images/кирпичик8.png",
        "images/кирпичик4.png",
        "images/кирпичик2.png",
        "images/кирпичик5.png",
      ],
    },
    {
      corner: "images/кирпичик9.png",
      top: [
        "images/кирпичик8.png",
        "images/кирпичик6.png",
        "images/кирпичик4.png",
        "images/кирпичик2.png",
        "images/кирпичик10.png",
        "images/кирпичик11.png",
        "images/кирпичик9.png",
        "images/кирпичик5.png",
      ],
      side: [
        "images/кирпичик9.png",
        "images/кирпичик7.png",
        "images/кирпичик3.png",
        "images/кирпичик1.png",
        "images/кирпичик4.png",
      ],
    },
    {
      corner: "images/кирпичик2.png",
      top: [
        "images/кирпичик6.png",
        "images/кирпичик11.png",
        "images/кирпичик8.png",
        "images/кирпичик4.png",
        "images/кирпичик1.png",
        "images/кирпичик3.png",
        "images/кирпичик5.png",
        "images/кирпичик9.png",
      ],
      side: [
        "images/кирпичик6.png",
        "images/кирпичик10.png",
        "images/кирпичик11.png",
        "images/кирпичик9.png",
        "images/кирпичик5.png",
      ],
    },
  ];

  let board = [];
  let selectedIndex = null;
  let lockBoard = false;
  let movesLeft = maxMoves;
  let hammersCollected = 0;

  const randomItem = () => {
    const item = items[Math.floor(Math.random() * items.length)];
    return { ...item };
  };

  const updateHud = () => {
    movesEl.textContent = String(movesLeft);
    scoreEl.textContent = String(hammersCollected);
  };

  const createBrick = (src, className) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = "";
    img.className = className;
    img.setAttribute("aria-hidden", "true");
    return img;
  };

  const appendCellFrame = (button, variant) => {
    const frame = frameSets[variant];

    const corners = [
      ["cell-corner corner-tl", frame.corner],
      ["cell-corner corner-tr", frame.corner],
      ["cell-corner corner-bl", frame.corner],
      ["cell-corner corner-br", frame.corner],
    ];

    corners.forEach(([className, src]) => {
      button.appendChild(createBrick(src, className));
    });

    const top = document.createElement("div");
    top.className = "cell-strip strip-top";
    frame.top.forEach((src) => top.appendChild(createBrick(src, "cell-brick brick-top")));

    const bottom = document.createElement("div");
    bottom.className = "cell-strip strip-bottom";
    [...frame.top].reverse().forEach((src) => bottom.appendChild(createBrick(src, "cell-brick brick-bottom")));

    const left = document.createElement("div");
    left.className = "cell-strip strip-left";
    frame.side.forEach((src) => left.appendChild(createBrick(src, "cell-brick brick-side")));

    const right = document.createElement("div");
    right.className = "cell-strip strip-right";
    [...frame.side].reverse().forEach((src) => right.appendChild(createBrick(src, "cell-brick brick-side brick-side-right")));

    button.appendChild(top);
    button.appendChild(bottom);
    button.appendChild(left);
    button.appendChild(right);
  };

  const areAdjacent = (a, b) => {
    const rowA = Math.floor(a / size);
    const colA = a % size;
    const rowB = Math.floor(b / size);
    const colB = b % size;
    return Math.abs(rowA - rowB) + Math.abs(colA - colB) === 1;
  };

  const collectMatches = () => {
    const matched = new Set();

    for (let row = 0; row < size; row += 1) {
      for (let col = 0; col < size - 2; col += 1) {
        const start = row * size + col;
        const a = board[start];
        const b = board[start + 1];
        const c = board[start + 2];

        if (a && b && c && a.type === b.type && b.type === c.type) {
          matched.add(start);
          matched.add(start + 1);
          matched.add(start + 2);
        }
      }
    }

    for (let col = 0; col < size; col += 1) {
      for (let row = 0; row < size - 2; row += 1) {
        const start = row * size + col;
        const a = board[start];
        const b = board[start + size];
        const c = board[start + size * 2];

        if (a && b && c && a.type === b.type && b.type === c.type) {
          matched.add(start);
          matched.add(start + size);
          matched.add(start + size * 2);
        }
      }
    }

    return [...matched];
  };

  const refillBoard = () => {
    for (let col = 0; col < size; col += 1) {
      const stack = [];

      for (let row = size - 1; row >= 0; row -= 1) {
        const index = row * size + col;
        if (board[index]) {
          stack.push(board[index]);
        }
      }

      for (let row = size - 1; row >= 0; row -= 1) {
        const index = row * size + col;
        board[index] = stack[size - 1 - row] || randomItem();
      }
    }
  };

  const render = () => {
    boardEl.innerHTML = "";

    board.forEach((item, index) => {
      const button = document.createElement("button");
      const variant = index % 4;
      button.className = "match3-cell";
      button.classList.add(`variant-${variant}`);
      button.type = "button";
      button.disabled = lockBoard || movesLeft <= 0 || hammersCollected >= hammerGoal;
      appendCellFrame(button, variant);

      if (selectedIndex === index) {
        button.classList.add("is-selected");
      }

      if (item) {
        const img = document.createElement("img");
        img.src = item.src;
        img.alt = item.alt;
        img.className = "match3-item";
        button.appendChild(img);
      } else {
        button.classList.add("is-empty");
      }

      button.addEventListener("click", () => handleCellClick(index));
      boardEl.appendChild(button);
    });
  };

  const finishIfNeeded = () => {
    if (hammersCollected >= hammerGoal) {
      statusEl.textContent = "Победа! Ты собрал нужное количество молотков.";
      lockBoard = true;
      render();
      return true;
    }

    if (movesLeft <= 0) {
      statusEl.textContent = "Ходы закончились. Попробуй ещё раз.";
      lockBoard = true;
      render();
      return true;
    }

    return false;
  };

  const resolveMatches = async () => {
    let matches = collectMatches();

    while (matches.length) {
      const hammerMatches = matches.filter((index) => board[index] && board[index].type === "hammer").length;
      hammersCollected = Math.min(hammerGoal, hammersCollected + hammerMatches);
      updateHud();

      matches.forEach((index) => {
        board[index] = null;
      });

      render();
      statusEl.textContent = hammerMatches
        ? `Совпадение: +${hammerMatches} молотков.`
        : `Совпадение: ${matches.length} клеток.`;

      await new Promise((resolve) => window.setTimeout(resolve, 180));
      refillBoard();
      render();

      if (hammersCollected >= hammerGoal) {
        finishIfNeeded();
        return;
      }

      matches = collectMatches();
    }
  };

  const swapItems = (a, b) => {
    [board[a], board[b]] = [board[b], board[a]];
  };

  const handleCellClick = async (index) => {
    if (lockBoard || finishIfNeeded()) {
      return;
    }

    if (selectedIndex === null) {
      selectedIndex = index;
      statusEl.textContent = "Выбери соседнюю клетку.";
      render();
      return;
    }

    if (selectedIndex === index) {
      selectedIndex = null;
      statusEl.textContent = "Нажми на 2 соседние клетки, чтобы поменять их местами.";
      render();
      return;
    }

    if (!areAdjacent(selectedIndex, index)) {
      selectedIndex = index;
      statusEl.textContent = "Можно менять только соседние клетки.";
      render();
      return;
    }

    lockBoard = true;
    const previousSelected = selectedIndex;
    selectedIndex = null;

    swapItems(previousSelected, index);
    render();

    if (!collectMatches().length) {
      swapItems(previousSelected, index);
      lockBoard = false;
      render();
      statusEl.textContent = "Совпадения нет. Попробуй другой ход.";
      return;
    }

    movesLeft -= 1;
    updateHud();
    await resolveMatches();

    if (!finishIfNeeded()) {
      statusEl.textContent = `Хороший ход. Осталось ходов: ${movesLeft}.`;
      lockBoard = false;
      render();
    }
  };

  const buildBoard = () => {
    board = Array.from({ length: size * size }, () => randomItem());

    while (collectMatches().length) {
      board = Array.from({ length: size * size }, () => randomItem());
    }

    updateHud();
    render();
  };

  buildBoard();
}

const screen1El = document.querySelector(".screen1");
const screen2El = document.querySelector(".screen2");

const getSectionVisibility = (element) => {
  if (!element) return 0;
  const rect = element.getBoundingClientRect();
  if (!rect.width || !rect.height) return 0;

  const visibleWidth = Math.max(0, Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0));
  const visibleHeight = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
  return (visibleWidth * visibleHeight) / (rect.width * rect.height);
};

const isSceneActive = (element, competitors = []) => {
  const score = getSectionVisibility(element);
  if (score < 0.12) return false;
  return competitors.every((candidate) => score >= getSectionVisibility(candidate));
};

const heroEl = document.querySelector(".hero");
const monsterEl = document.querySelector(".monster");
const heroScoreEl = document.querySelector("#battle-hero-score");
const monsterScoreEl = document.querySelector("#battle-monster-score");
const battleStatusEl = document.querySelector("#battle-status");
const battleStartEl = document.querySelector("#battle-start");
if (heroEl && monsterEl && heroScoreEl && monsterScoreEl && battleStatusEl && battleStartEl) {
  const startState = {
    heroX: 0,
    heroY: 0,
    monsterX: 0,
    monsterY: 0,
    heroHits: 0,
    monsterHits: 0,
  };

  const state = { ...startState };
  const pressedKeys = new Set();
  let battleStarted = false;
  let battleLocked = false;
  let jumpTimer = 0;
  let heroAttackTimer = 0;
  let monsterAttackTimer = 0;
  let monsterTouchCooldown = 0;
  let battleLoop = 0;
  let patrolDirection = -1;
  let lungeFrames = 0;

  const renderBattle = () => {
    heroEl.style.setProperty("--hero-x", `${state.heroX}%`);
    heroEl.style.setProperty("--hero-y", `${state.heroY}%`);
    monsterEl.style.setProperty("--monster-x", `${state.monsterX}%`);
    monsterEl.style.setProperty("--monster-y", `${state.monsterY}%`);
    heroScoreEl.textContent = String(state.heroHits);
    monsterScoreEl.textContent = String(state.monsterHits);
  };

  const setBattleStatus = (value) => {
    battleStatusEl.textContent = value;
  };

  const flashClass = (element, className, duration = 180) => {
    element.classList.add(className);
    window.setTimeout(() => element.classList.remove(className), duration);
  };

  const finishBattle = (didHeroWin) => {
    battleLocked = true;
    window.clearInterval(battleLoop);
    pressedKeys.clear();
    setBattleStatus(
      didHeroWin
        ? "Победа! Герой успел победить монстра. Нажми «заново», чтобы сыграть ещё раз."
        : "Монстр трижды достал героя. Нажми «заново», чтобы попробовать ещё раз.",
    );
  };

  const getDistance = () => {
    const heroPosition = 18 + state.heroX;
    const monsterPosition = 50 + state.monsterX;
    return monsterPosition - heroPosition;
  };

  const moveHero = (direction) => {
    if (!battleStarted || battleLocked) return;
    state.heroX += direction * 1.9;
    state.heroX = Math.max(-8, Math.min(28, state.heroX));
  };

  const jumpHero = () => {
    if (!battleStarted || battleLocked || jumpTimer) return;
    state.heroY = 11;
    heroEl.classList.add("is-jumping");
    renderBattle();
    jumpTimer = window.setTimeout(() => {
      state.heroY = 0;
      jumpTimer = 0;
      heroEl.classList.remove("is-jumping");
      renderBattle();
    }, 420);
  };

  const attackMonster = () => {
    if (!battleStarted || battleLocked || heroAttackTimer) return;
    heroEl.classList.add("is-attacking");
    heroAttackTimer = window.setTimeout(() => {
      heroAttackTimer = 0;
      heroEl.classList.remove("is-attacking");
    }, 220);

    const distance = getDistance();
    if (distance >= -2 && distance <= 10) {
      state.heroHits += 1;
      state.monsterX = Math.min(18, state.monsterX + 4.5);
      patrolDirection = 1;
      lungeFrames = 0;
      flashClass(monsterEl, "is-hit", 220);
      setBattleStatus(`Попадание! Герою осталось нанести ещё ${Math.max(0, 3 - state.heroHits)} удара.`);
      renderBattle();
      if (state.heroHits >= 3) {
        finishBattle(true);
      }
      return;
    }

    setBattleStatus("Меч не достал. Подойди ближе к монстру.");
  };

  const monsterPatrol = (distance) => {
    if (distance > 16) {
      state.monsterX -= 1.8;
      patrolDirection = -1;
      return;
    }

    if (distance < 4) {
      state.monsterX += 1.6;
      patrolDirection = 1;
      return;
    }

    state.monsterX += patrolDirection * 0.8;
    if (state.monsterX < -10 || state.monsterX > 14) {
      patrolDirection *= -1;
    }
  };

  const monsterStep = () => {
    if (!battleStarted || battleLocked) return;

    const distance = getDistance();

    if (monsterTouchCooldown > 0) {
      monsterTouchCooldown -= 1;
    }

    if (lungeFrames > 0) {
      state.monsterX -= 2.2;
      lungeFrames -= 1;
    } else if (distance < 13) {
      lungeFrames = 2;
      monsterEl.classList.add("is-attacking");
      window.setTimeout(() => monsterEl.classList.remove("is-attacking"), 180);
    } else {
      monsterPatrol(distance);
    }

    state.monsterX = Math.max(-20, Math.min(18, state.monsterX));

    const afterMoveDistance = getDistance();
    if (afterMoveDistance <= 5.5 && monsterTouchCooldown === 0) {
      state.monsterHits += 1;
      monsterTouchCooldown = 5;
      flashClass(heroEl, "is-hit", 220);
      flashClass(monsterEl, "is-attacking", 220);
      state.heroX = Math.max(-8, state.heroX - 2.2);
      setBattleStatus(`Монстр попал. До поражения осталось ${Math.max(0, 3 - state.monsterHits)} касания.`);
      if (state.monsterHits >= 3) {
        renderBattle();
        finishBattle(false);
        return;
      }
    }

    renderBattle();
  };

  const updatePressedMovement = () => {
    if (!isSceneActive(screen1El, [screen2El])) {
      pressedKeys.clear();
      return;
    }
    if (!battleStarted || battleLocked) return;
    if (pressedKeys.has("ArrowLeft") && !pressedKeys.has("ArrowRight")) {
      moveHero(-1);
    }
    if (pressedKeys.has("ArrowRight") && !pressedKeys.has("ArrowLeft")) {
      moveHero(1);
    }
  };

  const restartBattle = () => {
    window.clearInterval(battleLoop);
    if (jumpTimer) {
      window.clearTimeout(jumpTimer);
      jumpTimer = 0;
    }
    if (heroAttackTimer) {
      window.clearTimeout(heroAttackTimer);
      heroAttackTimer = 0;
    }
    if (monsterAttackTimer) {
      window.clearTimeout(monsterAttackTimer);
      monsterAttackTimer = 0;
    }

    Object.assign(state, startState);
    pressedKeys.clear();
    battleStarted = true;
    battleLocked = false;
    monsterTouchCooldown = 0;
    patrolDirection = -1;
    lungeFrames = 0;
    heroEl.classList.remove("is-attacking", "is-jumping", "is-hit");
    monsterEl.classList.remove("is-attacking", "is-hit");
    renderBattle();
    setBattleStatus("Успей 3 раза ударить монстра раньше, чем он коснётся героя 3 раза.");
    battleLoop = window.setInterval(() => {
      updatePressedMovement();
      monsterStep();
    }, 140);
  };

  const handleBattleAction = (action) => {
    if (action === "restart") {
      restartBattle();
      return;
    }
    if (!battleStarted || battleLocked) return;
    if (action === "left") moveHero(-1);
    if (action === "right") moveHero(1);
    if (action === "jump") jumpHero();
    if (action === "attack") attackMonster();
    renderBattle();
  };

  window.addEventListener("keydown", (event) => {
    if (!isSceneActive(screen1El, [screen2El])) return;

    const actionMap = {
      ArrowUp: "jump",
      ArrowDown: "attack",
      KeyR: "restart",
    };

    if (event.code === "ArrowLeft" || event.code === "ArrowRight") {
      pressedKeys.add(event.code);
      event.preventDefault();
      return;
    }

    const action = actionMap[event.code];
    if (!action) return;
    event.preventDefault();
    handleBattleAction(action);
  });

  window.addEventListener("keyup", (event) => {
    if (event.code === "ArrowLeft" || event.code === "ArrowRight") {
      pressedKeys.delete(event.code);
    }
  });

  window.addEventListener("blur", () => pressedKeys.clear());

  battleStartEl.addEventListener("click", () => {
    restartBattle();
    battleStartEl.blur();
  });

  renderBattle();
  setBattleStatus("Нажми играть, чтобы запустить бой.");
}


const mazePlayfieldEl = document.querySelector("#maze-playfield");
const mazeHeroEl = document.querySelector("#maze-hero");
const mazeStatusEl = document.querySelector("#maze-status");
const mazeStartEl = document.querySelector("#maze-start");
const mazeGoalMarkerEl = document.querySelector(".maze-goal-marker");

if (screen2El && mazePlayfieldEl && mazeHeroEl && mazeStatusEl && mazeStartEl && mazeGoalMarkerEl) {
  const startPosition = { x: 91, y: 4 };
  const moveStep = 2.2;
  const mazeHeroSprites = {
    ArrowLeft: "images/геройлево.png",
    ArrowRight: "images/геройправо.png",
    ArrowUp: "images/геройвверх.png",
    ArrowDown: "images/геройвниз.png",
  };

  const mazeState = {
    started: false,
    won: false,
    x: startPosition.x,
    y: startPosition.y,
  };

  const isMazeActive = () => {
    const rect = mazePlayfieldEl.getBoundingClientRect();
    return rect.bottom > 0 && rect.right > 0 && rect.top < window.innerHeight && rect.left < window.innerWidth;
  };

  const setMazeStatus = (value) => {
    mazeStatusEl.textContent = value;
  };

  const setMazeHeroSprite = (code) => {
    const nextSprite = mazeHeroSprites[code];
    if (nextSprite) {
      mazeHeroEl.src = nextSprite;
    }
  };

  const renderMazeHero = () => {
    mazeHeroEl.style.setProperty("--maze-hero-x", mazeState.x.toFixed(2));
    mazeHeroEl.style.setProperty("--maze-hero-y", mazeState.y.toFixed(2));
  };

  const flashHero = (className) => {
    mazeHeroEl.classList.remove(className);
    void mazeHeroEl.offsetWidth;
    mazeHeroEl.classList.add(className);
  };

  const heroTouchesGoal = () => {
    const heroRect = mazeHeroEl.getBoundingClientRect();
    const goalRect = mazeGoalMarkerEl.getBoundingClientRect();
    return !(heroRect.right < goalRect.left || heroRect.left > goalRect.right || heroRect.bottom < goalRect.top || heroRect.top > goalRect.bottom);
  };

  const finishMaze = () => {
    mazeState.started = false;
    mazeState.won = true;
    flashHero("is-won");
    setMazeStatus("Герой дошел до выхода. Нажми играть, чтобы пройти еще раз.");
  };

  const startMaze = () => {
    screen2El.dataset.activeGame = "maze";
    mazeState.started = true;
    mazeState.won = false;
    mazeState.x = startPosition.x;
    mazeState.y = startPosition.y;
    setMazeHeroSprite("ArrowLeft");
    mazeHeroEl.classList.remove("is-won", "is-blocked");
    renderMazeHero();
    setMazeStatus("Жми стрелки и веди героя к светящемуся выходу.");
  };

  const moveMazeHero = (dx, dy) => {
    if (!mazeState.started || mazeState.won) return;

    mazeState.x = Math.max(2, Math.min(98, mazeState.x + dx));
    mazeState.y = Math.max(2, Math.min(98, mazeState.y + dy));
    flashHero("is-running");
    renderMazeHero();

    if (heroTouchesGoal()) {
      finishMaze();
    }
  };

  window.addEventListener("keydown", (event) => {
    if (!isMazeActive()) return;
    if (screen2El.dataset.activeGame !== "maze") return;

    if (event.code === "KeyR") {
      event.preventDefault();
      startMaze();
      return;
    }

    if (!mazeState.started || mazeState.won) return;

    if (event.code === "ArrowLeft") {
      event.preventDefault();
      setMazeHeroSprite(event.code);
      moveMazeHero(-moveStep, 0);
    }

    if (event.code === "ArrowRight") {
      event.preventDefault();
      setMazeHeroSprite(event.code);
      moveMazeHero(moveStep, 0);
    }

    if (event.code === "ArrowUp") {
      event.preventDefault();
      setMazeHeroSprite(event.code);
      moveMazeHero(0, -moveStep);
    }

    if (event.code === "ArrowDown") {
      event.preventDefault();
      setMazeHeroSprite(event.code);
      moveMazeHero(0, moveStep);
    }
  });

  mazeStartEl.addEventListener("click", startMaze);
  mazeStartEl.disabled = false;
  renderMazeHero();
  setMazeStatus("Нажми играть, потом веди героя стрелками к подсвеченному прямоугольнику.");
}

const roadRunnerTrackEl = document.querySelector("#road-runner-track");
const roadRunnerHeroEl = document.querySelector("#road-runner-hero");
const roadRunnerStartEl = document.querySelector("#road-runner-start");
const roadRunnerStatusEl = document.querySelector("#road-runner-status");
const roadRunnerObstaclesEl = document.querySelector("#road-runner-obstacles");
const roadRunnerRoadAEl = document.querySelector(".road-runner-road-a");
const roadRunnerRoadBEl = document.querySelector(".road-runner-road-b");

if (
  roadRunnerTrackEl &&
  roadRunnerHeroEl &&
  roadRunnerStartEl &&
  roadRunnerStatusEl &&
  roadRunnerObstaclesEl &&
  roadRunnerRoadAEl &&
  roadRunnerRoadBEl
) {
  const lanePositions = [12.5, 26.9, 41.3, 55.7, 70.1, 84.5];
  const finishProgress = 92;
  const heroSpeed = 18;
  const obstaclePattern = [
    { lane: 0, y: 18 },
    { lane: 3, y: 24 },
    { lane: 5, y: 31 },
    { lane: 1, y: 41 },
    { lane: 4, y: 47 },
    { lane: 2, y: 58 },
    { lane: 0, y: 66 },
    { lane: 5, y: 73 },
    { lane: 3, y: 82 },
  ];

  const roadRunnerState = {
    started: false,
    won: false,
    lane: 2,
    progress: 4,
    obstacles: [],
    frameId: 0,
    lastTimestamp: 0,
  };

  const setRoadRunnerStatus = (message) => {
    roadRunnerStatusEl.textContent = message;
  };

  const renderRoadRunnerHero = () => {
    roadRunnerHeroEl.style.setProperty("--road-runner-lane", String(roadRunnerState.lane));
    roadRunnerHeroEl.style.setProperty("--road-runner-progress", roadRunnerState.progress.toFixed(2));
  };

  const clearRoadRunnerObstacles = () => {
    roadRunnerState.obstacles.forEach((obstacle) => obstacle.el.remove());
    roadRunnerState.obstacles = [];
  };

  const stopRoadRunner = () => {
    window.cancelAnimationFrame(roadRunnerState.frameId);
    roadRunnerState.frameId = 0;
    roadRunnerState.lastTimestamp = 0;
  };

  const seedRoadRunnerObstacles = () => {
    clearRoadRunnerObstacles();
    obstaclePattern.forEach((item) => {
      const obstacleEl = document.createElement("div");
      obstacleEl.className = "road-runner-obstacle";
      obstacleEl.style.left = `${lanePositions[item.lane]}%`;
      obstacleEl.style.top = `${item.y}%`;
      roadRunnerObstaclesEl.append(obstacleEl);

      roadRunnerState.obstacles.push({
        lane: item.lane,
        y: item.y,
        el: obstacleEl,
      });
    });
  };

  const roadRunnerHeroRect = () => roadRunnerHeroEl.getBoundingClientRect();

  const roadRunnerHitObstacle = () => {
    const heroRect = roadRunnerHeroRect();

    return roadRunnerState.obstacles.some((obstacle) => {
      const obstacleRect = obstacle.el.getBoundingClientRect();
      return !(
        heroRect.right < obstacleRect.left ||
        heroRect.left > obstacleRect.right ||
        heroRect.bottom < obstacleRect.top ||
        heroRect.top > obstacleRect.bottom
      );
    });
  };

  const finishRoadRunner = (won) => {
    roadRunnerState.started = false;
    roadRunnerState.won = won;
    stopRoadRunner();
    roadRunnerHeroEl.classList.remove("is-running");
    roadRunnerHeroEl.classList.toggle("is-hit", !won);
    setRoadRunnerStatus(
      won
        ? "Герой добежал до конца дороги. Нажми играть, чтобы пройти еще раз."
        : "Герой врезался в препятствие. Нажми играть и попробуй еще раз."
    );
  };

  const stepRoadRunner = (timestamp) => {
    if (!roadRunnerState.started) return;

    if (!roadRunnerState.lastTimestamp) {
      roadRunnerState.lastTimestamp = timestamp;
    }

    const delta = (timestamp - roadRunnerState.lastTimestamp) / 1000;
    roadRunnerState.lastTimestamp = timestamp;

    roadRunnerState.progress = Math.min(finishProgress, roadRunnerState.progress + delta * heroSpeed);
    renderRoadRunnerHero();

    if (roadRunnerHitObstacle()) {
      finishRoadRunner(false);
      return;
    }

    if (roadRunnerState.progress >= finishProgress) {
      finishRoadRunner(true);
      return;
    }

    roadRunnerState.frameId = window.requestAnimationFrame(stepRoadRunner);
  };

  const startRoadRunner = () => {
    screen2El.dataset.activeGame = "road";
    stopRoadRunner();
    roadRunnerState.started = true;
    roadRunnerState.won = false;
    roadRunnerState.lane = 2;
    roadRunnerState.progress = 4;
    roadRunnerHeroEl.classList.remove("is-hit");
    roadRunnerHeroEl.classList.add("is-running");
    seedRoadRunnerObstacles();
    renderRoadRunnerHero();
    setRoadRunnerStatus("Жми ← и →, чтобы уводить героя по 6 полосам и не врезаться в препятствия.");
    roadRunnerState.frameId = window.requestAnimationFrame(stepRoadRunner);
  };

  window.addEventListener("keydown", (event) => {
    const trackRect = roadRunnerTrackEl.getBoundingClientRect();
    const isTrackVisible =
      trackRect.bottom > 0 && trackRect.right > 0 && trackRect.top < window.innerHeight && trackRect.left < window.innerWidth;

    if (!isTrackVisible) return;
    if (screen2El.dataset.activeGame !== "road") return;

    if (event.code === "KeyR") {
      event.preventDefault();
      startRoadRunner();
      return;
    }

    if (!roadRunnerState.started || roadRunnerState.won) return;

    if (event.code === "ArrowLeft") {
      event.preventDefault();
      roadRunnerState.lane = Math.max(0, roadRunnerState.lane - 1);
      renderRoadRunnerHero();
    }

    if (event.code === "ArrowRight") {
      event.preventDefault();
      roadRunnerState.lane = Math.min(lanePositions.length - 1, roadRunnerState.lane + 1);
      renderRoadRunnerHero();
    }
  });

  roadRunnerStartEl.addEventListener("click", startRoadRunner);
  seedRoadRunnerObstacles();
  renderRoadRunnerHero();
  roadRunnerRoadAEl.style.transform = "";
  roadRunnerRoadBEl.style.transform = "";
}

const chipmunkGameEl = document.querySelector("#chipmunk-game");
const chipmunkStartEl = document.querySelector("#chipmunk-start");
const chipmunkScoreEl = document.querySelector("#chipmunk-score");
const chipmunkStatusEl = document.querySelector("#chipmunk-status");
const chipmunkCursorEl = document.querySelector("#chipmunk-cursor");
const chipmunkOverlayEl = document.querySelector("#chipmunk-overlay");
const chipmunkOverlayTitleEl = document.querySelector("#chipmunk-overlay-title");
const chipmunkRestartEl = document.querySelector("#chipmunk-restart");
const chipmunkHoleEls = [...document.querySelectorAll(".chipmunk-hole")];

if (
  chipmunkGameEl &&
  chipmunkStartEl &&
  chipmunkScoreEl &&
  chipmunkStatusEl &&
  chipmunkCursorEl &&
  chipmunkOverlayEl &&
  chipmunkOverlayTitleEl &&
  chipmunkRestartEl &&
  chipmunkHoleEls.length
) {
  const chipmunkGoal = 6;
  const riseDuration = 1300;
  const fireDelay = 980;
  const loseDelay = 3000;
  const minSpawnDelay = 650;
  const maxSpawnDelay = 1500;

  const chipmunkState = {
    started: false,
    armed: false,
    locked: false,
    score: 0,
    activeHole: -1,
    spawnTimeout: 0,
    fireTimeout: 0,
    loseTimeout: 0,
    timerFrame: 0,
    fireStartedAt: 0,
    cursorFrame: 0,
    cursorX: -999,
    cursorY: -999,
  };

  const randomDelay = () => minSpawnDelay + Math.random() * (maxSpawnDelay - minSpawnDelay);

  const setChipmunkStatus = (message) => {
    chipmunkStatusEl.textContent = message;
  };

  const updateChipmunkHud = () => {
    chipmunkScoreEl.textContent = String(chipmunkState.score);
  };

  const clearChipmunkTimers = () => {
    window.clearTimeout(chipmunkState.spawnTimeout);
    window.clearTimeout(chipmunkState.fireTimeout);
    window.clearTimeout(chipmunkState.loseTimeout);
    window.cancelAnimationFrame(chipmunkState.timerFrame);
    chipmunkState.spawnTimeout = 0;
    chipmunkState.fireTimeout = 0;
    chipmunkState.loseTimeout = 0;
    chipmunkState.timerFrame = 0;
    chipmunkState.fireStartedAt = 0;
  };

  const resetHoles = () => {
    chipmunkHoleEls.forEach((holeEl) => {
      holeEl.classList.remove("is-rising", "is-visible", "is-burning", "is-hit", "is-failed");
    });
    chipmunkState.activeHole = -1;
  };

  const renderHammerState = () => {
    chipmunkGameEl.classList.toggle("is-armed", chipmunkState.armed);
    chipmunkGameEl.classList.toggle("is-waiting", !chipmunkState.started);
    chipmunkCursorEl.classList.toggle("is-visible", chipmunkState.armed);

    if (!chipmunkState.armed) {
      queueHammerCursor(-999, -999);
    }
  };

  const renderHammerCursor = () => {
    chipmunkState.cursorFrame = 0;
    chipmunkCursorEl.style.transform = `translate3d(${chipmunkState.cursorX}px, ${chipmunkState.cursorY}px, 0) rotate(-26deg)`;
  };

  const queueHammerCursor = (x, y) => {
    chipmunkState.cursorX = x;
    chipmunkState.cursorY = y;

    if (!chipmunkState.cursorFrame) {
      chipmunkState.cursorFrame = window.requestAnimationFrame(renderHammerCursor);
    }
  };

  if (chipmunkCursorEl.parentElement !== document.body) {
    document.body.appendChild(chipmunkCursorEl);
  }

  const updateChipmunkTimer = () => {
    updateChipmunkHud();

    if (chipmunkState.fireStartedAt && !chipmunkState.locked && chipmunkState.activeHole >= 0) {
      chipmunkState.timerFrame = window.requestAnimationFrame(updateChipmunkTimer);
    }
  };

  const scheduleNextChipmunk = (delay = randomDelay()) => {
    if (chipmunkState.locked) {
      return;
    }

    chipmunkState.spawnTimeout = window.setTimeout(() => {
      const available = chipmunkHoleEls.filter((_, index) => index !== chipmunkState.activeHole);
      const nextHole = available[Math.floor(Math.random() * available.length)] || chipmunkHoleEls[0];
      const holeIndex = Number(nextHole.dataset.hole);

      resetHoles();
      chipmunkState.activeHole = holeIndex;
      nextHole.classList.add("is-rising");

      window.setTimeout(() => {
        if (chipmunkState.activeHole !== holeIndex || chipmunkState.locked) {
          return;
        }

        nextHole.classList.add("is-visible");
      }, riseDuration * 0.45);

      chipmunkState.fireTimeout = window.setTimeout(() => {
        if (chipmunkState.activeHole !== holeIndex || chipmunkState.locked) {
          return;
        }

        nextHole.classList.add("is-burning");
        chipmunkState.fireStartedAt = performance.now();
        setChipmunkStatus("Огонь появился. У тебя есть 3 секунды, чтобы ударить бурундука.");
        updateChipmunkTimer();

        chipmunkState.loseTimeout = window.setTimeout(() => {
          if (chipmunkState.activeHole !== holeIndex || chipmunkState.locked) {
            return;
          }

          chipmunkState.locked = true;
          chipmunkState.armed = false;
          nextHole.classList.add("is-failed");
          chipmunkOverlayTitleEl.textContent = "ты проиграл";
          chipmunkOverlayEl.hidden = false;
          setChipmunkStatus("ты не уследил за бурундуком");
          updateChipmunkHud();
          renderHammerState();
        }, loseDelay);
      }, fireDelay);
    }, delay);
  };

  const restartChipmunkGame = () => {
    clearChipmunkTimers();
    chipmunkState.started = true;
    chipmunkState.armed = true;
    chipmunkState.locked = false;
    chipmunkState.score = 0;
    chipmunkOverlayEl.hidden = true;
    resetHoles();
    updateChipmunkHud();
    setChipmunkStatus("Кликай по бурундуку, как только он вылезет из кольца.");
    renderHammerState();
    scheduleNextChipmunk(450);
  };

  chipmunkStartEl.addEventListener("click", () => {
    restartChipmunkGame();
  });

  chipmunkHoleEls.forEach((holeEl, index) => {
    holeEl.addEventListener("click", () => {
      if (!chipmunkState.started || !chipmunkState.armed || chipmunkState.locked || chipmunkState.activeHole !== index) {
        return;
      }

      const isVisible = holeEl.classList.contains("is-visible") || holeEl.classList.contains("is-burning");
      if (!isVisible) {
        return;
      }

      clearChipmunkTimers();
      holeEl.classList.remove("is-burning", "is-visible");
      holeEl.classList.add("is-hit");
      chipmunkState.activeHole = -1;
      chipmunkState.score += 1;
      updateChipmunkHud();

      if (chipmunkState.score >= chipmunkGoal) {
        chipmunkState.locked = true;
        chipmunkState.armed = false;
        chipmunkOverlayTitleEl.textContent = "ты победил";
        chipmunkOverlayEl.hidden = false;
        setChipmunkStatus("Все бурундуки пойманы. Можно сыграть ещё раз.");
        renderHammerState();
        return;
      }

      setChipmunkStatus("Попадание. Следи за следующим кольцом.");
      scheduleNextChipmunk(520);
    });
  });

  chipmunkRestartEl.addEventListener("click", restartChipmunkGame);

  window.addEventListener("pointermove", (event) => {
    if (!chipmunkState.armed) {
      return;
    }

    queueHammerCursor(event.clientX - 36, event.clientY - 22);
  });

  chipmunkGameEl.addEventListener("pointerleave", () => {
    if (!chipmunkState.armed) {
      queueHammerCursor(-999, -999);
    }
  });

  window.addEventListener("blur", () => {
    queueHammerCursor(-999, -999);
  });

  clearChipmunkTimers();
  resetHoles();
  updateChipmunkHud();
  renderHammerState();
  setChipmunkStatus("");
}

const boatSceneEl = document.querySelector("#boat-scene");
const boatRaftEl = document.querySelector("#boat-raft");
const boatPaddleEl = document.querySelector("#boat-paddle");
const boatDriveButtonEl = document.querySelector("#boat-drive-button");
const boatStatusEl = document.querySelector("#boat-status");

if (boatSceneEl && boatRaftEl && boatPaddleEl && boatDriveButtonEl && boatStatusEl) {
  const travel = {
    from: 0,
    to: 44,
  };

  let boatFrame = 0;
  let lastBoatTimestamp = 0;
  let boatProgress = 0;
  let strokePhase = 0;
  let isBoatDriving = false;

  const setBoatDriving = (value) => {
    if (value && boatProgress < 1) {
      boatStatusEl.hidden = true;
    }
    isBoatDriving = value;
    boatDriveButtonEl.classList.toggle("is-pressed", value);
  };

  const renderBoat = (timestamp) => {
    if (!lastBoatTimestamp) {
      lastBoatTimestamp = timestamp;
    }

    const delta = (timestamp - lastBoatTimestamp) / 1000;
    lastBoatTimestamp = timestamp;

    if (isBoatDriving) {
      boatProgress = Math.min(1, boatProgress + delta * 0.18);
      strokePhase += delta * 8.5;
    }

    if (boatProgress >= 1) {
      boatStatusEl.hidden = false;
      isBoatDriving = false;
      boatDriveButtonEl.classList.remove("is-pressed");
    }

    const x = travel.from + (travel.to - travel.from) * boatProgress;
    const stroke = Math.sin(strokePhase);
    const paddleAngle = -30 + Math.max(0, stroke) * 26;
    const raftLift = Math.sin(strokePhase * 0.56) * (isBoatDriving ? 3 : 1.2);
    const riderLift = Math.sin(strokePhase * 0.56 + 0.4) * (isBoatDriving ? 2 : 0.7);

    boatRaftEl.style.transform = `translate(${x}%, ${raftLift}px)`;
    boatPaddleEl.style.transform = `rotate(${paddleAngle}deg) translateY(${Math.max(0, stroke) * 5}px)`;

    const riderEl = boatRaftEl.querySelector('.boat-rider');
    if (riderEl) {
      riderEl.style.transform = `translateY(${riderLift}px)`;
    }

    boatFrame = window.requestAnimationFrame(renderBoat);
  };

  boatDriveButtonEl.addEventListener("pointerdown", () => setBoatDriving(true));
  boatDriveButtonEl.addEventListener("pointerup", () => setBoatDriving(false));
  boatDriveButtonEl.addEventListener("pointerleave", () => setBoatDriving(false));
  boatDriveButtonEl.addEventListener("pointercancel", () => setBoatDriving(false));
  window.addEventListener("pointerup", () => setBoatDriving(false));

  boatFrame = window.requestAnimationFrame(renderBoat);
  window.addEventListener("beforeunload", () => {
    setBoatDriving(false);
    window.cancelAnimationFrame(boatFrame);
  });
}

const scanFrameEl = document.querySelector("#scan-frame");
const scanButtonEl = document.querySelector("#scan-button");
const scanBeamEl = document.querySelector("#scan-beam");
const scanSceneShellEl = document.querySelector(".scan-scene-shell");

if (scanFrameEl && scanButtonEl && scanBeamEl && scanSceneShellEl) {
  let scanFrame = 0;
  let scanStart = 0;
  let scanActive = false;
  let scanDone = false;

  const finishScan = () => {
    scanActive = false;
    scanDone = true;
    scanFrameEl.classList.remove("is-scanning");
    scanFrameEl.classList.add("is-complete");
    scanSceneShellEl.classList.add("is-complete");
    scanButtonEl.disabled = false;
    scanButtonEl.textContent = "scan";
  };

  const runScan = (timestamp) => {
    if (!scanStart) {
      scanStart = timestamp;
    }

    const elapsed = timestamp - scanStart;
    const progress = Math.min(1, elapsed / 1600);
    const beamTop = 25 + progress * 48;
    scanBeamEl.style.top = `${beamTop}%`;

    if (progress >= 1) {
      finishScan();
      return;
    }

    scanFrame = window.requestAnimationFrame(runScan);
  };

  scanButtonEl.addEventListener("click", () => {
    if (scanActive) return;

    window.cancelAnimationFrame(scanFrame);
    scanStart = 0;
    scanActive = true;
    scanDone = false;
    scanFrameEl.classList.remove("is-complete");
    scanSceneShellEl.classList.remove("is-complete");
    scanFrameEl.classList.add("is-scanning");
    scanBeamEl.style.top = "25%";
    scanButtonEl.disabled = true;
    scanButtonEl.textContent = "scan...";
    scanFrame = window.requestAnimationFrame(runScan);
  });

  window.addEventListener("beforeunload", () => window.cancelAnimationFrame(scanFrame));
}
