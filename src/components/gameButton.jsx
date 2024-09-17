import { forwardRef } from "react";

const GameButton = forwardRef(({color, onClick }, ref) => (
   <button onClick={onClick} color={color} className={`button ${color} `} ref={ref} />
));

export default GameButton;
