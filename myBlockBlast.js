// גודל הלוח
const boardSize = 10;

// יצירת הלוח (מערך דו-ממדי)
const board = [];
for (let i = 0; i < boardSize; i++) {
  board[i] = [];
  for (let j = 0; j < boardSize; j++) {
    board[i][j] = 0;
  }
}

// רשימת צורות לדוגמה

/*
const shapes = [
    [ // ריבוע 2x2
      [1, 1],
      [1, 1]
    ],
    [ // צורת "L"
      [1, 0],
      [1, 0],
      [1, 1]
    ],
    [ // קו ישר 1x4
      [1, 1, 1, 1]
    ],
    [ // צורת "Z"
      [0, 1, 1],
      [1, 1, 0]
    ],
    [ // צורת "S"
      [1, 1, 0],
      [0, 1, 1]
    ],
    [ // צורת "T"
      [1, 1, 1],
      [0, 1, 0]
    ],
    [ // צורת "זיקית"
      [1, 0, 1],
      [1, 1, 0]
    ],
    [ // צורת "חצי הריבוע"
      [1, 1],
      [0, 1]
    ],
    [ // צורת "משולש"
      [1, 1, 1],
      [0, 1, 0]
    ],
    [ // צורת "ריבוע משולש"
      [1, 1],
      [1, 0],
      [1, 1]
    ],
    [ // צורת "קו עולה"
      [0, 1, 0],
      [1, 1, 1]
    ],
    [ // צורת "קו יורד"
      [1, 1, 1],
      [0, 1, 0]
    ],
    [ // צורת "פס"
      [1, 0],
      [1, 1],
      [0, 1]
    ],
    [ // צורת "שני ריבועים"
      [1, 1],
      [0, 1],
      [0, 1]
    ]
];
*/



const shapes = [
  [ // ריבוע 2x2
    [1,1,1,1,1],
    [1,1,1,1,1]
  ]
  ,
  
  [ // קו ישר 1x4
    [1, 1,1,1,1]
  ],
  
];


// בחירת צורה (הופך את הצורה הנבחרת)
let currentShape = null;
let currentShapeElement = null;
let previousShapeElement = null;

let points=0;


// פונקציה ליצירת הלוח ב-HTML
function renderBoard(gameOver=0) {
  const boardElement = document.getElementById('board');
  boardElement.innerHTML = ''; // איפוס התצוגה

  if(gameOver==1){
    const scoreElement = document.getElementById('score');
    scoreElement.innerHTML="Game Over Your Score is: "+points;
    const shapesContainerElement = document.getElementById('shapes-container');
    shapesContainerElement.innerHTML="";

  }
  else{
    for (let rowIndex = 0; rowIndex < boardSize; rowIndex++) {
      for (let colIndex = 0; colIndex < boardSize; colIndex++) {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        if (board[rowIndex][colIndex] === 1) {
          cellElement.classList.add('filled'); // משבצת צבועה
        }
        else{
          cellElement.classList.add('empty');
        }

        // לחיצה על משבצת בלוח
        cellElement.addEventListener('click', function() {
          placeShape([rowIndex,colIndex]);
        });

        cellElement.addEventListener('mouseover', function() {
          if (canPlace([rowIndex, colIndex],currentShape)) {
            highlightPreview([rowIndex, colIndex]); // הצגת preview של הצורה
          }
        });

        boardElement.appendChild(cellElement);
      }
    }
  }
}


function highlightPreview(cell) {
  const [row, col] = cell;
  const shapePreviewCells = []; // לאחסן את המשבצות שצריך להדגיש

  const start = getKeyCell(currentShape);
  const startRow = start[0];
  const startCol = start[1];

  // בודק אם הצורה יכולה להיכנס ומדגיש את המשבצות
  for (let i = 0; i < currentShape.length; i++) {
    for (let j = 0; j < currentShape[i].length; j++) {
      if (currentShape[i][j] === 1) {
        const newRow = row + i - startRow;
        const newCol = col + j - startCol;
        if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
          const cellIndex = newRow * boardSize + newCol;
          shapePreviewCells.push(cellIndex);
        }
      }
    }
  }

  // מנקה את הצבע של כל המשבצות
  document.querySelectorAll('.cell').forEach(cell => {
    cell.style.backgroundColor = "";
  });

  shapePreviewCells.forEach(index => {
    const cell = document.querySelectorAll('.cell')[index];
    cell.style.backgroundColor="#8dea87"
  });
}

let shapesGenerated=[];


