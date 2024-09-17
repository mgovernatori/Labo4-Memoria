import React, { useEffect, useState, useRef } from "react";
import GameButton from "./gameButton";
import "../App.css";


function Game() {
   const colors = ["green", "red", "yellow", "blue"]; // array de colores que utiliza el juego
   const [level, setLevel] = useState([]); // controla la secuencia del nivel
   const [active, setActive] = useState(false); //  controla si se esta jugando o no
   const [levelIndex, setLevelIndex] = useState(0); // controla los índices de la secuencia
   const [playerTurn, setPlayerTurn] = useState(false); // controla si es el turno del jugador

   const refs = useRef(colors.map(() => React.createRef())); // array de refs para cada color

   const sounds = {
      // sonidos para cada botón
      green: new Audio("/src/sounds/green.mp3"),
      red: new Audio("/src/sounds/red.mp3"),
      yellow: new Audio("/src/sounds/yellow.mp3"),
      blue: new Audio("/src/sounds/blue.mp3"),
      lose: new Audio("/src/sounds/lose.mp3"), // cuando se pierde
      play: new Audio("/src/sounds/play.mp3"), // cuando se juega o reintenta
   };

   const playSound = (color) => {
      // función que reproduce el sonido
      const sound = sounds[color];
      Object.values(sounds).forEach((sound) => {
         // para cada sonido le baja el volumen
         sound.volume = 0.3;
      });
      if (sound) {
         sound.currentTime = 0;
         sound.play().catch((error) => {
            console.log("Error: ", error);
         });
      }
   };

   const stopSound = () => {
      // función que para el sonido, cuando se pierde
      Object.values(sounds).forEach((sound) => {
         sound.pause();
         sound.currentTime = 0;
      });
   };

   const handleStart = () => {
      // función que maneja el inicio del juego
      if (!active) {
         // si no se está jugando
         playSound(sounds.play.play());
         setTimeout(() => {
            // se inicializan los estados
            setActive(true);
            setLevel([]);
            setLevelIndex(0);
            addLevel();
         }, 500);
      }
   };

   const resetGame = () => {
      // función que reinicia el juego, estados iniciales
      setLevel([]);
      setActive(false);
      setLevelIndex(-1);
   };

   const addLevel = () => {
      // función que añade un nuevo color a la secuencia
      const newColor = colors[Math.floor(Math.random() * 4)]; // elección de un color random
      const newLevel = [...level, newColor]; // manteniendo la secuencia actual, se agrega un color
      setLevel(newLevel); // fijación del nuevo nivel
   };

   useEffect(() => {
      // parpadeo de los botones
      if (level.length > 0) {
         // si se está jugando
         const showLevel = (index = 0) => {
            // función que muestra el parpadeo
            setPlayerTurn(false);
            let ref = null;

            // modificamos el ref según el color que parpadeó
            if (level[index] === "green")
               ref = refs.current[colors.indexOf("green")];
            if (level[index] === "red")
               ref = refs.current[colors.indexOf("red")];
            if (level[index] === "yellow")
               ref = refs.current[colors.indexOf("yellow")];
            if (level[index] === "blue")
               ref = refs.current[colors.indexOf("blue")];

            setTimeout(() => {
               // un delay y luego parpadea mediante clase añadida al ref
               ref.current.classList.add("flash");
               playSound(level[index]); // sonido del botón

               setTimeout(() => {
                  ref.current.classList.remove("flash"); // quitamos la clase
                  if (index < level.length - 1) {
                     showLevel(index + 1); // mostramos nuevo nivel
                  } else {
                     setPlayerTurn(true); // turno del jugador de clickear
                  }
               }, level.length > 5 ? level.length > 10 ? 250 : 350 : 450); // verifica el largo de la secuencia y ajusta el delay en consecuencia
            }, level.length > 5 ? level.length > 10 ? 250 : 350 : 450);
         };
         showLevel();
      }
   }, [level]);

   const handleClick = (e) => {
      // función que maneja el click del jugador, recibiendo el evento
      if (playerTurn) {
         // si es el turno del jugador y no se esta mostrando el nivel
         const clicked = e.target.getAttribute("color"); // obtenemos el atributo color del evento
         playSound(clicked);

         if (level[levelIndex] === clicked) {
            // si coincide con el color que parpadeo en ese índice
            if (levelIndex === level.length - 1) {
               // si se termino de clickear la secuencia
               setTimeout(() => {
                  setLevelIndex(0);
                  setPlayerTurn(false);
                  addLevel(); // nuevo nivel
               }, 300);
            } else {
               setLevelIndex((prevIndex) => prevIndex + 1); // y si no cambiamos el índice de la secuencia en +1
            }
         } else {
            // si no coincide el click con el parpadeo reiniciamos y mostramos puntuación
            alert(`Has perdido! Puntuación: ${level.length - 1}`);
            setPlayerTurn(false);
            resetGame();
            stopSound();
            sounds.lose.play();
         }
      }
   };

   return (
      <section className="game">
         <div className="buttonContainer">
            {colors.map((value, index) => (
               // llamamos al componente gameButton mediante un map del array de coores
               <GameButton
                  key={index}
                  color={value}
                  onClick={handleClick}
                  ref={refs.current[index]} // le asignamos un ref a cada uno
                  style={{ pointerEvents: !playerTurn ? "none" : "auto" }} // quitamos los eventos al apuntar un botón si se esta mostrando el nivel
               />
            ))}
            <button onClick={handleStart} className="startButton">
               {active
                  ? `Puntuación: ${level.length - 1}`
                  : levelIndex < 0
                  ? "Reintentar"
                  : "Jugar"}
            </button>
         </div>
      </section>
   );
}

export default Game;
