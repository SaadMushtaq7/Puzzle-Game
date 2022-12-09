const completeApplauseAudio = new Audio("/audio/applause.wav");
completeApplauseAudio.volume = 0.2;

const isComplete = (PIECES: any) => {
  for (let i = 0; i < PIECES.length; i++) {
    if (PIECES[i].correct === false) {
      return false;
    }
  }
  return true;
};

const getPressedPieceByColor = (loc: any, color: string, PIECES: any) => {
  for (let i = PIECES.length - 1; i >= 0; i--) {
    if (PIECES[i].color === color) {
      return PIECES[i];
    }
  }
  return null;
};

const onMouseDown = (
  evt: any,
  helperContextRef: any,
  selectedPiece: any,
  PIECES: any
) => {
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
};

const onTouchStart = (
  evt: any,
  helperContextRef: any,
  selectedPiece: any,
  PIECES: any
) => {
  let loc = { x: evt.touches[0].clientX, y: evt.touches[0].clientY };
  onMouseDown(loc, helperContextRef, selectedPiece, PIECES);
};

const onMouseMove = (evt: any, selectedPiece: any) => {
  if (selectedPiece.current !== null) {
    selectedPiece.current.x = evt.x - selectedPiece.current.offset.x;
    selectedPiece.current.y = evt.y - selectedPiece.current.offset.y;
  }
};

const onTouchMove = (evt: any, selectedPiece: any) => {
  let loc = { x: evt.touches[0].clientX, y: evt.touches[0].clientY };
  onMouseMove(loc, selectedPiece);
};

const onMouseUp = (selectedPiece: any, PIECES: any, success: any) => {
  if (selectedPiece.current && selectedPiece.current.isClose()) {
    selectedPiece.current.snap();
    if (isComplete(PIECES.current)) {
      setTimeout(() => {
        completeApplauseAudio.play();
        success.current = true;
        console.log(success);
      }, 500);
    }
  }
  selectedPiece.current = null;
};

const onTouchEnd = (selectedPiece: any, PIECES: any, success: any) => {
  onMouseUp(selectedPiece, PIECES, success);
};

export const addEventListeners = (
  canvasRef: any,
  helperContextRef: any,
  selectedPiece: any,
  PIECES: any,
  success: any
) => {
  canvasRef.current.addEventListener("mousedown", (e: any) =>
    onMouseDown(e, helperContextRef, selectedPiece, PIECES)
  );
  canvasRef.current.addEventListener("mousemove", (e: any) =>
    onMouseMove(e, selectedPiece)
  );
  canvasRef.current.addEventListener("mouseup", () =>
    onMouseUp(selectedPiece, PIECES, success)
  );

  canvasRef.current.addEventListener("touchstart", (e: any) =>
    onTouchStart(e, helperContextRef, selectedPiece, PIECES)
  );
  canvasRef.current.addEventListener("touchmove", (e: any) =>
    onTouchMove(e, selectedPiece)
  );
  canvasRef.current.addEventListener("touchend", () =>
    onTouchEnd(selectedPiece, PIECES, success)
  );
};
