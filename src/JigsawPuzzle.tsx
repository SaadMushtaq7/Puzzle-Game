import React, { useEffect, useRef, useCallback, useState } from "react";
import Resizer from "react-image-file-resizer";
import Popup from "reactjs-popup";
import { RiImageAddFill } from "react-icons/ri";
import "reactjs-popup/dist/index.css";

const distance = (p1: any, p2: any) => {
  return Math.sqrt(
    (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y)
  );
};

const successAudio = new Audio("/audio/success.wav");
successAudio.volume = 0.2;

const completeApplauseAudio = new Audio("/audio/applause.wav");
successAudio.volume = 0.2;

class Piece {
  rowIndex: number;
  colIndex: number;
  x: number;
  y: number;
  xCorrect: number;
  yCorrect: number;
  width: number;
  height: number;
  correct: boolean;
  top: any;
  left: any;
  right: any;
  bottom: any;
  color: string;

  constructor(rowIndex: number, colIndex: number, sizeRef: any, color: string) {
    this.rowIndex = rowIndex;
    this.colIndex = colIndex;
    this.x = sizeRef.x + (sizeRef.width * this.colIndex) / sizeRef.columns;
    this.y = sizeRef.y + (sizeRef.height * this.rowIndex) / sizeRef.rows;
    this.width = sizeRef.width / sizeRef.columns;
    this.height = sizeRef.height / sizeRef.rows;
    this.xCorrect = this.x;
    this.yCorrect = this.y;
    this.correct = true;
    this.top = null;
    this.left = null;
    this.right = null;
    this.bottom = null;
    this.color = color;
  }

  draw(context: any, image: any, sizeRef: any, useCam = true) {
    context.beginPath();

    const sz = Math.min(this.width, this.height);
    const neck = 0.05 * sz;
    const tabWidth = 0.3 * sz;
    const tabHeight = 0.3 * sz;

    //from top left
    context.moveTo(this.x, this.y);
    //to top right
    if (this.top) {
      context.lineTo(this.x + this.width * Math.abs(this.top) - neck, this.y);

      context.bezierCurveTo(
        this.x + this.width * Math.abs(this.top) - neck,
        this.y - tabHeight * Math.sign(this.top) * 0.2,

        this.x + this.width * Math.abs(this.top) - tabWidth,
        this.y - tabHeight * Math.sign(this.top),

        this.x + this.width * Math.abs(this.top),
        this.y - tabHeight * Math.sign(this.top)
      );

      context.bezierCurveTo(
        this.x + this.width * Math.abs(this.top) + tabWidth,
        this.y - tabHeight * Math.sign(this.top),

        this.x + this.width * Math.abs(this.top) + neck,
        this.y - tabHeight * Math.sign(this.top) * 0.2,

        this.x + this.width * Math.abs(this.top) + neck,
        this.y
      );
    }
    context.lineTo(this.x + this.width, this.y);
    //to bottom right
    if (this.right) {
      context.lineTo(
        this.x + this.width,
        this.y + this.height * Math.abs(this.right) - neck
      );
      context.bezierCurveTo(
        this.x + this.width - tabHeight * Math.sign(this.right) * 0.2,
        this.y + this.height * Math.abs(this.right) - neck,

        this.x + this.width - tabHeight * Math.sign(this.right),
        this.y + this.height * Math.abs(this.right) - tabWidth,

        this.x + this.width - tabHeight * Math.sign(this.right),
        this.y + this.height * Math.abs(this.right)
      );
      context.bezierCurveTo(
        this.x + this.width - tabHeight * Math.sign(this.right),
        this.y + this.height * Math.abs(this.right) + tabWidth,

        this.x + this.width - tabHeight * Math.sign(this.right) * 0.2,
        this.y + this.height * Math.abs(this.right) + neck,

        this.x + this.width,
        this.y + this.height * Math.abs(this.right) + neck
      );
    }
    context.lineTo(this.x + this.width, this.y + this.height);
    //to bottom left
    if (this.bottom) {
      context.lineTo(
        this.x + this.width * Math.abs(this.bottom) + neck,
        this.y + this.height
      );
      context.bezierCurveTo(
        this.x + this.width * Math.abs(this.bottom) + neck,
        this.y + this.height + tabHeight * Math.sign(this.bottom) * 0.2,

        this.x + this.width * Math.abs(this.bottom) + tabWidth,
        this.y + this.height + tabHeight * Math.sign(this.bottom),

        this.x + this.width * Math.abs(this.bottom),
        this.y + this.height + tabHeight * Math.sign(this.bottom)
      );
      context.bezierCurveTo(
        this.x + this.width * Math.abs(this.bottom) - tabWidth,
        this.y + this.height + tabHeight * Math.sign(this.bottom),

        this.x + this.width * Math.abs(this.bottom) - neck,
        this.y + this.height + tabHeight * Math.sign(this.bottom) * 0.2,

        this.x + this.width * Math.abs(this.bottom) - neck,
        this.y + this.height
      );
    }
    context.lineTo(this.x, this.y + this.height);
    //to top left
    if (this.left) {
      context.lineTo(this.x, this.y + this.height * Math.abs(this.left) + neck);
      context.bezierCurveTo(
        this.x + tabHeight * Math.sign(this.left) * 0.2,
        this.y + this.height * Math.abs(this.left) + neck,

        this.x + tabHeight * Math.sign(this.left),
        this.y + this.height * Math.abs(this.left) + tabWidth,

        this.x + tabHeight * Math.sign(this.left),
        this.y + this.height * Math.abs(this.left)
      );
      context.bezierCurveTo(
        this.x + tabHeight * Math.sign(this.left),
        this.y + this.height * Math.abs(this.left) - tabWidth,

        this.x + tabHeight * Math.sign(this.left) * 0.2,
        this.y + this.height * Math.abs(this.left) - neck,

        this.x,
        this.y + this.height * Math.abs(this.left) - neck
      );
    }
    context.lineTo(this.x, this.y);

    context.save();
    context.clip();

    const scaledTabHeight =
      Math.min(image.width / sizeRef.columns, image.height / sizeRef.rows) *
      (tabHeight / sz);

    if (useCam) {
      context.drawImage(
        image,
        (this.colIndex * image.width) / sizeRef.columns - scaledTabHeight,
        (this.rowIndex * image.height) / sizeRef.rows - scaledTabHeight,
        image.width / sizeRef.columns + scaledTabHeight * 2,
        image.height / sizeRef.rows + scaledTabHeight * 2,
        this.x - tabHeight,
        this.y - tabHeight,
        this.width + tabHeight * 2,
        this.height + tabHeight * 2
      );
    } else {
      context.fillStyle = this.color;
      context.fillRect(
        this.x - tabHeight,
        this.y - tabHeight,
        this.width + tabHeight * 2,
        this.height * tabHeight * 2
      );
    }

    context.restore();

    context.stroke();
  }

