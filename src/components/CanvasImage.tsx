import React, { FC } from "react";

interface canvasImageProps {
  canvasRef: any;
  helperCanvasRef: any;
  imgRef: any;
  imgUrl: string;
}

const CanvasImage: FC<canvasImageProps> = ({
  canvasRef,
  helperCanvasRef,
  imgRef,
  imgUrl,
}) => {
  return (
    <>
      <canvas ref={canvasRef} width="500px" />
      <canvas ref={helperCanvasRef} style={{ display: "none" }} />
      <img
        ref={imgRef}
        src={imgUrl ? imgUrl : "/images/backupPuzzle.jpg"}
        alt="Puzzle display"
      />
    </>
  );
};

export default CanvasImage;
