import React, { useRef } from 'react'
import { useDrop } from 'react-dnd'

const KanbanColumn = ({ status, changeTaskStatus, children }) => {
  const ref = useRef(null);
  const [, drop] = useDrop({
    accept: "card",
    drop(item) {
      changeTaskStatus(item.id, status);
    }
  });
  drop(ref);
  return (
    <>
      <div ref={ref} className='col-lg-3'> {children}</div>
    </>
  )
}

export default KanbanColumn