// פונקציה להצגת הצורות שיתבצע בהן קליק
function renderShapeSelection() {
    const shapesContainer = document.getElementById('shapes-container');
    shapesContainer.innerHTML = ''; // איפוס התצוגה
    shapesGenerated=[];
    for (let i = 0; i < 3; i++) {
      const shape = shapes[Math.floor(Math.random() * shapes.length)];  //מגריל צורה ממערך הצורות
      shapesGenerated.push(shape);

      const shapeElement = document.createElement('div'); //יוצר אלמנט דיב לכל צורה
      shapeElement.classList.add('shape');// מוסיף לו את התכונה צורה 
      
      // הצגת הצורה
      for (let rowIndex = 0; rowIndex < shape.length; rowIndex++) { //עובר על כל שורה בצורה
        const row = shape[rowIndex]; // השורה הנוכחית בצורה שהוגרל
        const rowElement = document.createElement('div'); // יוצר אלמנט דיב לכל שורה בצורה
        rowElement.classList.add('shape-row'); // \\מוסיף תכונה לכל שורה בצורה
        
        for (let colIndex = 0; colIndex < row.length; colIndex++) { // עובר על כל עמודה של כל שורה בצורה
          const cell = row[colIndex]; //המשבצת של העמודה הנוכחית בשורה הנוכחית של הצורה
          const cellElement = document.createElement('div'); //יוצר אלמנט דיב למשבצת
          cellElement.classList.add('shape-cell'); // מוסיף תכונה לאלמנט של המשבצת
          
          if (cell === 1) { // אם המשבצת מלאה
            cellElement.classList.add('filled'); // מוסיף תכונה שהיא צובעת את המשבצת המלאה
          } else {
            cellElement.classList.add('empty'); // מוסיף תכונה למשבצת ריקה שצובעת בצבע לבן כדי שלא יראו אותה
          }
  
          rowElement.appendChild(cellElement); // מוסיף אלמנט של משבצת לכל תא במערך של הצורה שהוגרלה
        }
        
        shapeElement.appendChild(rowElement); //מוסיף אלמנט שורה לכל שורה במערך של הצורה שהוגרלה
      }

      // הוספת פעולה כאשר המשתמש לוחץ על משבצת בלוח
      shapeElement.addEventListener('click', function() {
        previousShapeElement=currentShapeElement;// מעדכן את הקודם לנוכחי

        currentShape=shape; // מעדכנת את הצורה הנוכחית לצורה שהוא בחר
        currentShapeElement=shapeElement // מעדכן את האלמנט של הצורה הנוכחית לאלמנט של הצורה שנבחרה
        
        const shapeCells = currentShapeElement.querySelectorAll('.shape-cell'); // רשימה מקושרת של כל המשבצות בצורה
        
        if(previousShapeElement!=null){
          const PreShapeCells = previousShapeElement.querySelectorAll('.shape-cell'); // רשימה מקושרת של כל המשבצות בצורה הקודמת
          PreShapeCells.forEach(cell => { //משנה צבע לאדום לצורה הקודמת
            if (cell.classList.contains('filled')) {
              cell.style.backgroundColor = '#4caf50';
            }
          });
        }
        shapeCells.forEach(cell => { //משנה צבע לאדום לצורה שנבחרה
          if (cell.classList.contains('filled')) {
            cell.style.backgroundColor = 'red';
          }
        });
      });

      shapesContainer.appendChild(shapeElement); // מציג את הצורה שהוגרלה
    } //חזור על זה 3 פעמים
}


function print2DArray(arr) {
    let output = '';
    for (let i = 0; i < arr.length; i++) {
      output += arr[i].join(' ') + '\n';  // הצגת כל שורה של המערך כטקסט עם רווחים בין התאים
    }
    alert(output);  // הדפסת המחרוזת עם alert
}


function getKeyCell(shape) {
  for (let rowIndex = 0; rowIndex < shape.length; rowIndex++) {
      const row = shape[rowIndex];
      
      // סרוק כל תא בשורה
      for (let colIndex = 0; colIndex < row.length; colIndex++) {
          const cell = row[colIndex];
          if (cell === 1) {
              return [rowIndex, colIndex]; // מחזיר מערך עם השורה והעמודה
          }
      }
  }
  return null; // אם לא מצאנו תא שווה ל-1, מחזירים null
}

function canPlace(board_cell,shape){
  start=getKeyCell(shape);

  const startRow = start[0];  // השורה בה מתחילה הצורה
  const startCol = start[1];  // העמודה בה מתחילה הצורה

  // קבלת מיקום הלוח שהמשתמש לחץ עליו
  const row = board_cell[0];
  const col = board_cell[1];


  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[i].length; j++) {
      if (shape[i][j] === 1) {  // אם תא בצורת "מלא"
        const newRow = row + i - startRow;  // חשב את השורה החדשה
        const newCol = col + j - startCol;  // חשב את העמודה החדשה

        // אם המיקום החדש לא בתווך הלוח או אם התא כבר מלא בלוח
        if (newRow < 0 || newRow >= boardSize || newCol < 0 || newCol >= boardSize || board[newRow][newCol] === 1) {
          //alert("לא ניתן למקם את הצורה במיקום הזה.");
          return false;  // לא ניתן למקם את הצורה כאן
        }
      }
    }
  }
  
  // אם כל הבדיקות עברו בהצלחה, הצורה יכולה להיות ממוקמת
  return true;
}


