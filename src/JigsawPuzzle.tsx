import React, { useEffect, useRef, useCallback, useState } from "react";
import Resizer from "react-image-file-resizer";
import {
  handleResizer,
  getRandomColor,
  randomizePieces,
  getPressedPieceByColor,
  isComplete,
  getDifficulty,
} from "./helperFunctions";
import Piece from "./Piece";
import ControlButtons from "./components/ControlButtons";
import MenuModal from "./components/MenuModal";
import SuccessModal from "./components/SuccessModal";
import CanvasImage from "./components/CanvasImage";

const completeApplauseAudio = new Audio("/audio/applause.wav");
completeApplauseAudio.volume = 0.2;

const CamPuzzle = () => {
  const canvasRef = useRef<any>();
  const helperCanvasRef = useRef<any>();
  const imgRef = useRef<any>();
  const itemsRef = useRef<any>();
  const mainContainerRef = useRef<any>();
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
    rows: 2,
    columns: 2,
  });

  const [success, setSuccess] = useState<boolean>(false);
  const [imgUrl, setImgUrl] = useState<any>();

  const scaler = 0.8;

  const onMouseDown = useCallback((evt: any) => {
    console.log(selectedPiece);
    const imgData = helperContextRef.current.getImageData(evt.x, evt.y, 1, 1);
    if (imgData.data[3] === 0) {
      return;
    }

    const clickedColor = `rgb(${imgData.data[0]},${imgData.data[1]},${imgData.data[2]})`;
    selectedPiece.current = getPressedPieceByColor(
      evt,
      clickedColor,
      PIECES.current
    );

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
      if (isComplete(PIECES.current)) {
        setTimeout(() => {
          completeApplauseAudio.play();
          setSuccess(true);
        }, 1000);
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

  const initializePieces = useCallback((rows: number, columns: any) => {
    topButtonsRef.current.style.display = "none";
    sizeRef.current.rows = rows;
    sizeRef.current.columns = columns;

    PIECES.current = [];
    let uniqueRandomColors: any = [];
    let id = 1;
    for (let i = 0; i < sizeRef.current.rows; i++) {
      for (let j = 0; j < sizeRef.current.columns; j++) {
        let color = getRandomColor();
        while (uniqueRandomColors.includes(color)) {
          color = getRandomColor();
        }
        PIECES.current.push(new Piece(id, i, j, sizeRef.current, color));
        id++;
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

  const setDifficulty = (e: any) => {
    const temp = getDifficulty(e.target.value);
    initializePieces(temp.row, temp.column);
  };

  const restart = () => {
    randomizePieces(
      PIECES.current,
      canvasRef.current,
      mainContainerRef.current
    );

    itemsRef.current.style.display = "none";
    topButtonsRef.current.style.display = "flex";
  };

  const fileChangedHandler = (event: any) => {
    if (event.target.files[0]) {
      try {
        Resizer.imageFileResizer(
          event.target.files[0],
          300,
          330,
          "JPEG",
          100,
          0,
          (uri) => {
            setImgUrl(uri);
            handleResizer(
              canvasRef.current,
              helperCanvasRef.current,
              scaler,
              sizeRef.current,
              imgRef.current
            );
            initializePieces(sizeRef.current.rows, sizeRef.current.columns);
            updateCanvas();
          },
          "base64",
          300,
          330
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
      handleResizer(
        canvasRef.current,
        helperCanvasRef.current,
        scaler,
        sizeRef.current,
        imgRef.current
      );
      initializePieces(sizeRef.current.rows, sizeRef.current.columns);
      updateCanvas();
    }
    itemsRef.current.style.display = "block";
  }, [updateCanvas, addEventListeners, initializePieces]);

  return (
    <div className="mainContainer" ref={mainContainerRef}>
      <ControlButtons
        topButtonsRef={topButtonsRef}
        itemsRef={itemsRef.current}
        sizeRef={sizeRef.current}
        restart={restart}
        initializePieces={initializePieces}
      />
      <CanvasImage
        canvasRef={canvasRef}
        helperCanvasRef={helperCanvasRef}
        imgRef={imgRef}
        imgUrl={imgUrl}
      />
      <MenuModal
        itemsRef={itemsRef}
        setDifficulty={setDifficulty}
        fileChangedHandler={fileChangedHandler}
        restart={restart}
      />
      <SuccessModal
        success={success}
        itemsRef={itemsRef.current}
        topButtonsRef={topButtonsRef.current}
        setSuccess={setSuccess}
      />
    </div>
  );
};

export default CamPuzzle;
