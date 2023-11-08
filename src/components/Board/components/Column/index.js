import { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import composeRefs from '@seznam/compose-react-refs'
import Card from './components/Card'
import withDroppable from '../../../withDroppable'
import CardAdder from './components/CardAdder'
import { pickPropOut } from '@services/utils'

const ColumnEmptyPlaceholder = forwardRef((props, ref) => (
  <div ref={ref} style={{ minHeight: 'inherit', height: 'inherit' }} {...props} />
))

const DroppableColumn = withDroppable(ColumnEmptyPlaceholder)

function Column({
  children,
  index: columnIndex,
  renderCard,
  renderColumnHeader,
  disableColumnDrag,
  disableCardDrag,
  onCardNew,
  allowAddCard,
}) {
  const listRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState(children.initialList);

/*   useEffect(() => {
    setItems(children.load(children.id, items.length));
  }, []); */

  let handleEndScroll = () => {
    console.log('end column', children.id);
    let aux = JSON.parse(JSON.stringify(items));
    console.log('load more', items.length);
    aux = [...aux, ...children.loadMode(children.id, items.length)];
    setItems(aux);
  };

  const handleScroll = useCallback((e) => {
    const {
      offsetHeight: height, // Visible list height (will be always the same)
      scrollHeight, // Entire list height (increases when we add more items to the list)
      scrollTop,
    } = e.target;

    if ((scrollTop + height + 20) >= scrollHeight && !loading) {
      // setLoading(true);
      // handleEndScroll();
    }
  }, [loading, setLoading]);

  useEffect(() => {
    const listDomNode = listRef.current;
    listDomNode.addEventListener('scroll', handleScroll);
    return () => {
      listDomNode.removeEventListener('scroll', handleScroll);
    }
  }, [listRef, handleScroll]);

  return (
    <Draggable draggableId={`column-draggable-${children.id}`} index={columnIndex} isDragDisabled={disableColumnDrag}>
      {(columnProvided) => {
        const draggablePropsWithoutStyle = pickPropOut(columnProvided.draggableProps, 'style')

        return (
          <div
            ref={composeRefs(columnProvided.innerRef, listRef)}
            {...draggablePropsWithoutStyle}
            style={{
              height: '100%',
              minHeight: '28px',
              display: 'inline-block',
              verticalAlign: 'top',
              ...columnProvided.draggableProps.style,
            }}
            className='react-kanban-column'
            data-testid={`column-${children.id}`}
          >
            <div {...columnProvided.dragHandleProps}>{renderColumnHeader(children)}</div>
            {allowAddCard && <CardAdder column={children} onConfirm={onCardNew} />}
            <DroppableColumn droppableId={String(children.id)}>
              {items.length ? (
                <>
                  {items.map((card, index) => (
                    <Card
                      key={card.id}
                      index={index}
                      renderCard={(dragging) => renderCard(children, card, dragging)}
                      disableCardDrag={disableCardDrag}
                    >
                      {card}
                    </Card>
                  ))}
                  <div>
                    <div>Listando {items.length}</div>
                    <button onClick={() => handleEndScroll(children, columnIndex)}>Carregar mais</button>
                  </div>
                </>
              ) : (
                <div className='react-kanban-card-skeleton' />
              )}
            </DroppableColumn>
          </div>
        )
      }}
    </Draggable>
  )
}

export default Column
