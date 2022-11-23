import React, { useState } from "react";
import { Puzzle, PuzzleGame } from "react-puzzle-game";
import Resizer from "react-image-file-resizer";
import { RiImageAddFill } from "react-icons/ri";

const JigsawPuzzle = () => {
  const [imgUrl, setImgUrl] = useState<any>();

  const fileChangedHandler = (event: any) => {
    if (event.target.files[0]) {
      try {
        Resizer.imageFileResizer(
          event.target.files[0],
          300,
          300,
          "JPEG",
          100,
          0,
          (uri) => {
            setImgUrl(uri);
          },
          "base64",
          320,
          320
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="puzzleContainer">
      <h1 className="heading">The Puzzle</h1>
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
      {imgUrl && (
        <span className="puzzleBox">
          <PuzzleGame
            src={imgUrl}
            columnsCount={3}
            rowsCount={3}
            height={280}
            width={280}
            onFinish={() => alert("Finished!!")}
          >
            <Puzzle />
          </PuzzleGame>
        </span>
      )}
    </div>
  );
};

export default JigsawPuzzle;
