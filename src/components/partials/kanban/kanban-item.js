import React, {useRef } from 'react'
import  {useDrag} from 'react-dnd'

const KanbanItem = ({ id, children }) => {
    const ref = useRef(null);
  const [{ isDragging }, drag] = useDrag({
    type: "card",
    item: { id },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });
  const opacity = isDragging ? 0 : 1;
  drag(ref);
  return (
    <>
<div ref={ref} style={{ opacity }}>
      {children}
    </div>
    </>
  )
}

export default KanbanItem