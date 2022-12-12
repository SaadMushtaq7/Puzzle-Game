import React, { useEffect, useRef, useState } from "react";
import {
  handleResizer,
  initializePieces,
  updateCanvas,
} from "./helpers/canvasManipulation";
import { addEventListeners } from "./helpers/mouseControls";
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
  const imgUrl = useRef<any>("/images/backupPuzzle.jpg");
  const PIECES = useRef<Piece[]>([]);
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

  const scaler = 0.8;
  useEffect(() => {
    if (!contextRef.current && !helperContextRef.current) {
      contextRef.current = canvasRef.current.getContext("2d");
      helperContextRef.current = helperCanvasRef.current.getContext("2d");
    }
    addEventListeners(
      canvasRef,
      helperContextRef,
      selectedPiece,
      PIECES,
      setSuccess
    );

    if (imgRef.current) {
      handleResizer(canvasRef, helperCanvasRef, scaler, sizeRef, imgRef);
      initializePieces(
        sizeRef.current.rows,
        sizeRef.current.columns,
        topButtonsRef,
        sizeRef,
        PIECES
      );
      updateCanvas(
        contextRef,
        canvasRef,
        helperContextRef,
        helperCanvasRef,
        imgRef,
        sizeRef,
        PIECES
      );
    }
    itemsRef.current.style.display = "block";
  }, []);
  return (
    <div className="appContainer">
      <div className="mainContainer" ref={mainContainerRef}>
        <div ref={topButtonsRef} className="topButtons">
          <ControlButtons
            topButtonsRef={topButtonsRef}
            itemsRef={itemsRef}
            sizeRef={sizeRef}
            PIECES={PIECES}
            canvasRef={canvasRef}
            mainContainerRef={mainContainerRef}
          />
        </div>
        <CanvasImage
          canvasRef={canvasRef}
          helperCanvasRef={helperCanvasRef}
          imgRef={imgRef}
          imgUrl={imgUrl}
        />
        <MenuModal
          itemsRef={itemsRef}
          sizeRef={sizeRef}
          topButtonsRef={topButtonsRef}
          PIECES={PIECES}
          canvasRef={canvasRef}
          helperCanvasRef={helperCanvasRef}
          scaler={scaler}
          imgRef={imgRef}
          contextRef={contextRef}
          helperContextRef={helperContextRef}
          mainContainerRef={mainContainerRef}
          imgUrl={imgUrl}
        />
        <SuccessModal
          success={success}
          setSuccess={setSuccess}
          itemsRef={itemsRef}
          topButtonsRef={topButtonsRef}
        />
      </div>
    </div>
  );
};

export default CamPuzzle;