  isClose() {
    if (
      distance(
        { x: this.x, y: this.y },
        { x: this.xCorrect, y: this.yCorrect }
      ) <
      this.width / 3
    ) {
      return true;
    }
    return false;
  }
  snap() {
    this.x = this.xCorrect;
    this.y = this.yCorrect;
    this.correct = true;
    successAudio.play();
  }
}

const CamPuzzle = () => {
  const canvasRef = useRef<any>();
  const helperCanvasRef = useRef<any>();
  const imgRef = useRef<any>();
  const itemsRef = useRef<any>();
  const contextRef = useRef<any>();
  const helperContextRef = useRef<any>();
  const PIECES = useRef<any[]>([]);
  const selectedPiece = useRef<any>(null);
  const topButtonsRef = useRef<any>();
  const sizeRef = useRef<any>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    rows: 3,
    columns: 3,
  });

  const [success, setSuccess] = useState<boolean>(false);
  const [imgUrl, setImgUrl] = useState<any>();

  const scaler = 0.8;

  const isComplete = () => {
    for (let i = 0; i < PIECES.current.length; i++) {
      if (PIECES.current[i].correct === false) {
        return false;
      }
    }
    return true;
  };

  const getPressedPieceByColor = (loc: any, color: string) => {
    for (let i = PIECES.current.length - 1; i >= 0; i--) {
      if (PIECES.current[i].color === color) {
        return PIECES.current[i];
      }
    }
    return null;
  };

  const onMouseDown = useCallback((evt: any) => {
    const imgData = helperContextRef.current.getImageData(evt.x, evt.y, 1, 1);
    if (imgData.data[3] === 0) {
      return;
    }

    const clickedColor = `rgb(${imgData.data[0]},${imgData.data[1]},${imgData.data[2]})`;
    selectedPiece.current = getPressedPieceByColor(evt, clickedColor);

    if (selectedPiece.current !== null) {
      const index = PIECES.current.indexOf(selectedPiece.current);
      if (index > -1) {
        PIECES.current.splice(index, 1);
        PIECES.current.push(selectedPiece.current);
      }
      selectedPiece.current.offset = {
        x: evt.x - selectedPiece.current.x,
        y: evt.y - selectedPiece.current.y,
      };

      selectedPiece.current.correct = false;
    }
  }, []);

  const onMouseUp = useCallback(() => {
    if (selectedPiece.current && selectedPiece.current.isClose()) {
      selectedPiece.current.snap();
      if (isComplete()) {
        setTimeout(() => {
          completeApplauseAudio.play();
        }, 500);
        setSuccess(true);
      }
    }
    selectedPiece.current = null;
  }, []);

  const onTouchStart = useCallback(
    (evt: any) => {
      let loc = { x: evt.touches[0].clientX, y: evt.touches[0].clientY };
      onMouseDown(loc);
    },
    [onMouseDown]
  );

  const onTouchMove = useCallback((evt: any) => {
    let loc = { x: evt.touches[0].clientX, y: evt.touches[0].clientY };
    onMouseMove(loc);
  }, []);

  const onTouchEnd = useCallback(() => {
    onMouseUp();
  }, [onMouseUp]);

  const onMouseMove = (evt: any) => {
    if (selectedPiece.current !== null) {
      selectedPiece.current.x = evt.x - selectedPiece.current.offset.x;
      selectedPiece.current.y = evt.y - selectedPiece.current.offset.y;
    }
  };

  const addEventListeners = useCallback(() => {
    canvasRef.current.addEventListener("mousedown", onMouseDown);
    canvasRef.current.addEventListener("mousemove", onMouseMove);
    canvasRef.current.addEventListener("mouseup", onMouseUp);

    canvasRef.current.addEventListener("touchstart", onTouchStart);
    canvasRef.current.addEventListener("touchmove", onTouchMove);
    canvasRef.current.addEventListener("touchend", onTouchEnd);
  }, [onMouseDown, onMouseUp, onTouchEnd, onTouchMove, onTouchStart]);

  const updateCanvas = useCallback(() => {
    contextRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    helperContextRef.current.clearRect(
      0,
      0,
      helperCanvasRef.current.width,
      helperCanvasRef.current.height
    );

    contextRef.current.globalAlpha = 0.5;

    contextRef.current.drawImage(
      imgRef.current,
      sizeRef.current.x,
      sizeRef.current.y,
      sizeRef.current.width,
      sizeRef.current.height
    );

    contextRef.current.globalAlpha = 1;

    for (let i = 0; i < PIECES.current.length; i++) {
      PIECES.current[i].draw(
        contextRef.current,
        imgRef.current,
        sizeRef.current
      );
      PIECES.current[i].draw(
        helperContextRef.current,
        imgRef.current,
        sizeRef.current,
        false
      );
    }
    requestAnimationFrame(updateCanvas);
  }, []);

  const getRandomColor = () => {
    const red = Math.floor(Math.random() * 255);
    const green = Math.floor(Math.random() * 255);
    const blue = Math.floor(Math.random() * 255);

    return `rgb(${red},${green},${blue})`;
  };

  const handleResizer = useCallback(() => {
    canvasRef.current.width = window.innerWidth;
    canvasRef.current.height = window.innerHeight;

    helperCanvasRef.current.width = window.innerWidth;
    helperCanvasRef.current.height = window.innerHeight;

    let resizer =
      scaler *
      Math.min(
        window.innerWidth / imgRef.current.width,
        window.innerHeight / imgRef.current.height
      );
    sizeRef.current.width = resizer * imgRef.current.width;
    sizeRef.current.height = resizer * imgRef.current.height;
    sizeRef.current.x = window.innerWidth / 2 - sizeRef.current.width / 2;
    sizeRef.current.y = window.innerHeight / 2 - sizeRef.current.height / 2;
  }, []);

  const initializePieces = useCallback((rows: number, columns: any) => {
    topButtonsRef.current.style.display = "none";
    sizeRef.current.rows = rows;
    sizeRef.current.columns = columns;

    PIECES.current = [];
    let uniqueRandomColors: any = [];

    for (let i = 0; i < sizeRef.current.rows; i++) {
      for (let j = 0; j < sizeRef.current.columns; j++) {
        let color = getRandomColor();
        while (uniqueRandomColors.includes(color)) {
          color = getRandomColor();
        }
        PIECES.current.push(new Piece(i, j, sizeRef.current, color));
      }
    }

    let cnt = 0;
    for (let i = 0; i < sizeRef.current.rows; i++) {
      for (let j = 0; j < sizeRef.current.columns; j++) {
        const piece = PIECES.current[cnt];

        if (i === sizeRef.current.rows - 1) {
          piece.bottom = null;
        } else {
          const sgn = Math.random() - 0.5 < 0 ? -1 : 1;
          piece.bottom = sgn * (Math.random() * 0.4 + 0.3);
        }

        if (j === sizeRef.current.columns - 1) {
          piece.right = null;
        } else {
          const sgn = Math.random() - 0.5 < 0 ? -1 : 1;
          piece.right = sgn * (Math.random() * 0.4 + 0.3);
        }

        if (j === 0) {
          piece.left = null;
        } else {
          piece.left = -PIECES.current[cnt - 1].right;
        }

        if (i === 0) {
          piece.top = null;
        } else {
          piece.top = -PIECES.current[cnt - sizeRef.current.columns].bottom;
        }

        cnt++;
      }
    }
  }, []);

  const randomizePieces = () => {
    for (let i = 0; i < PIECES.current.length; i++) {
      let loc = {
        x: Math.random() * (canvasRef.current.width - PIECES.current[i].width),
        y:
          Math.random() * (canvasRef.current.height - PIECES.current[i].height),
      };
      PIECES.current[i].x = loc.x;
      PIECES.current[i].y = loc.y;
      PIECES.current[i].correct = false;
    }
  };

  const setDifficulty = (e: any) => {
    switch (e.target.value) {
      case "easy":
        initializePieces(3, 3);
        break;
      case "medium":
        initializePieces(5, 5);
        break;
      case "hard":
        initializePieces(10, 10);
        break;
      default:
        initializePieces(3, 3);
    }
  };

  const restart = () => {
    randomizePieces();
    itemsRef.current.style.display = "none";
    topButtonsRef.current.style.display = "block";
  };

  const fileChangedHandler = (event: any) => {
    if (event.target.files[0]) {
      try {
        Resizer.imageFileResizer(
          event.target.files[0],
          330,
          300,
          "JPEG",
          100,
          0,
          (uri) => {
            setImgUrl(uri);
          },
          "base64",
          330,
          300
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    if (!contextRef.current && !helperContextRef.current) {
      contextRef.current = canvasRef.current.getContext("2d");
      helperContextRef.current = helperCanvasRef.current.getContext("2d");
    }
    addEventListeners();

    if (imgRef.current) {
      handleResizer();
      initializePieces(sizeRef.current.rows, sizeRef.current.columns);
      updateCanvas();
    }
    itemsRef.current.style.display = "block";
    window.addEventListener("resize", handleResizer);
  }, [updateCanvas, handleResizer, addEventListeners, initializePieces]);

  return (
    <div className="mainContainer">
      <div className="topButtons" ref={topButtonsRef}>
        <button onClick={restart} className="startAgainBtn">
          Start Again?
        </button>

        <button
          onClick={() => {
            itemsRef.current.style.display = "block";
          }}
          className="newGameBtn"
        >
          New Game
        </button>
      </div>
      <>
        <canvas ref={canvasRef} />
        <canvas ref={helperCanvasRef} style={{ display: "none" }} />
        <img
          ref={imgRef}
          src={
            imgUrl
              ? imgUrl
              : "https://images.unsplash.com/photo-1669908923467-f50d53f884b9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1887&q=80"
          }
          alt="Puzzle display"
        />
      </>

      <div id="menuItems" ref={itemsRef}>
        <div id="menu">
          <div id="controls">
            Difficulty
            <br />
            <select id="difficulty" onChange={(e) => setDifficulty(e)}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <br />
            <br />
            <button onClick={restart}>Start</button>
          </div>
        </div>
        <input
          className="chooseFile"
          type="file"
          id="file"
          accept="image/*"
          onChange={(e) => fileChangedHandler(e)}
        />
        <label htmlFor="file">
          <RiImageAddFill width={"20px"} height={"20px"} /> Choose a Photo
        </label>
      </div>
      <Popup
        modal
        open={success}
        onClose={() => setSuccess(false)}
        position="right center"
      >
        <div className="modal">
          <>
            Congrats! <br />
            <span>On the Successfull completion of the puzzle!</span>
          </>
        </div>
      </Popup>
    </div>
  );
};

export default CamPuzzle;
