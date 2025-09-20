import React, { useContext, useEffect } from "react";
import { SpyAmount, PlayersContext } from "../App";
import "./Spy.css";

export default function SpyAmountComponent( {amountPass, countUpdate} ) {
  const { spies, setSpies } = useContext(SpyAmount);
  const { players, setPlayers } = useContext(PlayersContext);

  
  const increase = (amountSpies) => {
    // console.log(spies.amount);
    if (spies.amount < Object.keys(players).length - 4) {
      const realAmount = amountSpies + 1;
      setSpies({ amount: realAmount });
      amountPass(realAmount);
    } else if (spies.amount > Object.keys(players).length - 1){
      const realAmount = amountSpies - 1;
      setSpies({ amount: realAmount });
      amountPass(realAmount);
    }
  };
  
  const decrease = (amountSpies) => {
    // console.log(spies.amount);
    if (spies.amount > 1) {
      const realAmount = amountSpies - 1
      setSpies({ amount: realAmount });
      amountPass(realAmount);
    }
  };

  // ✅ wait for navigation to render element and then update counter
  useEffect(() => {
    if (countUpdate && spies.amount == Object.keys(players).length) {
      decrease(spies.amount);
    }
  }, [countUpdate]);
  
  return (
    <div className="spy-amount-container">
      <h3>К-сть шпигунів: {spies.amount ?? 0}</h3>
      <button onClick={() =>{decrease(spies.amount)}} className="spy-settings decrease">
        {" "}
        -{" "}
      </button>
      <button onClick={() =>{increase(spies.amount)}} className="spy-settings increase">
        {" "}
        +{" "}
      </button>
    </div>
  );
}
