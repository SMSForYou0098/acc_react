import React,{memo,Fragment} from 'react'

import RadioBtn from '../elements/radio-btn'

const CardStyle = memo((props) => {
  return (
     <Fragment>
        <div className="mt-4 mb-3">
        <h6 className="d-inline-block mb-0 me-2">Card Style</h6>
        <small className="badge bg-warning rounded-pill">Pro</small>
        </div>
        <div className="d-grid gap-3 grid-cols-2 mb-3">
            <RadioBtn btnName="card_style" id="card_default" labelclassName="d-block" defaultChecked={props.cardStyle} value="card-default" >
               Default
            </RadioBtn>
            <RadioBtn btnName="card_style" id="card_glass" labelclassName="d-block" defaultChecked={props.cardStyle} value="card-glass">
               Glass
            </RadioBtn>
        </div>
        <RadioBtn btnName="card_style" id="card_transperant" labelclassName="d-block" defaultChecked={props.cardStyle} value="card-transparent" >
               Transparent Style
           </RadioBtn>
           
    </Fragment>
  )
})

CardStyle.displayName="CardStyle"
export default CardStyle