import { useEffect, useRef, useState } from 'react';
import Board from '../src'
import getUrlParams from './services/getUrlParams'
import '../src/styles.css'

const App = () => {

  const [board, setBoard] = useState(null);

  // example
  const generateCards = (columnId, listLength) => {
    return [0,1,2,3,4,5,6,7,8,9].map((number) => ({
      id: columnId + number + listLength,
      title: 'Card - ' + columnId + number + listLength,
      description: 'Card content - ' + columnId + number + listLength,
    }));
  }

  useEffect(() => {
    let aux = {
      columns: [
        {
          id: 'new',
          title: 'Novos',
          initialList: generateCards('new', 0),
          // load: generateCards,
          loadMode: generateCards,
        },
        {
          id: 'attempt',
          title: 'Tentativa',
          initialList: generateCards('attempt', 0),
          // load: generateCards,
          loadMode: generateCards,
        },
        {
          id: 'attendance',
          title: 'Atendimento',
          initialList: generateCards('attendance', 0),
          // load: generateCards,
          loadMode: generateCards,
        },
        {
          id: 'won',
          title: 'Ganho',
          initialList: generateCards('won', 0),
          // load: generateCards,
          loadMode: generateCards,
        },
      ]
    };
    setBoard(aux);
  }, []);

/*   const handleEndScroll = (column, index) => {
    console.log('end column', column);
    let aux = JSON.parse(JSON.stringify(board));
    aux.columns[index].cards = [...aux.columns[index].cards, ...generateCards(index + 1, aux.columns[index].cards.length)]
    console.log(aux);
    setBoard(aux);
  }; */

  if (!board) return null;
	return (
		<Board
      onCardDragEnd={(card, coord) => {
        console.log({card, coord});
        alert(`Deseja transferir o lead ${card} da coluna ${coord.source.fromColumnId} para a coluna ${coord.destination.toColumnId}`)
      }}
    >
      {board}
    </Board>
	);
};

export default App;
