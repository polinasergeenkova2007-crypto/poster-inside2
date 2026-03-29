ObjC.import("Foundation");
ObjC.import("AppKit");

const fm = $.NSFileManager.defaultManager;
const cwd = ObjC.unwrap(fm.currentDirectoryPath);
const imagesDir = `${cwd}/images`;

const wallsPath = `${imagesDir}/walls.png`;
const roadPath = `${imagesDir}/brick-road.png`;
const outputPath = `${imagesDir}/walls-road-combined.png`;

const walls = $.NSImage.alloc.initWithContentsOfFile(wallsPath);
const road = $.NSImage.alloc.initWithContentsOfFile(roadPath);

if (!walls || !road) {
  throw new Error("Could not load source PNG files.");
}

const canvasSize = walls.size;
const canvas = $.NSImage.alloc.initWithSize(canvasSize);

canvas.performSelectorOnMainThreadWithObjectWaitUntilDone("lockFocus", null, true);

walls.drawInRectFromRectOperationFraction(
  $.NSMakeRect(0, 0, canvasSize.width, canvasSize.height),
  $.NSZeroRect,
  $.NSCompositingOperationSourceOver,
  1
);

const roadWidth = 276;
const roadHeight = 445;
const roadX = 253;
const roadY = canvasSize.height - 450 - roadHeight;

road.drawInRectFromRectOperationFraction(
  $.NSMakeRect(roadX, roadY, roadWidth, roadHeight),
  $.NSZeroRect,
  $.NSCompositingOperationSourceOver,
  1
);

canvas.performSelectorOnMainThreadWithObjectWaitUntilDone("unlockFocus", null, true);

const tiff = canvas.TIFFRepresentation;
const bitmap = $.NSBitmapImageRep.imageRepWithData(tiff);
const pngData = bitmap.representationUsingTypeProperties($.NSBitmapImageFileTypePNG, $({}));

pngData.writeToFileAtomically(outputPath, true);
