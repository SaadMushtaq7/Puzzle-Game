export const handleResizer = (
  canvasRef: any,
  helperCanvasRef: any,
  scaler: number,
  sizeRef: any,
  imgRef: any
) => {
  canvasRef.width = window.innerWidth;
  canvasRef.height = window.innerHeight;

  helperCanvasRef.width = window.innerWidth;
  helperCanvasRef.height = window.innerHeight;

  let resizer =
    scaler *
    Math.min(
      window.innerWidth / imgRef.width || 350,
      window.innerHeight / imgRef.height || 530
    );

  sizeRef.width = resizer * imgRef.width || 300;
  sizeRef.height = resizer * imgRef.height || 530;
  sizeRef.x = window.innerWidth / 2 - sizeRef.width / 2;
  sizeRef.y = window.innerHeight / 2 - sizeRef.height / 2;
};

export const getRandomColor = () => {
  const red = Math.floor(Math.random() * 255);
  const green = Math.floor(Math.random() * 255);
  const blue = Math.floor(Math.random() * 255);

  return `rgb(${red},${green},${blue})`;
};

export const randomizePieces = (
  PIECES: any,
  canvasRef: any,
  mainContainerRef: any
) => {
  for (let i = 0; i < PIECES.length; i++) {
    let loc = {
      x: Math.random() * (canvasRef.width - PIECES[i].width),
      y: Math.random() * (canvasRef.height - PIECES[i].height),
    };
    PIECES[i].x = loc.x;
    PIECES[i].y = loc.y;
    PIECES[i].correct = false;
  }
};

export const getPressedPieceByColor = (
  loc: any,
  color: string,
  PIECES: any
) => {
  for (let i = PIECES.length - 1; i >= 0; i--) {
    if (PIECES[i].color === color) {
      return PIECES[i];
    }
  }
  return null;
};

export const isComplete = (PIECES: any) => {
  for (let i = 0; i < PIECES.length; i++) {
    if (PIECES[i].correct === false) {
      return false;
    }
  }
  return true;
};

export const getDifficulty = (level: string) => {
  switch (level) {
    case "2x2":
      return { row: 2, column: 2 };

    case "3x3":
      return { row: 3, column: 3 };

    case "4x4":
      return { row: 4, column: 4 };

    case "5x5":
      return { row: 5, column: 5 };

    case "6x6":
      return { row: 6, column: 6 };

    case "7x7":
      return { row: 7, column: 7 };

    case "8x8":
      return { row: 8, column: 8 };

    case "9x9":
      return { row: 9, column: 9 };

    case "10x10":
      return { row: 10, column: 10 };

    case "11x11":
      return { row: 11, column: 11 };

    case "12x12":
      return { row: 12, column: 12 };

    case "13x13":
      return { row: 13, column: 13 };

    default:
      return { row: 4, column: 4 };
  }
};

export const difficultyLevel = [
  "2x2",
  "3x3",
  "4x4",
  "5x5",
  "6x6",
  "7x7",
  "8x8",
  "9x9",
  "10x10",
  "12x12",
  "13x13",
];