// משתנה למעקב אחרי כמות הצורות שהונחו
let placedShapesCount = 0;

// פונקציה לעדכון הצורות לאחר שהמשתמש הניח את כולן
function handleShapePlacement() {
  placedShapesCount++; // עדכון המונה

  if (placedShapesCount === 3) {
    // אם הניח את כל 3 הצורות, גרול 3 חדשות
    renderShapeSelection();
    placedShapesCount = 0; // איפוס המונה
  }
}

// עדכון פונקציית placeShape
function placeShape(board_cell) {

  // בדוק אם ניתן להניח את הצורה במיקום המבוקש
  if (canPlace(board_cell,currentShape)) {
    const start = getKeyCell(currentShape);  // קבלת המיקום של הצורה
    const startRow = start[0];
    const startCol = start[1];

    let index=shapesGenerated.indexOf(currentShape);
    shapesGenerated.splice(index,1);
  
    const row = board_cell[0];
    const col = board_cell[1];
  
    // הנחת הצורה על הלוח
    for (let i = 0; i < currentShape.length; i++) {
      for (let j = 0; j < currentShape[i].length; j++) {
        if (currentShape[i][j] === 1) {  // אם התא בצורת מלא
          const newRow = row + i - startRow;  // מיקום השורה החדש
          const newCol = col + j - startCol;  // מיקום העמודה החדש
  
          // אם המיקום נמצא בטווח הלוח, עדכן את הלוח
          if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
            board[newRow][newCol] = 1;  // מניח את הצורה על הלוח
          }
        }
      }
    }

    currentShapeElement.style.visibility = 'hidden'; // נעלים את הצורה שהונחה


    currentShape = null; // איפוס הנוכחי עד שהוא יבחר שוב צורה
    currentShapeElement = null; // איפוס הנוכחי עד שהוא יבחר שוב צורה

    check(); // בדיקה שורות ועמודות מלאות 
    
    renderBoard();  // עדכון הלוח בהצגת הצורה החדשה

    // עדכון כמות הצורות שהונחו
    handleShapePlacement();

    updatePoints();

    isGameOver();


  } 
}

function check() {
  //בדיקה אם שורה מלאה
  for (let rowIndex = 0; rowIndex < boardSize; rowIndex++) {
    let isRowFull = true;

    // בדיקה אם כל התאים בשורה מלאים
    for (let colIndex = 0; colIndex < boardSize; colIndex++) {
      if (board[rowIndex][colIndex] === 0) {
        isRowFull = false;
        break;
      }
    }

    // אם השורה מלאה
    if (isRowFull) {
      points+=10;
      for (let colIndex = 0; colIndex < boardSize; colIndex++) {
        board[rowIndex][colIndex] = 2; // איפוס השורה בלוח
      }
    }
  }

  //בדיקה אם עמודה מלאה
  for (let rowIndex = 0; rowIndex < boardSize; rowIndex++) {
    let isColFull = true;

    // בדיקה אם כל התאים בעמודה מלאים
    for (let colIndex = 0; colIndex < boardSize; colIndex++) {
      if (board[colIndex][rowIndex] === 0) {
        isColFull = false;
        break;
      }
    }

    // אם עמודה מלאה
    if (isColFull) {
      points+=10;
      for (let colIndex = 0; colIndex < boardSize; colIndex++) {
        board[colIndex][rowIndex] = 2; // איפוס השורה בלוח
      }
    }
  }

  for(let i=0;i<boardSize;i++){
    for(let j=0;j<boardSize;j++){
      if(board[i][j]==2){
        board[i][j]=0;
      }
    }
  }

}


function isGameOver(){
  flag=false;
  for(let rowIndex=0;rowIndex<boardSize;rowIndex++){
    for(let colIndex=0;colIndex<boardSize;colIndex++){
      for(let k=0;k<shapesGenerated.length;k++){
        if(canPlace([rowIndex,colIndex],shapesGenerated[k])){
          flag=true;
        }
      }
    }
  }
  if(!flag){
    renderBoard(1);
    points=0;
    alert("you lose");
    
  }
}

function updatePoints(){
  const scoreElement = document.getElementById('score');
  scoreElement.innerHTML="Score: "+points;
}

function startGame(){
  // הצגת הצורות לבחירה
  renderShapeSelection();
  // הצגת הלוח בהתחלה
  renderBoard();
}









